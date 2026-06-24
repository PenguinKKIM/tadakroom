import { useEffect, useRef, useState } from 'react';
import { CHARACTER_LAYOUT_STORAGE_KEY, DEFAULT_LAYOUT } from '../constants/characterLayout';
import type { DraggablePart, LayoutState, Position } from '../types/character';

export const useDraggableLayout = () => {
  const [layout, setLayout] = useState<LayoutState>(() => {
    const savedLayout = localStorage.getItem(CHARACTER_LAYOUT_STORAGE_KEY);

    if (!savedLayout) {
      return DEFAULT_LAYOUT;
    }

    try {
      return JSON.parse(savedLayout) as LayoutState;
    } catch {
      return DEFAULT_LAYOUT;
    }
  });

  const [draggingPart, setDraggingPart] = useState<DraggablePart | null>(null);

  const dragOffsetRef = useRef<Position>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    localStorage.setItem(CHARACTER_LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  }, [layout]);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>, part: DraggablePart) => {
    event.preventDefault();

    setDraggingPart(part);

    dragOffsetRef.current = {
      x: event.clientX - layout[part].x,
      y: event.clientY - layout[part].y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingPart) return;

    setLayout((prevLayout) => ({
      ...prevLayout,
      [draggingPart]: {
        x: event.clientX - dragOffsetRef.current.x,
        y: event.clientY - dragOffsetRef.current.y,
      },
    }));
  };

  const handlePointerUp = () => {
    setDraggingPart(null);
  };

  const handleResetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
  };

  return {
    layout,
    draggingPart,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleResetLayout,
  };
};
