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
    handleScaleChange,
  } = useDraggableLayout();

  return (
    <section>
      <div className="debug-panel">
        <p>마지막 키: {lastKey}</p>
        <button type="button" onClick={handleResetLayout}>
          위치 초기화
        </button>
        <div className="scale-panel">
          <label>
            왼손 크기
            <input
              type="range"
              min="0.3"
              max="3"
              step="0.1"
              value={layout.leftHand.scale}
              onChange={(event) =>
                handleScaleChange("leftHand", Number(event.target.value))
              }
            />
          </label>

          <label>
            오른손 크기
            <input
              type="range"
              min="0.3"
              max="3"
              step="0.1"
              value={layout.rightHand.scale}
              onChange={(event) =>
                handleScaleChange("rightHand", Number(event.target.value))
              }
            />
          </label>

          <label>
            키보드 크기
            <input
              type="range"
              min="0.3"
              max="3"
              step="0.1"
              value={layout.keyboard.scale}
              onChange={(event) =>
                handleScaleChange("keyboard", Number(event.target.value))
              }
            />
          </label>
        </div>
      </div>
      <div
        className="character-area"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="character-wrap">
          <img src={character} alt="character" className="character-img" />

          <div
            className={`hand-box left-hand ${handState === "left" ? "hand-down" : ""
              }`}
            style={{
              transform: `translate(${layout.leftHand.x}px, ${layout.leftHand.y
                }px) scale(${layout.leftHand.scale}) ${handState === "left" ? "translateY(24px)" : ""
                }`,
            }}
            onPointerDown={(event) => handlePointerDown(event, "leftHand")}
          >
            <img
              src={hand}
              alt="left hand"
              className="hand-img"
              draggable={false}
            />
          </div>

          <div
            className={`hand-box right-hand ${handState === "right" ? "hand-down" : ""
              }`}
            style={{
              transform: `translate(${layout.rightHand.x}px, ${layout.rightHand.y
                }px) scale(${layout.rightHand.scale}) ${handState === "right" ? "translateY(24px)" : ""
                }`,
            }}
            onPointerDown={(event) => handlePointerDown(event, "rightHand")}
          >
            <img
              src={hand}
              alt="right hand"
              className="hand-img"
              draggable={false}
            />
          </div>

          <img
            src={keyboard}
            alt="keyboard"
            className="keyboard-img"
            draggable={false}
            style={{
              transform: `translate(${layout.keyboard.x}px, ${layout.keyboard.y}px) scale(${layout.keyboard.scale})`,
            }}
            onPointerDown={(event) => handlePointerDown(event, "keyboard")}
          />
        </div>
      </div>
    </section>
  );
};

export default Character;