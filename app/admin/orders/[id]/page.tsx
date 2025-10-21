// app/admin/orders/[id]/page.tsx
export const dynamic = "force-dynamic";

export default function AdminOrderProbe({ params }: { params: { id: string } }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Order Detail – probe</h1>
      <p>ID: {params.id}</p>
    </div>
  );
}
