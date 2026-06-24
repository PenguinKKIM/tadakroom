import "./character.css";
import character from "../../assets/character.png";
import keyboard from "../../assets/keyboard.png";
import hand from "../../assets/hand.png";
import { useDraggableLayout } from "../../hooks/useDraggableLayout";
import { useTypingAnimation } from "../../hooks/useTypingAnimation";

const Character = () => {
  const { lastKey, handState } = useTypingAnimation();

  const {
    layout,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleResetLayout,
  } = useDraggableLayout();

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
          className={`hand-box left-hand ${
            handState === "left" ? "hand-down" : ""
          }`}
          style={{
            transform: `translate(${layout.leftHand.x}px, ${
              layout.leftHand.y
            }px) ${handState === "left" ? "translateY(24px)" : ""}`,
          }}
          onPointerDown={(event) => handlePointerDown(event, "leftHand")}
        >
          <img src={hand} alt="left hand" className="hand-img" draggable={false} />
        </div>

        <div
          className={`hand-box right-hand ${
            handState === "right" ? "hand-down" : ""
          }`}
          style={{
            transform: `translate(${layout.rightHand.x}px, ${
              layout.rightHand.y
            }px) ${handState === "right" ? "translateY(24px)" : ""}`,
          }}
          onPointerDown={(event) => handlePointerDown(event, "rightHand")}
        >
          <img src={hand} alt="right hand" className="hand-img" draggable={false} />
        </div>

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