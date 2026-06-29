import WebSocket from 'ws';
import { PORT } from '../src/constants/portNumber';

const socket = new WebSocket(`ws://localhost:${PORT}`);

socket.on('open', () => {
  console.log('테스트 클라이언트 연결됨');

  socket.send(
    JSON.stringify({
      type: 'register',
      clientType: 'input',
    })
  );

  setInterval(() => {
    console.log('typing 이벤트 전송');

    socket.send(
      JSON.stringify({
        type: 'typing',
        userId: 'test-client',
      })
    );
  }, 1000);
});
