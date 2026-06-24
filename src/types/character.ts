type HandState = 'idle' | 'left' | 'right';

type DraggablePart = 'leftHand' | 'rightHand' | 'keyboard';

type Position = {
  x: number;
  y: number;
};

type TransformState = {
  x: number;
  y: number;
  scale: number;
};

type LayoutState = Record<DraggablePart, TransformState>;

export type { HandState, DraggablePart, Position, TransformState, LayoutState };
