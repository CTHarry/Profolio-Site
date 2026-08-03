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
  showCopy = true,
  variant = "default",
  waitForImages = true,
  onItemClick,
}) {
  const [containerRef, { width, height: measuredHeight }] = useMeasure();
  const responsiveColumns = useMedia(
    ["(min-width:1500px)", "(min-width:1100px)", "(min-width:720px)", "(min-width:460px)"],
    [4, 3, 2, 2],
    1,
  );
  const photoColumns = width >= 720 ? 4 : width >= 460 ? 3 : 2;
  const columns = Math.min(
    variant === "photos" ? photoColumns : responsiveColumns,
    maxColumns,
  );

  const [imagesReady, setImagesReady] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = false;
    if (!waitForImages) {
      setImagesReady(true);
      return;
    }

    setImagesReady(false);
    preloadImages(items.map((item) => item.img)).then(() => setImagesReady(true));
  }, [items, waitForImages]);

  const { grid, height } = useMemo(() => {
    if (!width) return { grid: [], height: 420 };

    const gap = itemGap;
    const columnHeights = new Array(columns).fill(0);
    const columnWidth = (width - gap * (columns - 1)) / columns;
    const availableHeight = fitToContainer ? Math.max(320, measuredHeight || 520) : null;
    const heightFloor = variant === "photos" ? 44 : 96;
    const adaptiveMinHeight = availableHeight
      ? Math.max(heightFloor, Math.min(minItemHeight, availableHeight / 3.1))
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
  }, [columns, fitToContainer, itemGap, items, measuredHeight, minItemHeight, variant, width]);

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
      zIndex: 20,
      transformOrigin: "center center",
      duration: 0.38,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = (item) => {
    if (!scaleOnHover) return;
    gsap.to(`[data-masonry-key="${item.id}"]`, {
      scale: 1,
      duration: 0.36,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(`[data-masonry-key="${item.id}"]`, { zIndex: "auto" });
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className={`masonry-list masonry-list--${variant}`}
      style={{ height }}
    >
      {grid.map((item) => {
        const opensLightbox = variant === "photos" && onItemClick;
        const MediaElement = opensLightbox ? "button" : item.href ? "a" : "div";

        return (
          <div
            key={item.id}
            data-masonry-key={item.id}
            className="masonry-item-wrapper"
            onMouseEnter={() => handleMouseEnter(item)}
            onMouseLeave={() => handleMouseLeave(item)}
          >
            <MediaElement
              className="masonry-item-img"
              style={
                item.img && variant !== "photos"
                  ? { backgroundImage: `url(${item.img})` }
                  : undefined
              }
              {...(opensLightbox
                ? {
                    type: "button",
                    onClick: () => onItemClick(item),
                    "aria-label": `Enlarge ${item.alt || item.title}`,
                    title: `Enlarge ${item.title}`,
                  }
                : item.href
                ? {
                    href: item.href,
                    target: "_blank",
                    rel: "noreferrer",
                    "aria-label": `Open ${item.alt || item.title} at full size`,
                    title: item.title,
                  }
                : {})}
            >
              {variant === "photos" && item.img && (
                <img
                  className="masonry-photo-preview"
                  src={item.img}
                  alt=""
                  loading="lazy"
                />
              )}
              {showCopy && (
                <div className="masonry-item-copy">
                  <span>{item.kicker}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              )}
            </MediaElement>
          </div>
        );
      })}
    </div>
  );
}

export default Masonry;
