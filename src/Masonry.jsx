import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Masonry.css";

const useMedia = (queries, values, defaultValue) => {
  const getValue = () => {
    if (typeof window === "undefined") return defaultValue;
    const index = queries.findIndex((query) => window.matchMedia(query).matches);
    return values[index] ?? defaultValue;
  };

  const [value, setValue] = useState(getValue);

  useEffect(() => {
    const handleChange = () => setValue(getValue());
    const mediaQueries = queries.map((query) => window.matchMedia(query));

    mediaQueries.forEach((query) => query.addEventListener("change", handleChange));

    return () => {
      mediaQueries.forEach((query) => query.removeEventListener("change", handleChange));
    };
  }, [queries]);

  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return undefined;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, []);

  return [ref, size];
};

const preloadImages = async (urls) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        }),
    ),
  );
};

function Masonry({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  initialDelay = 0,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.97,
  blurToFocus = true,
  fitToContainer = false,
  maxColumns = 3,
  minItemHeight = 128,
  itemGap = 12,
}) {
  const responsiveColumns = useMedia(
    ["(min-width:1500px)", "(min-width:1100px)", "(min-width:720px)", "(min-width:460px)"],
    [4, 3, 2, 2],
    1,
  );
  const columns = Math.min(responsiveColumns, maxColumns);

  const [containerRef, { width, height: measuredHeight }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = false;
    setImagesReady(false);
    preloadImages(items.map((item) => item.img)).then(() => setImagesReady(true));
  }, [items]);

  const { grid, height } = useMemo(() => {
    if (!width) return { grid: [], height: 420 };

    const gap = itemGap;
    const columnHeights = new Array(columns).fill(0);
    const columnWidth = (width - gap * (columns - 1)) / columns;
    const availableHeight = fitToContainer ? Math.max(320, measuredHeight || 520) : null;
    const adaptiveMinHeight = availableHeight
      ? Math.max(96, Math.min(minItemHeight, availableHeight / 3.1))
      : minItemHeight;
    const totalSourceHeight = items.reduce((sum, item) => sum + Math.max(adaptiveMinHeight, item.height / 2), 0);
    const fitScale = availableHeight
      ? Math.min(1, (availableHeight * columns) / Math.max(totalSourceHeight, 1))
      : 1;

    const masonryGrid = items.map((item) => {
      const column = columnHeights.indexOf(Math.min(...columnHeights));
      const x = (columnWidth + gap) * column;
      const itemHeight = Math.max(adaptiveMinHeight, (item.height / 2) * fitScale);
      const y = columnHeights[column];

      columnHeights[column] += itemHeight + gap;

      return { ...item, x, y, w: columnWidth, h: itemHeight };
    });

    return {
      grid: masonryGrid,
      height: fitToContainer ? "100%" : Math.max(...columnHeights, 420),
    };
  }, [columns, fitToContainer, itemGap, items, measuredHeight, minItemHeight, width]);

  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    switch (animateFrom) {
      case "top":
        return { x: item.x, y: -220 };
      case "left":
        return { x: -240, y: item.y };
      case "right":
        return { x: window.innerWidth + 240, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      case "bottom":
      default:
        return { x: item.x, y: window.innerHeight + 180 };
    }
  };

  useLayoutEffect(() => {
    if (!imagesReady || grid.length === 0) return;

    grid.forEach((item, index) => {
      const selector = `[data-masonry-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };

      if (!hasMounted.current) {
        const initialPosition = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: initialPosition.x,
            y: initialPosition.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(10px)" }),
          },
          {
            opacity: 1,
            ...animationProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.8,
            ease,
            delay: initialDelay + index * stagger,
          },
        );
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (item) => {
    if (!scaleOnHover) return;
    gsap.to(`[data-masonry-key="${item.id}"]`, {
      scale: hoverScale,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (item) => {
    if (!scaleOnHover) return;
    gsap.to(`[data-masonry-key="${item.id}"]`, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div ref={containerRef} className="masonry-list" style={{ height }}>
      {grid.map((item) => (
        <div
          key={item.id}
          data-masonry-key={item.id}
          className="masonry-item-wrapper"
          onMouseEnter={() => handleMouseEnter(item)}
          onMouseLeave={() => handleMouseLeave(item)}
        >
          <div className="masonry-item-img" style={item.img ? { backgroundImage: `url(${item.img})` } : undefined}>
            <div className="masonry-item-copy">
              <span>{item.kicker}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Masonry;
