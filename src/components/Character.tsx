import { useEffect, useRef, useState } from "react";
import character from "../assets/character.png";
import keyboard from "../assets/keyboard.png";
import hand from "../assets/hand.png"

type HandState = "idle" | "left" | "right";

type DraggablePart = "leftHand" | "rightHand" | "keyboard";

type Position = {
  x: number;
  y: number;
};

type LayoutState = Record<DraggablePart, Position>;

const DEFAULT_LAYOUT: LayoutState = {
  leftHand: { x: 100, y: 100 },
  rightHand: { x: 200, y: 200 },
  keyboard: { x: 300, y: 300 },
};

const Character = () => {
  const [lastKey, setLastKey] = useState("아직 입력 없음");
  const [handState, setHandState] = useState<HandState>("idle");

  const [layout, setLayout] = useState<LayoutState>(() => {
    const savedLayout = localStorage.getItem("character-layout");

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

  const nextHandRef = useRef<"left" | "right">("left");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem("character-layout", JSON.stringify(layout));
  }, [layout]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("키눌림", event.key);
      setLastKey(event.key);
      const nextHand = nextHandRef.current;
      setHandState(nextHand);
      nextHandRef.current = nextHand === "left" ? "right" : "left";
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setHandState("idle");
      }, 120);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLElement>,
    part: DraggablePart
  ) => {
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

  return (
    <div
      className="character-area"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="debug-panel">
        <p>마지막 키: {lastKey}</p>
        <button type="button" onClick={handleResetLayout}>
          위치 초기화
        </button>
      </div>

      <div className="character-wrap">
        <img src={character} alt="character" className="character-img" />

        <div
          className={`hand left-hand ${
            handState === "left" ? "hand-down" : ""
          }`}
          style={{
            transform: `translate(${layout.leftHand.x}px, ${layout.leftHand.y}px) ${
              handState === "left" ? "translateY(24px)" : ""
            }`,
          }}
          onPointerDown={(event) => handlePointerDown(event, "leftHand")}
        ><img src={hand} alt="hand" className="hand"/></div>

        <div
          className={`hand right-hand ${
            handState === "right" ? "hand-down" : ""
          }`}
          style={{
            transform: `translate(${layout.rightHand.x}px, ${layout.rightHand.y}px) ${
              handState === "right" ? "translateY(24px)" : ""
            }`,
          }}
          onPointerDown={(event) => handlePointerDown(event, "rightHand")}
        ><img src={hand} alt="hand"  className="hand"/></div>

        <img
          src={keyboard}
          alt="keyboard"
          className="keyboard-img"
          draggable={false}
          style={{
            transform: `translate(${layout.keyboard.x}px, ${layout.keyboard.y}px)`,
          }}
          onPointerDown={(event) => handlePointerDown(event, "keyboard")}
        />
      </div>
    </div>
  );
};

export default Character;