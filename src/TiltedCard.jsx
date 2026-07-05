import { useEffect, useRef } from "react";

const DEFAULT_STATE = {
  rotateX: 0,
  rotateY: 0,
  scale: 1,
  idleX: 0,
  idleY: 0,
};

function applyTiltState(element, state) {
  element.style.setProperty("--tilted-rotate-x", `${state.rotateX.toFixed(3)}deg`);
  element.style.setProperty("--tilted-rotate-y", `${state.rotateY.toFixed(3)}deg`);
  element.style.setProperty("--tilted-scale", state.scale.toFixed(4));
  element.style.setProperty("--tilted-idle-x", `${state.idleX.toFixed(3)}px`);
  element.style.setProperty("--tilted-idle-y", `${state.idleY.toFixed(3)}px`);
}

export default function TiltedCard({
  as: Component = "div",
  className = "",
  children,
  rotateAmplitude = 10,
  scaleOnHover = 1.03,
  idleAmplitude = 0.9,
  idleSpeed = 0.0007,
  idleOrbit = 0,
  idlePhase = 0,
  perspective = 900,
  contentDepth = 12,
  disabled = false,
  style,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  ...props
}) {
  const ref = useRef(null);
  const frameRef = useRef(0);
  const hoveringRef = useRef(false);
  const stateRef = useRef({ ...DEFAULT_STATE });
  const targetRef = useRef({ ...DEFAULT_STATE });

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = (time) => {
      if (!hoveringRef.current && !prefersReducedMotion) {
        const angle = time * idleSpeed + idlePhase;
        targetRef.current.rotateX = Math.sin(angle) * idleAmplitude;
        targetRef.current.rotateY = Math.cos(angle) * idleAmplitude;
        targetRef.current.scale = 1;
        targetRef.current.idleX = Math.cos(angle) * idleOrbit;
        targetRef.current.idleY = Math.sin(angle) * idleOrbit;
      }

      const state = stateRef.current;
      const target = targetRef.current;
      state.rotateX += (target.rotateX - state.rotateX) * 0.14;
      state.rotateY += (target.rotateY - state.rotateY) * 0.14;
      state.scale += (target.scale - state.scale) * 0.16;
      state.idleX += (target.idleX - state.idleX) * 0.14;
      state.idleY += (target.idleY - state.idleY) * 0.14;
      applyTiltState(element, state);

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameRef.current);
  }, [disabled, idleAmplitude, idleOrbit, idlePhase, idleSpeed]);

  const handlePointerMove = (event) => {
    onPointerMove?.(event);
    const element = ref.current;
    if (!element || disabled) return;

    const rect = element.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    targetRef.current.rotateX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    targetRef.current.rotateY = (offsetX / (rect.width / 2)) * rotateAmplitude;
    targetRef.current.scale = scaleOnHover;

    element.style.setProperty("--tilted-glare-x", `${event.clientX - rect.left}px`);
    element.style.setProperty("--tilted-glare-y", `${event.clientY - rect.top}px`);
    element.style.setProperty("--tilted-glare-opacity", "1");
  };

  const handlePointerEnter = (event) => {
    onPointerEnter?.(event);
    if (disabled) return;
    hoveringRef.current = true;
    targetRef.current.scale = scaleOnHover;
    ref.current?.style.setProperty("--tilted-glare-opacity", "1");
  };

  const handlePointerLeave = (event) => {
    onPointerLeave?.(event);
    if (disabled) return;
    hoveringRef.current = false;
    targetRef.current.rotateX = 0;
    targetRef.current.rotateY = 0;
    targetRef.current.scale = 1;
    ref.current?.style.setProperty("--tilted-glare-opacity", "0");
  };

  return (
    <Component
      ref={ref}
      className={`tilted-card ${className}`.trim()}
      style={{
        "--tilted-perspective": `${perspective}px`,
        "--tilted-content-z": `${contentDepth}px`,
        ...style,
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      <span className="tilted-card-sheen" aria-hidden="true" />
      {children}
    </Component>
  );
}