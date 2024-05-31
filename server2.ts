import { Server } from "node:http";
import express from "express";
import next from "next";
import { parse } from "node:url";
import { handleUpgrade } from "./util/websockets";
import { WebSocket, WebSocketServer } from "ws";

const app = express();
const server: Server = app.listen(3000);
/**
 * Start by creating and preparing a Next.js app.
 */
const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const wss = new WebSocketServer({ noServer: true });
nextApp.prepare().then(() => {

  wss.on("connection", async function connection(ws) {
    console.log('incoming connection', ws);
    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
      // Echo the message back to the client
      ws.send(message);
    });
    ws.onclose = () => {
      console.log('connection closed', wss.clients.size);
    };
  });
  /**
   * Pass all plain HTTP requests from Express to the Next.js request handler.
   * `app` is the Express app we started earlier.
   */
  app.use((req, res, next) => {
    nextApp.getRequestHandler()(req, res, parse(req.url, true));
  });

  server.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url || "/", true);
  
    /**
     * Pass hot module reloading requests to Next.js
     */
    if (pathname === "/_next/webpack-hmr") {
      nextApp.getUpgradeHandler()(req, socket, head);
    }
  
    /**
     * Use another path for our custom WebSocket handler
     */
    if (pathname === "/api/ws") {
      wss.handleUpgrade(req, socket, head, (client: WebSocket) => {
        // wss.emit('connection', client, req);
        client.send('BBBBBBBB')
      });
      // handleUpgrade(req, socket, head);
      // TODO: write a custom WebSocket handler
    }
  });
});
/**
 * Start the Express app, get a `http.Server` in return
 */