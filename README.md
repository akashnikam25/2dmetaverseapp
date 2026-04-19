# 2D Metaverse App

A real-time multiplayer 2D metaverse application with avatar movement and live chat — built with TypeScript, WebSockets, and Node.js.

## Features

- **Real-time multiplayer** — multiple users can join the same space simultaneously
- **Avatar movement** — move your character around a 2D map using keyboard controls
- **Live chat** — chat with other users in the same space in real time
- **WebSocket-based** — low-latency bidirectional communication via WebSockets
- **Monorepo structure** — separate `frontend` and `backend` packages

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | TypeScript, HTML5 Canvas / DOM |
| Backend | Node.js, TypeScript, WebSockets (ws) |
| Transport | WebSockets |

## Project Structure

```
2dmetaverseapp/
├── backend/     # Node.js WebSocket server
└── frontend/    # TypeScript browser client
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Backend

```bash
cd backend
npm install
npm run dev
```

The WebSocket server starts on `ws://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## How It Works

1. Users connect to the WebSocket server on load
2. Each user gets a unique ID and an avatar spawned on the map
3. Arrow key / WASD inputs are sent to the server, which broadcasts updated positions to all connected clients
4. The frontend re-renders avatar positions on every update
5. Chat messages are also broadcast through the same WebSocket connection

## License

MIT
