import type { Server } from "node:http";
import { parse } from 'url';
import express from "express";
import next from 'next';
import WebSocket, { WebSocketServer } from 'ws';

const app = express();
const server: Server = app.listen(3000);
const wss = new WebSocketServer({ noServer: true });
const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const clients = new Set<WebSocket>();

nextApp.prepare().then(() => {
  app.use((req, res, next) => {
    nextApp.getRequestHandler()(req, res, parse(req.url, true));
  });

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New client connected');
  
    ws.on('message', (message, isBinary) => {
      console.log(`Received message: ${message}`);
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && (message.toString() !== `{"event":"ping"}`)) {
          client.send(message, { binary: isBinary });
        }
      });
    });
    
    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected');
    });
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
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
      // handleUpgrade(req, socket, head);
      // TODO: write a custom WebSocket handler
    }
  });

})
