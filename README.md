Here’s a single, copy-pasteable briefing you can drop into a new chat to bring the next assistant fully up to speed on **Wine Connect**. It summarizes stack, ENV, DB, APIs, pages, behaviors, and open items.

---

# Wine Connect – Working Summary (current state)

## Stack

* **Next.js 14 (App Router)** + **TypeScript**
* **TailwindCSS** (custom brand styling; primary `#E33955`)
* **Supabase** (Postgres + Auth + Storage)
* Hosted on **Vercel**

## Environment variables (required)

```
NEXT_PUBLIC_SUPABASE_URL=<...>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<...>
SUPABASE_SERVICE_ROLE_KEY=<...>    # server only (policies/migrations/jobs)
NEXT_PUBLIC_SITE_URL=https://www.wearewineconnect.com
```

## Storage buckets

* `wines` — public images (catalog cards)
* `compliance` — public bucket **with RLS** so only the owner can write; we store files under:

  * `compliance/{buyer_id}/importer_license/{uuid-filename}`
  * `compliance/{buyer_id}/company_vat/{uuid-filename}`

(Reading is public via signed/public URLs; writes are restricted to the buyer’s own prefix.)

## Database (Postgres / Supabase)

### Tables (key fields only)

* **buyers**

  * `id uuid PK`
  * `auth_user_id uuid UNIQUE` (Supabase auth user)
  * `company_name text`
  * `contact_name text`
  * `email text`
  * `country text`
  * `compliance_mode compliance_mode DEFAULT 'self'`
  * `created_at timestamptz default now()`
  * (`updated_at` is **not** required; API no longer depends on it)

* **addresses**

  * `id uuid PK`
  * `buyer_id uuid FK -> buyers.id`
  * `label text`
  * `address text` (street and number)
  * `city text`
  * `zip text`
  * `country text`
  * `is_default boolean default false`
  * `is_active boolean default true`  ← used for **soft-delete**
  * `created_at timestamptz default now()`

* **carts**

  * `id uuid PK`
  * `buyer_id uuid FK`
  * `type text` (currently `'sample'`)
  * `status text` (`'open' | 'checked_out'`), default `'open'`
  * `created_at timestamptz`

* **cart_items**

  * `id uuid PK`
  * `cart_id uuid FK`
  * `wine_id uuid FK -> wines.id`
  * `quantity int`
  * `unit_price numeric`
  * `list_type text` (currently `'sample'`)
  * `created_at timestamptz`

* **orders**

  * `id uuid PK`
  * `buyer_id uuid FK`
  * `cart_id uuid FK NULLABLE`
  * `shipping_address_id uuid FK -> addresses.id`
    (We **don’t** delete rows in `addresses` referenced by orders. Instead we **soft-delete**: `is_active=false` so it disappears from the UI but remains valid for historical orders.)
  * `status text` (`pending | processing | shipped | completed | cancelled`)
  * `total numeric`
  * `created_at timestamptz`

* **wines** (basic catalog fields; images read from `wines` bucket)

* **vw_catalog** (view used by `/catalog`; columns include: `wine_id`, `wine_name`, `vintage`, `winery_name`, `region`, `type`, `price_ex_cellar`, `price_sample`, `created_at`, `image_url`)

* **compliance_records**

  * `id uuid PK`
  * `buyer_id uuid UNIQUE FK`
  * `mode compliance_mode NOT NULL DEFAULT 'self'`
  * `documents jsonb NOT NULL DEFAULT '{}'`

    * Shape we use:

      ```json
      {
        "importer_license": [ { "id": "uuid", "name": "file.pdf", "url": "https://...", "uploaded_at": "...", "hidden": false } ],
        "company_vat":     [ { ... } ]
      }
      ```

* **admins** (optional helper table if needed)

  * `auth_user_id uuid PRIMARY KEY`

### Enums

* `compliance_mode`: `'self' | 'delegate'`
  (We previously had `delegate_wc`; current app uses only `self` and `delegate`.)

### RLS (high level)

* For **buyers/addresses/carts/cart_items/orders/compliance_records**:

  * Row access tied by `buyers.auth_user_id == auth.uid()` (or through joins). Buyers can **select** only their own rows; can **insert/update** only rows that belong to them.
* **Storage** (`compliance` bucket):

  * Public read of existing objects.
  * Authenticated users can `insert/update` **only** under `compliance/{buyer_id-of-current-user}/...`.

*(Exact SQL policies exist; can be re-shared if needed.)*

## Frontend pages (implemented / restyled)

### `/login` (+ `/auth/callback`)

* Styled to match brand.
* Email+password login & signup via Supabase.
* Redirects to `/catalog` after login/signup email flow.

### `/buyer-home`

* Restyled dashboard.
* “Your latest orders” section removed (per request).
* Quick links: **Catalog**, **Profile & compliance**, **Sample cart**.
* Matching header/footer across private pages.

### `/catalog`

* Restyled grid with brand gradient background.
* Filters: **Search**, **Type**, **Region**, **Winery** + **Sort** (name / sample price asc|desc / recent).
* Pagination (24 per page).
* Card shows wine info + prices (ex-cellar & sample) + **Add sample** form.

### `/cart/samples`

* Server component, **functional** (no style changes that break logic).
* Shows open `sample` cart, line items with thumb, qty update, remove, subtotal.
* **Checkout** requires at least one address (select box).
* Empty state links back to catalog.

### `/profile`

* Consistent header/footer and brand background.
* **Identity** block is **editable** now:

  * `company_name`, `contact_name`, `country` + (email is read-only).
  * POST `/api/profile/update` and success banner (`?ok=profile_updated`).
* **Addresses**:

  * Create form with “set as default”.
  * List of **active** addresses (`is_active=true`) with **Delete**.
  * **Delete behavior**:

    * If address is referenced by an order, we **soft-delete**: set `is_active=false`. It disappears from Profile & checkout but remains for order history.
    * If not referenced, hard delete is allowed.
  * Banners: `?ok=address_created | address_deleted`, errors: `?err=forbidden | not_found`.
* **Compliance**:

  * Mode toggle: **Self** / **Delegate to Wine Connect** → `/api/profile/compliance/update-mode`
  * Two upload panels (custom English UI, not browser-localized):

    * **Importer license** (PDF/PNG/JPG ≤ 10MB)
    * **Company ID / VAT** (PDF/PNG/JPG ≤ 10MB)
  * Upload to `compliance/{buyer_id}/{kind}/{uuid-filename}` then upsert `compliance_records.documents` with appended doc object.
  * **Remove** button: **soft-remove** by setting `hidden=true` in the JSONB array (file remains in storage for backup).
  * Banners:

    * success: `?ok=document_uploaded`, `?ok=document_removed`, `?ok=compliance_mode_updated`
    * errors: `?err=bad_type | file_too_large | upload_failed | save_failed`

## API routes (server actions under `app/api/.../route.ts`)

* Cart

  * `POST /api/cart/add` — add item to `open` sample cart (creates cart if needed)
  * `POST /api/cart/item/update` — update quantity (0 allowed; client uses separate remove)
  * `POST /api/cart/item/remove` — remove a cart item
  * `POST /api/cart/checkout` — checkout sample cart (uses selected address)
* Profile – identity & addresses

  * `POST /api/profile/update` — update `buyers.company_name/contact_name/country`
  * `POST /api/profile/address/create` — create address
  * `POST /api/profile/address/delete` — hard delete if unused, else `is_active=false`
* Compliance

  * `POST /api/profile/compliance/update-mode` — sets `compliance_records.mode` to `'self'|'delegate'` (fix applied for enum mismatch)
  * `POST /api/profile/compliance/upload` — validate file, upload to bucket, append to `documents[kind]`
  * `POST /api/profile/compliance/remove` — mark a `documents[kind][i].hidden=true`

## Important fixes & notes

* **307 during update-mode**: root cause was enum mismatch; standardized to `compliance_mode: 'self'|'delegate'`. API adjusted accordingly.
* **Profile update error** (`updated_at` missing): removed dependency; API now updates without touching non-existent columns.
* **Address deletion blocked by FK**: introduced **soft-delete** (`is_active=false`) when address is referenced by an order. Profile and checkout read only `is_active=true`.
* **Italian labels on file inputs**: replaced with custom picker (“Select file” / “No file selected”) so UI is always English.

## UX banners (querystring)

* `?ok=`: `address_created`, `address_deleted`, `profile_updated`, `document_uploaded`, `document_removed`, `compliance_mode_updated`
* `?err=`: `forbidden`, `not_found`, `bad_type`, `file_too_large`, `upload_failed`, `save_failed`

## Roadmap / Next

1. **Orders page(s)**

   * List + detail (line items, shipping address snapshot, compliance status snapshot).
2. **Checkout flow**

   * Confirmation screen + order creation + email notifications (if needed).
3. **Admin**

   * Basic back office for wines, prices, buyers, orders.
4. **Search facets**

   * Type/region/winery into controlled lists; add country filters per winery.
5. **Performance**

   * Image optimization, signed URLs for compliance if we want private reads.
6. **Analytics & logs**

   * More verbose server logs (structured console) for all API routes.

## How to run locally

1. Set ENV in `.env.local` (values above).
2. `npm i` → `npm run dev`
3. Ensure Supabase has:

   * `vw_catalog` view,
   * `compliance_mode` enum with `'self'|'delegate'`,
   * RLS policies for tables + `compliance` bucket as described.

---

If you need any file paths quickly:

* Pages: `app/login/page.tsx`, `app/auth/callback/route.ts`, `app/catalog/page.tsx`, `app/cart/samples/page.tsx`, `app/profile/page.tsx`
* Profile components: `components/profile/Addresses.tsx`, `components/profile/Compliance.tsx`
* APIs: `app/api/.../route.ts` as listed above
* Supabase helpers: `lib/supabase/server.ts`, `lib/supabase/client.ts`

This is the current, working baseline.
