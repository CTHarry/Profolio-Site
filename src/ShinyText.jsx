import "./ShinyText.css";

function ShinyText({
  text,
  children,
  disabled = false,
  speed = 2,
  delay = 0,
  className = "",
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = "left",
  ariaHidden = false,
}) {
  const cycleDuration = Math.max(0.2, speed + delay);
  const classes = [
    "shiny-text",
    disabled ? "is-disabled" : "",
    yoyo ? "is-yoyo" : "",
    pauseOnHover ? "pause-on-hover" : "",
    direction === "right" ? "from-right" : "from-left",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      aria-hidden={ariaHidden}
      style={{
        "--shiny-color": color,
        "--shiny-shine-color": shineColor,
        "--shiny-spread": `${spread}deg`,
        "--shiny-speed": `${cycleDuration}s`,
      }}
    >
      {children ?? text}
    </span>
  );
}

export default ShinyText;
