type HandState = 'idle' | 'left' | 'right';

type DraggablePart = 'leftHand' | 'rightHand' | 'keyboard';

type Position = {
  x: number;
  y: number;
};

type LayoutState = Record<DraggablePart, Position>;

export type { HandState, DraggablePart, Position, LayoutState };
