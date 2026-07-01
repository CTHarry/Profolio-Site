const THEME_STORAGE_KEY = "portfolio-theme";
const root = document.documentElement;
const pageName = document.body.dataset.page;
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeIcon = document.querySelector("[data-theme-icon]");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// CUSTOMIZE: Personal trait words and typing speed for the hero animation.
const HERO_TRAITS = [
  "fast learner",
  "full-stack engineer",
  "problem solver",
  "critical thinker",
  "team leader",
  "creative developer",
  "AI builder",
  "detail-oriented designer",
  "photographer",
  "lifelong learner",
  "product-minded engineer",
  "automation enthusiast",
];
const TRAIT_TYPE_MS = 38;
const TRAIT_DELETE_MS = 22;
const TRAIT_HOLD_MS = 720;
const TRAIT_PAUSE_MS = 130;
const ALIAS_TYPE_MS = 55;

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return prefersDark.matches ? "dark" : "light";
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  if (!themeToggle || !themeIcon) return;

  const nextTheme = theme === "dark" ? "light" : "dark";
  themeIcon.textContent = theme === "dark" ? "L" : "D";
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  themeToggle.setAttribute("title", `Switch to ${nextTheme} theme`);
}

applyTheme(getInitialTheme());

themeToggle?.addEventListener("click", () => {
  const currentTheme = root.dataset.theme === "dark" ? "dark" : "light";
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

document.querySelectorAll("[data-nav-page]").forEach((link) => {
  if (link.dataset.navPage === pageName) {
    link.setAttribute("aria-current", "page");
  }
});

const topNav = document.querySelector(".top-nav");
const navToggle = document.querySelector("[data-nav-toggle]");

function setNavOpen(isOpen) {
  if (!topNav || !navToggle) return;

  topNav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

navToggle?.addEventListener("click", () => {
  setNavOpen(!topNav?.classList.contains("is-open"));
});

document.addEventListener("click", (event) => {
  if (!topNav?.classList.contains("is-open")) return;
  if (event.target instanceof Node && topNav.contains(event.target)) return;

  setNavOpen(false);
});

topNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setNavOpen(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    setNavOpen(false);
  }
});

const backToTopButton = document.createElement("button");
backToTopButton.className = "back-to-top";
backToTopButton.type = "button";
backToTopButton.setAttribute("aria-label", "Back to top");
backToTopButton.innerHTML = `
  <svg class="back-to-top-chevrons" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
    <path d="m6 24 8-8 8 8" />
    <path d="m6 18 8-8 8 8" />
    <path d="m6 12 8-8 8 8" />
  </svg>
`;
document.body.appendChild(backToTopButton);

function updateBackToTop() {
  const page = document.documentElement;
  const distanceFromBottom = page.scrollHeight - (window.scrollY + window.innerHeight);
  const isNearBottom = distanceFromBottom < 320 && page.scrollHeight > window.innerHeight + 420;

  backToTopButton.classList.toggle("is-visible", isNearBottom);
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
window.addEventListener("resize", updateBackToTop);
updateBackToTop();

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
});

const revealItems = document.querySelectorAll(".reveal-on-scroll");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.12,
  }
);

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 55}ms`);
  revealObserver.observe(item);
});

const traitText = document.querySelector("[data-trait-text]");

if (traitText && HERO_TRAITS.length > 0) {
  let traitIndex = 0;
  let characterIndex = HERO_TRAITS[traitIndex].length;
  let isDeleting = true;

  traitText.textContent = HERO_TRAITS[traitIndex];

  function typeTrait() {
    if (prefersReducedMotion.matches) {
      traitText.textContent = HERO_TRAITS[traitIndex];
      return;
    }

    const currentTrait = HERO_TRAITS[traitIndex];
    traitText.textContent = currentTrait.slice(0, characterIndex);

    let nextDelay = isDeleting ? TRAIT_DELETE_MS : TRAIT_TYPE_MS;

    if (!isDeleting && characterIndex === currentTrait.length) {
      isDeleting = true;
      nextDelay = TRAIT_HOLD_MS;
    } else if (isDeleting && characterIndex === 0) {
      isDeleting = false;
      traitIndex = (traitIndex + 1) % HERO_TRAITS.length;
      nextDelay = TRAIT_PAUSE_MS;
    }

    characterIndex += isDeleting ? -1 : 1;
    window.setTimeout(typeTrait, nextDelay);
  }

  window.setTimeout(typeTrait, TRAIT_HOLD_MS);
}

const identityStage = document.querySelector(".identity-stage");
const aliasText = document.querySelector("[data-alias-text]");

if (identityStage && aliasText) {
  const aliasValue = aliasText.dataset.aliasValue || aliasText.textContent || "Harry Wu";
  let aliasTimer;

  function replayAlias() {
    if (prefersReducedMotion.matches) {
      aliasText.textContent = aliasValue;
      return;
    }

    window.clearTimeout(aliasTimer);
    aliasText.textContent = "";

    let characterIndex = 0;
    function typeAlias() {
      aliasText.textContent = aliasValue.slice(0, characterIndex);
      characterIndex += 1;

      if (characterIndex <= aliasValue.length) {
        aliasTimer = window.setTimeout(typeAlias, ALIAS_TYPE_MS);
      }
    }

    typeAlias();
  }

  identityStage.addEventListener("mouseenter", replayAlias);
  identityStage.addEventListener("focusin", replayAlias);
}

const cardToggleMedia = window.matchMedia("(max-width: 980px), (hover: none)");
const cards = document.querySelectorAll("[data-card]");

function shouldToggleCards() {
  return cardToggleMedia.matches;
}

function setCardExpanded(card, isExpanded) {
  card.classList.toggle("is-expanded", isExpanded);
  card.setAttribute("aria-expanded", String(isExpanded));
}

function resetExpandedCards() {
  if (shouldToggleCards()) return;
  cards.forEach((card) => setCardExpanded(card, false));
}

cardToggleMedia.addEventListener?.("change", resetExpandedCards);

cards.forEach((card) => {
  card.setAttribute("aria-expanded", String(card.classList.contains("is-expanded")));

  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;

    if (shouldToggleCards()) {
      const nextState = !card.classList.contains("is-expanded");
      cards.forEach((otherCard) => {
        if (otherCard !== card) setCardExpanded(otherCard, false);
      });
      setCardExpanded(card, nextState);
      return;
    }

    const url = card.dataset.url;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("a, button")) return;

    event.preventDefault();
    if (shouldToggleCards()) {
      setCardExpanded(card, !card.classList.contains("is-expanded"));
      return;
    }

    const url = card.dataset.url;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  });
});

const askForm = document.querySelector("[data-ask-form]");
const askStatus = document.querySelector("[data-ask-status]");

askForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  // CUSTOMIZE: Connect this form to your fine-tuned LLM endpoint here.
  if (askStatus) {
    askStatus.textContent = "LLM connection coming soon.";
  }
});

const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name")?.toString().trim() || "Portfolio visitor";
  const email = formData.get("email")?.toString().trim() || "";
  const message = formData.get("message")?.toString().trim() || "";
  const recipient = contactForm.dataset.email || "hywu@uwaterloo.ca";

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

  if (formStatus) {
    formStatus.textContent = "Opening your email app...";
  }

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});
