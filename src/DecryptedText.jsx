import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./DecryptedText.css";

function DecryptedText({
  text = "",
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "view",
  startSignal = 0,
  onComplete,
}) {
  const [displayText, setDisplayText] = useState(text);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const availableCharacters = useMemo(() => {
    if (useOriginalCharsOnly) {
      return Array.from(new Set(text.replace(/\s/g, "").split("")));
    }

    return characters.split("");
  }, [characters, text, useOriginalCharsOnly]);

  const getRevealOrder = useCallback(() => {
    const order = [];

    if (revealDirection === "end") {
      for (let index = text.length - 1; index >= 0; index -= 1) order.push(index);
      return order;
    }

    if (revealDirection === "center") {
      const center = Math.floor(text.length / 2);
      let offset = 0;

      while (order.length < text.length) {
        const rightIndex = center + offset;
        const leftIndex = center - offset - 1;

        if (rightIndex < text.length) order.push(rightIndex);
        if (leftIndex >= 0) order.push(leftIndex);
        offset += 1;
      }

      return order;
    }

    for (let index = 0; index < text.length; index += 1) order.push(index);
    return order;
  }, [revealDirection, text.length]);

  const shuffleText = useCallback(
    (revealedSet) =>
      text
        .split("")
        .map((character, index) => {
          if (character === " " || revealedSet.has(index)) return character;
          return availableCharacters[Math.floor(Math.random() * availableCharacters.length)] || character;
        })
        .join(""),
    [availableCharacters, text],
  );

  const startDecrypt = useCallback(() => {
    if (intervalRef.current || (animateOn === "manual" && hasAnimated)) return;

    const revealOrder = getRevealOrder();
    const revealed = new Set();
    let iteration = 0;

    window.clearInterval(intervalRef.current);
    setIsAnimating(true);
    setRevealedIndices(new Set());
    setDisplayText(shuffleText(revealed));

    intervalRef.current = window.setInterval(() => {
      if (sequential) {
        const nextIndex = revealOrder[iteration];

        if (nextIndex !== undefined) {
          revealed.add(nextIndex);
          setRevealedIndices(new Set(revealed));
          setDisplayText(shuffleText(revealed));
          iteration += 1;
          return;
        }
      } else if (iteration < maxIterations) {
        setDisplayText(shuffleText(revealed));
        iteration += 1;
        return;
      }

      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      setDisplayText(text);
      setRevealedIndices(new Set(revealOrder));
      setIsAnimating(false);
      setHasAnimated(true);
      onComplete?.();
    }, speed);
  }, [animateOn, getRevealOrder, hasAnimated, maxIterations, onComplete, sequential, shuffleText, speed, text]);

  useEffect(() => {
    setRevealedIndices(new Set());
    setHasAnimated(false);
    setDisplayText(shuffleText(new Set()));
  }, [shuffleText, text]);

  useEffect(() => {
    if (animateOn === "view") {
      startDecrypt();
    }

    return () => {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [animateOn, startDecrypt]);

  useEffect(() => {
    if (animateOn === "manual" && startSignal > 0) {
      startDecrypt();
    }
  }, [animateOn, startDecrypt, startSignal]);

  const eventHandlers =
    animateOn === "hover"
      ? { onMouseEnter: startDecrypt }
      : animateOn === "click"
        ? { onClick: startDecrypt }
        : {};

  return (
    <span className={`decrypted-text ${parentClassName}`} ref={containerRef} {...eventHandlers}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((character, index) => {
          const isRevealed = revealedIndices.has(index) || (!isAnimating && hasAnimated);

          return (
            <span className={isRevealed ? className : encryptedClassName} key={index}>
              {character}
            </span>
          );
        })}
      </span>
    </span>
  );
}

export default DecryptedText;
