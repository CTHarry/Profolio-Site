const ACCENT_STORAGE_KEY = "portfolio-accent-mode";
const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function getInitialAccent() {
  return localStorage.getItem(ACCENT_STORAGE_KEY) === "teal" ? "teal" : "red";
}

function applyAccent(accent) {
  root.dataset.accent = accent;
  localStorage.setItem(ACCENT_STORAGE_KEY, accent);

  document.querySelectorAll("[data-palette-toggle]").forEach((button) => {
    const nextAccent = accent === "teal" ? "ember red" : "teal";
    button.setAttribute("aria-label", `Switch to ${nextAccent} accent colors`);
    button.setAttribute("aria-pressed", String(accent === "teal"));
  });
}

applyAccent(getInitialAccent());

document.querySelectorAll("[data-palette-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    applyAccent(root.dataset.accent === "teal" ? "red" : "teal");
  });
});

const pageNav = document.querySelector("[data-page-nav]");

function updateNavigationSurface() {
  pageNav?.classList.toggle("is-scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", updateNavigationSurface, { passive: true });
updateNavigationSurface();

const menuButton = document.querySelector("[data-page-menu-button]");
const mobileNavigation = document.querySelector("[data-mobile-page-nav]");
const mobileBackdrop = document.querySelector("[data-mobile-nav-backdrop]");

function setMenuOpen(isOpen) {
  menuButton?.setAttribute("aria-expanded", String(isOpen));
  menuButton?.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  mobileNavigation?.classList.toggle("is-open", isOpen);
  mobileNavigation?.setAttribute("aria-hidden", String(!isOpen));
  mobileBackdrop?.classList.toggle("is-open", isOpen);
  mobileBackdrop?.setAttribute("tabindex", isOpen ? "0" : "-1");
  document.body.classList.toggle("menu-open", isOpen);
}

menuButton?.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

mobileBackdrop?.addEventListener("click", () => setMenuOpen(false));
mobileNavigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) setMenuOpen(false);
});

const revealItems = document.querySelectorAll("[data-reveal]");

if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 55}ms`);
    revealObserver.observe(item);
  });
}

const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name")?.toString().trim() || "Portfolio visitor";
  const email = formData.get("email")?.toString().trim() || "";
  const message = formData.get("message")?.toString().trim() || "";
  const recipient = contactForm.dataset.email || "ctharry0106@gmail.com";
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

  if (formStatus) formStatus.textContent = "Opening your email app…";
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});
