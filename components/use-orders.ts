import { Order } from "@/server/order-service";
import { useEffect, useState } from "react";

let ws: WebSocket;
if (typeof window !== "undefined") {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

  ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
  setInterval(() => {
    if (ws.readyState !== ws.OPEN) {
      ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
      return;
    }

    ws.send(`{"event":"ping"}`);
  }, 29000);
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const onMessage = (msg: MessageEvent) => {
      const event = JSON.parse(msg.data) as { event: string; detail: any };

      if (event.event === "order-received") {
        setOrders((prev) => {
          const next = [...prev];
          next.push(event.detail.order as Order);

          // Limit the array to 12 items
          if (next.length > 12) {
            return next.splice(-12);
          }
          return next;
        });
      }
    };

    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("message", onMessage);
    };
  }, []);

  return { orders };
}