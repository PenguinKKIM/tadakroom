import { useEffect, useRef, useState } from 'react';
import { CHARACTER_LAYOUT_STORAGE_KEY, DEFAULT_LAYOUT } from '../constants/characterLayout';
import type { DraggablePart, LayoutState, TransformState } from '../types/character';

const getInitialLayout = (): LayoutState => {
  const savedLayout = localStorage.getItem(CHARACTER_LAYOUT_STORAGE_KEY);

  if (!savedLayout) {
    return DEFAULT_LAYOUT;
  }

  try {
    const parsedLayout = JSON.parse(savedLayout) as Partial<Record<DraggablePart, Partial<TransformState>>>;

    return {
      leftHand: {
        ...DEFAULT_LAYOUT.leftHand,
        ...parsedLayout.leftHand,
      },
      rightHand: {
        ...DEFAULT_LAYOUT.rightHand,
        ...parsedLayout.rightHand,
      },
      keyboard: {
        ...DEFAULT_LAYOUT.keyboard,
        ...parsedLayout.keyboard,
      },
    };
  } catch {
    return DEFAULT_LAYOUT;
  }
};

export const useDraggableLayout = () => {
  const [layout, setLayout] = useState<LayoutState>(getInitialLayout);

  const [draggingPart, setDraggingPart] = useState<DraggablePart | null>(null);

  const dragOffsetRef = useRef({
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
        ...prevLayout[draggingPart],
        x: event.clientX - dragOffsetRef.current.x,
        y: event.clientY - dragOffsetRef.current.y,
      },
    }));
  };

  const handlePointerUp = () => {
    setDraggingPart(null);
  };

  const handleScaleChange = (part: DraggablePart, scale: number) => {
    setLayout((prevLayout) => ({
      ...prevLayout,
      [part]: {
        ...prevLayout[part],
        scale,
      },
    }));
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
    handleScaleChange,
    handleResetLayout,
  };
};
