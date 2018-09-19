from streamer import SimpleStreamer
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

PORT=8000
server = SimpleWebSocketServer('', PORT, SimpleStreamer)
server.serveforever()
