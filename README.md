README — Wine Connect (snapshot)
Stack

Next.js 14 (App Router), TypeScript

Supabase: Auth, Postgres, Storage, RLS

UI: Tailwind, stile Wine Connect (gradient navy, cards traslucide, primary #E33955)

Hosting: Vercel

Auth

Login via Supabase (email+password).

app/auth/callback/route.ts scambia il code e scrive i cookie.

Ruoli:

buyers (utenti)

admins (tabella admins)

Rotte principali (buyer)

/login – form styled WC

/buyer-home – landing post-login (scelta: Tailored vs Browse)

/catalog – catalogo filtrabile

/cart/samples – carrello campionature (SSR)

/profile – profilo, indirizzi, compliance

Sezione admin

/admin – gate con requireAdmin

/admin/wineries – CRUD cantine

/admin/wines – CRUD vini + upload immagini (Storage)

/admin/wines/[id] – dettagli vino

/admin/orders – lista ordini + update status

Modello dati (public)
buyers

id (uuid, pk)

auth_user_id (uuid) → auth.users.id

email text

company_name text

contact_name text

country text

compliance_mode text (self | delegate)

created_at timestamptz

addresses

id (uuid, pk)

buyer_id (uuid) → buyers.id

label text

address text (via e civico)

city text

zip text

country text

is_default bool

created_at timestamptz

wineries

id (uuid, pk)

name text

region text

… (altri campi anagrafici)

wines

id (uuid, pk)

winery_id (uuid) → wineries.id

name text

vintage int

type text

region text

image_url text

price_ex_cellar numeric

price_sample numeric

created_at timestamptz

Storage

Bucket wines → immagini; image_url salvata nella riga vino.

vw_catalog (VIEW)

Campi aggregati per il catalogo:

wine_id, wine_name, vintage, type, region

winery_name

image_url

price_ex_cellar, price_sample

created_at

carts

id (uuid, pk)

buyer_id (uuid) → buyers.id

type text (per ora: sample)

status text (open / submitted)

created_at timestamptz

cart_items

id (uuid, pk)

cart_id (uuid) → carts.id

wine_id (uuid) → wines.id

quantity int

unit_price numeric

list_type text (per ora: sample)

orders

id (uuid, pk)

buyer_id (uuid) → buyers.id

type text (sample / order)

status text (pending/processing/shipped/completed/cancelled)

tracking_code text

created_at timestamptz

admins

id (uuid, pk)

auth_user_id uuid

role text (es. admin)

compliance_records

id (uuid, pk)

buyer_id uuid

mode text (self / delegate)

documents jsonb (riferimenti a file su Storage)

shipping_documents (stub)

Per documenti doganali/spedizione (da definire meglio).

RLS (intento)

buyers: r/w solo propria riga ( auth.uid() = auth_user_id ).

addresses: r/w se l’indirizzo appartiene al proprio buyer_id.

carts / cart_items: r/w solo per il proprio buyer_id.

orders: visibili solo al buyer owner o admin.

wines / wineries: lettura libera; mutazioni solo admin.

compliance_records: r/w owner o admin.

API implementate (principali)

Buyer

POST /api/cart/add → crea/apre cart sample e aggiunge item.

POST /api/cart/item/update → aggiorna qty (0 ⇒ remove).

POST /api/cart/item/remove

POST /api/cart/checkout → valida indirizzo, genera orders di tipo sample.

POST /api/profile/address/create → crea indirizzo (redirect 303 a /profile).

POST /api/profile/address/delete → (fix sotto) elimina indirizzo, ownership-check.

(opz) POST /api/profile/update → aggiorna company/contact/country.

Admin

POST /api/admin/wines/upload-image → upload su Storage + update wines.image_url.

CRUD wineries e wines.

POST /api/admin/orders/update-status.

Pagine

Public

/login (stile WC)

Buyer

/buyer-home (shortcuts: Catalog, Sample cart, Profile & compliance)

/catalog (filtri, sort, paginazione, “Add sample” via POST form)

/cart/samples (line items, qty/update/remove, selezione indirizzo, checkout)

/profile (Your profile editabile, Addresses con form styled, Compliance con upload box styled)

Admin

/admin/wineries (lista + creare/editar/cancellare)

/admin/wines (lista + upload img + “Edit details”)

/admin/wines/[id]

/admin/orders (aggiorna status)

UI conventions

Cards: bg-white/[0.04] + border-white/10

Inputs: bg-black/30 + border-white/10 + placeholder text-white/40

Primary: fondo #E33955, testo scuro

Footer destro, text-white/70, xs

Roadmap (shortlist)

Buyer “Tailored service” wizard (step, salvataggio brief).

“My orders” (storico + stati + tracking).

Catalog: filtri selettivi da DB (type/region/winery unici).

Profilo: upload doc compliance (Storage compliance/…) + gestione compliance_mode.

Admin: /admin/orders/[id] con items, indirizzo, documenti.

RLS hardening; generazione types Supabase; activity logs.

Env

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

(server) SUPABASE_SERVICE_ROLE_KEY se necessario.

NEXT_PUBLIC_SITE_URL (consigliato) per redirect consistenti.
