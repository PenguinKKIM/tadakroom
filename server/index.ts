import 'dotenv/config';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = Number(process.env.WS_PORT ?? 4000);

const wss = new WebSocketServer({
  port: PORT,
});

type ClientType = 'overlay' | 'input' | 'unknown';

type ClientInfo = {
  socket: WebSocket;
  type: ClientType;
};

const clients = new Map<WebSocket, ClientInfo>();

const sendToOverlays = (data: unknown) => {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.type !== 'overlay') return;
    if (client.socket.readyState !== WebSocket.OPEN) return;
    client.socket.send(message);
  });
};

wss.on('connection', (socket) => {
  clients.set(socket, {
    socket,
    type: 'unknown',
  });
  console.log('클라이언트 연결');
  socket.on('message', (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString());
      if (message.type === 'register') {
        clients.set(socket, {
          socket,
          type: message.clientType ?? 'unknown',
        });
        console.log(`클라이언트 등록됨: ${message.clientType}`);
        return;
      }
      if (message.type === 'typing') {
        console.log('typing 이벤트 수신');

        sendToOverlays({
          type: 'typing',
          userId: message.userId ?? 'local-user',
          timestamp: Date.now(),
        });
        return;
      }
    } catch (error) {
      console.error('메세지 파싱 실패 : ', error);
    }
  });
  socket.on('close', () => {
    clients.delete(socket);
    console.log('클라이언트 종료');
  });
});

console.log(`WebSocket 서버 실행중 : Port ${PORT}`);
