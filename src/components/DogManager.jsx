import { Bone, RotateCcw, Sparkles, Trophy, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const gameCopy = {
  en: {
    title: "Snack Hunt with the Manager",
    text: "Tap the snacks before time runs out. The manager counts every happy find.",
    start: "Start game",
    restart: "Play again",
    close: "Close game",
    score: "Snacks",
    time: "Time",
    reward: "Paw points",
    bubbleAction: "Play snack hunt",
    ready: "Ready for a tiny snack hunt?",
    running: "Nice catch",
    done: (score) => (score >= 8 ? "Manager approved. Premium sniff work." : score >= 4 ? "Good shelf helper energy." : "Warm-up round. Try again."),
  },
  zh: {
    title: "\u548c\u72d7\u72d7\u5e97\u957f\u627e\u96f6\u98df",
    text: "\u5728\u5012\u8ba1\u65f6\u7ed3\u675f\u524d\u70b9\u5230\u6389\u51fa\u6765\u7684\u5c0f\u96f6\u98df\uff0c\u5e97\u957f\u4f1a\u5e2e\u4f60\u8bb0\u4e0b\u6bcf\u4e00\u6b21\u5f00\u5fc3\u6355\u6349\u3002",
    start: "\u5f00\u59cb\u6e38\u620f",
    restart: "\u518d\u73a9\u4e00\u6b21",
    close: "\u5173\u95ed\u6e38\u620f",
    score: "\u96f6\u98df",
    time: "\u65f6\u95f4",
    reward: "\u722a\u722a\u79ef\u5206",
    bubbleAction: "\u966a\u5e97\u957f\u627e\u96f6\u98df",
    ready: "\u51c6\u5907\u597d\u966a\u5e97\u957f\u627e\u96f6\u98df\u4e86\u5417\uff1f",
    running: "\u63a5\u5f97\u597d",
    done: (score) => (score >= 8 ? "\u5e97\u957f\u8ba4\u53ef\uff1a\u55c5\u95fb\u80fd\u529b\u5f88\u5f3a\u3002" : score >= 4 ? "\u4e0d\u9519\uff0c\u662f\u4f1a\u6574\u7406\u8d27\u67b6\u7684\u5c0f\u5e2e\u624b\u3002" : "\u5148\u70ed\u4e2a\u8eab\uff0c\u518d\u6765\u4e00\u8f6e\u3002"),
  },
};

function randomTreatPosition() {
  return {
    x: 14 + Math.random() * 72,
    y: 20 + Math.random() * 55,
    rotate: -14 + Math.random() * 28,
  };
}

function ManagerSnackGame({ open, language, managerDog, onClose }) {
  const [active, setActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [treat, setTreat] = useState(() => randomTreatPosition());
  const copy = gameCopy[language];

  useEffect(() => {
    if (!open || !active) return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setActive(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [active, open]);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  if (!open) return null;

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setTreat(randomTreatPosition());
    setActive(true);
  };

  const catchTreat = () => {
    if (!active) return;
    setScore((current) => current + 1);
    setTreat(randomTreatPosition());
  };

  const statusText = active ? copy.running : score > 0 || timeLeft === 0 ? copy.done(score) : copy.ready;

  return createPortal(
    <div
      className="manager-game-layer"
      role="presentation"
      onPointerDown={(event) => {
        event.stopPropagation();
        onClose();
      }}
    >
      <section className="manager-game-panel" role="dialog" aria-modal="true" aria-labelledby="manager-game-title" onPointerDown={(event) => event.stopPropagation()}>
        <button className="manager-game-close" type="button" onClick={onClose} aria-label={copy.close}>
          <X size={18} />
        </button>
        <div className="manager-game-copy">
          <span>
            <Sparkles size={17} />
            {language === "zh" ? "\u5e97\u957f\u5c0f\u4efb\u52a1" : "Manager mini task"}
          </span>
          <h2 id="manager-game-title">{copy.title}</h2>
          <p>{copy.text}</p>
        </div>

        <div className="manager-game-stats" aria-live="polite">
          <strong>
            <Bone size={16} />
            {copy.score}: {score}
          </strong>
          <strong>
            {copy.time}: {timeLeft}s
          </strong>
          <strong>
            <Trophy size={16} />
            {copy.reward}: +{score * 6}
          </strong>
        </div>

        <div className={active ? "manager-game-yard active" : "manager-game-yard"}>
          <img src={managerDog} alt="" draggable="false" />
          <span className="manager-game-status">{statusText}</span>
          <button
            className="manager-game-treat"
            type="button"
            onClick={catchTreat}
            disabled={!active}
            style={{ left: `${treat.x}%`, top: `${treat.y}%`, transform: `translate(-50%, -50%) rotate(${treat.rotate}deg)` }}
            aria-label={language === "zh" ? "\u63a5\u4f4f\u5c0f\u96f6\u98df" : "Catch snack"}
          >
            <Bone size={24} />
          </button>
        </div>

        <button className="manager-game-start" type="button" onClick={startGame}>
          {score > 0 || timeLeft === 0 ? <RotateCcw size={18} /> : <Sparkles size={18} />}
          {score > 0 || timeLeft === 0 ? copy.restart : copy.start}
        </button>
      </section>
    </div>,
    document.body
  );
}

function useWindowDrag({ onClick, onMoveStart } = {}) {
  const dragRef = useRef(null);

  const startDrag = (event, setPosition) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const drag = {
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      width: rect.width,
      height: rect.height,
      moved: false,
    };
    dragRef.current = drag;

    const moveDrag = (moveEvent) => {
      if (!dragRef.current) return;
      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
      const maxX = Math.max(8, window.innerWidth - drag.width - 8);
      const maxY = Math.max(8, window.innerHeight - drag.height - 8);

      if (Math.abs(moveEvent.clientX - drag.startX) > 5 || Math.abs(moveEvent.clientY - drag.startY) > 5) {
        drag.moved = true;
        onMoveStart?.();
      }

      if (!drag.moved) return;
      setPosition({
        x: clamp(drag.startLeft + moveEvent.clientX - drag.startX, 8, maxX),
        y: clamp(drag.startTop + moveEvent.clientY - drag.startY, 8, maxY),
      });
    };

    const stopDrag = () => {
      const wasClick = dragRef.current && !dragRef.current.moved;
      dragRef.current = null;
      if (wasClick) onClick?.();
      window.removeEventListener("pointermove", moveDrag);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };

    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
  };

  return startDrag;
}

export function IntroDogManager({ language, managerDog, label }) {
  const [position, setPosition] = useState(null);
  const [pinned, setPinned] = useState(false);
  const startDrag = useWindowDrag({ onMoveStart: () => setPinned(true) });

  return (
    <div
      className={pinned ? "manager-dog intro-manager draggable-manager is-dragged" : "manager-dog intro-manager draggable-manager"}
      onPointerDown={(event) => startDrag(event, setPosition)}
      style={position ? { left: `${position.x}px`, top: `${position.y}px` } : undefined}
      title={language === "en" ? "Drag the dog manager" : "可以拖动狗狗店长"}
      role="button"
      tabIndex={0}
      aria-label={language === "en" ? "Dog manager on the intro screen. Drag to move." : "首屏狗狗店长，可以拖动。"}
    >
      <img src={managerDog} alt="" draggable="false" />
      <span>{label}</span>
    </div>
  );
}

export function FloatingDogManager({ language, managerDog, label, tips }) {
  const [position, setPosition] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const resizeRef = useRef(null);
  const nodeRef = useRef(null);

  const showNextTip = () => {
    setBubbleOpen(true);
    setTipIndex((index) => (index + 1) % tips.length);
  };

  const startDrag = useWindowDrag({
    onClick: showNextTip,
    onMoveStart: () => setPinned(true),
  });

  useEffect(() => {
    if (!bubbleOpen) return undefined;

    const closeOnOutside = (event) => {
      if (nodeRef.current?.contains(event.target)) return;
      setBubbleOpen(false);
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setBubbleOpen(false);
    };

    window.addEventListener("pointerdown", closeOnOutside, true);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOnOutside, true);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [bubbleOpen]);

  const startResize = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const resize = {
      startX: event.clientX,
      startY: event.clientY,
      startScale: scale,
    };
    resizeRef.current = resize;

    const moveResize = (moveEvent) => {
      if (!resizeRef.current) return;
      const delta = (moveEvent.clientX - resize.startX + moveEvent.clientY - resize.startY) / 220;
      setScale(Math.min(Math.max(Number((resize.startScale + delta).toFixed(2)), 0.7), 1.65));
    };

    const stopResize = () => {
      resizeRef.current = null;
      window.removeEventListener("pointermove", moveResize);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    };

    window.addEventListener("pointermove", moveResize);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    showNextTip();
  };

  const baseWidth = window.innerWidth <= 620 ? 56 : window.innerWidth <= 980 ? 82 : 112;
  const style = position
    ? { left: `${position.x}px`, top: `${position.y}px`, "--manager-width": `${Math.round(baseWidth * scale)}px` }
    : { "--manager-width": `${Math.round(baseWidth * scale)}px` };

  return (
    <div
      ref={nodeRef}
      className={pinned ? "manager-dog site-manager draggable-manager is-dragged" : "manager-dog site-manager draggable-manager"}
      onPointerDown={(event) => startDrag(event, setPosition)}
      onKeyDown={handleKeyDown}
      style={style}
      title={language === "en" ? "Drag the dog manager" : "可以拖动狗狗店长"}
      role="button"
      tabIndex={0}
      aria-label={language === "en" ? "Dog store manager. Click for a tip, drag to move." : "狗狗店长，点击查看提示，也可以拖动。"}
    >
      <img src={managerDog} alt={language === "en" ? "White dog store manager mascot" : "白色狗狗店长主题形象"} draggable="false" />
      <span>{label}</span>
      {bubbleOpen && (
        <div className="manager-bubble" aria-live="polite">
          <strong>{tips[tipIndex]}</strong>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setBubbleOpen(false);
              setGameOpen(true);
            }}
          >
            <Sparkles size={14} />
            {gameCopy[language].bubbleAction}
          </button>
        </div>
      )}
      <button
        className="manager-resize"
        type="button"
        onPointerDown={startResize}
        aria-label={language === "en" ? "Drag to resize dog manager" : "拖动缩放狗狗店长"}
        title={language === "en" ? "Drag to resize" : "拖动缩放"}
      />
      <ManagerSnackGame open={gameOpen} language={language} managerDog={managerDog} onClose={() => setGameOpen(false)} />
    </div>
  );
}
