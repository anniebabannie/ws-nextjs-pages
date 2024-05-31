"use client"
import { useOrders } from '@/components/use-orders';

function Index() {
  const { orders } = useOrders();

  return (
    <ol>
      {orders.map((o) => (
        <li key={o.id}>
          <code>{JSON.stringify(o)}</code>
        </li>
      ))}
    </ol>
  );
}

export default Index;