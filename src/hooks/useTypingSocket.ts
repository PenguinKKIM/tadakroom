import { useEffect, useRef, useState } from 'react';
import { PORT } from '../constants/portNumber';

type UseTypingSocketParams = {
  onTyping: () => void;
};

type SocketStatus = 'idle' | 'connected' | 'disconnected' | 'error';

export const useTypingSocket = ({ onTyping }: UseTypingSocketParams) => {
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('idle');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:${PORT}`);
    socketRef.current = socket;

    socket.addEventListener('open', () => {
      console.log('웹소켓 연결됨');
      setSocketStatus('connected');

      socket.send(
        JSON.stringify({
          type: 'register',
          clientType: 'overlay',
        })
      );
    });

    socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'typing') {
          console.log('타이핑 이벤트 받음');
          onTyping();
        }
      } catch (error) {
        console.error('웹소캣 메세지 파싱 실패 : ', error);
      }
    });
    socket.addEventListener('close', () => {
      console.log('웹소켓 연결종료');
      setSocketStatus('disconnected');
    });
    socket.addEventListener('error', () => {
      console.log('웹소켓 에러');
      setSocketStatus('error');
    });
    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [onTyping]);
  const sendTestTyping = () => {
    if (!socketRef.current) return;
    if (socketRef.current.readyState !== WebSocket.OPEN) return;

    socketRef.current.send(
      JSON.stringify({
        type: 'typing',
        userId: 'overlay-test',
      })
    );
  };

  return {
    socketStatus,
    sendTestTyping,
  };
};
