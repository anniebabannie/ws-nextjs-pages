import { RawData, WebSocket } from "ws";
import { IncomingMessage } from "http";
import internal from "stream";
import { WebSocketServer } from "ws";
import { OrderService } from "@/server/order-service";

const wss = new WebSocketServer({ noServer: true });
const orderService = new OrderService();
const clients = new Set();

// wss.on('connection', (ws, req) => {
//   console.log('New client connected');

//   // Set up event listeners for the WebSocket instance (ws)
//   ws.on('message', (message) => {
//     console.log(`Received message: ${message}`);
//     // Echo the message back to the client
//     ws.send(`Echo: ${message}`);
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

export function handleUpgrade(
  req: IncomingMessage,
  socket: internal.Duplex,
  head: Buffer
) {
  wss.handleUpgrade(req, socket, head, (client: WebSocket) => {
    wss.emit('connection', client, req);

  });
}

// export function handleUpgrade(
//   req: IncomingMessage,
//   socket: internal.Duplex,
//   head: Buffer
// ) {
//   wss.handleUpgrade(req, socket, head, (client: WebSocket) => {
//     orderService.subscribe((order) => {
//       client.send(
//         JSON.stringify({
//           event: "order-received",
//           detail: {
//             order,
//           },
//         })
//       );
//     });
//   });
// }

// export function handleUpgrade(
//   req: IncomingMessage,
//   socket: internal.Duplex,
//   head: Buffer
// ) {
//   wss.handleUpgrade(req, socket, head, (client: WebSocket) => {
//     /**
//      * `client` is a single unique WebSocket connection. Here we can subscribe
//      * to backend events that we want to send to the client and handle
//      * messages that the client sends to us.
//      */
//     client.send("hello!");

//     client.on("message", (data: RawData, isBinary: boolean) => {
//       console.log(data.toString());
//     });
//   });
// }
