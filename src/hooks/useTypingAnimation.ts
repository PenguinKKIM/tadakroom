import { useCallback, useEffect, useRef, useState } from 'react';
import type { HandState } from '../types/character';

export const useTypingAnimation = () => {
  const [lastKey, setLastKey] = useState('아직 입력 없음');
  const [handState, setHandState] = useState<HandState>('idle');

  const nextHandRef = useRef<'left' | 'right'>('left');
  const timerRef = useRef<number | null>(null);

  const triggerTypingAnimation = useCallback((key?: string) => {
    if (key) {
      setLastKey(key);
    }

    const nextHand = nextHandRef.current;

    setHandState(nextHand);

    nextHandRef.current = nextHand === 'left' ? 'right' : 'left';

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setHandState('idle');
    }, 120);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('키눌림', event.key);

      triggerTypingAnimation(event.key);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [triggerTypingAnimation]);

  return {
    lastKey,
    handState,
    triggerTypingAnimation,
  };
};
