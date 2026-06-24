import type { LayoutState } from '../types/character';

const DEFAULT_LAYOUT: LayoutState = {
  leftHand: { x: 100, y: 100, scale: 1 },
  rightHand: { x: 200, y: 200, scale: 1 },
  keyboard: { x: 300, y: 300, scale: 1 },
};

const CHARACTER_LAYOUT_STORAGE_KEY = 'character-layout';

export { DEFAULT_LAYOUT, CHARACTER_LAYOUT_STORAGE_KEY };
