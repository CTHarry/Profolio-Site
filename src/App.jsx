import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import characterProjectImage from "../assets/images/project-character-app.png";
import portfolioProjectImage from "../assets/images/project-new-portfolio.png";
import componentProjectImage from "../assets/images/project-portfolio.png";
import minigameImage from "../assets/images/project-minigame.png";
import platformerImage from "../assets/images/project-unity-platformer.png";
import photoImage from "../assets/images/profile-alt-ctharry.jpg";
import resumePdf from "../assets/documents/harry-wu-resume.pdf";
import DecryptedText from "./DecryptedText.jsx";
import Masonry from "./Masonry.jsx";

const assets = {
  resume: resumePdf,
};

const focusItems = [
  {
    source: "Personal Project",
    text: "Refreshing this portfolio into a sharper visual system for AI, robotics, and product work.",
  },
  {
    source: "Infosys Intern Work",
    text: "Local VLM pipeline for semantic costmap updates in socially aware robot navigation.",
  },
  {
    source: "Infosys Intern Work",
    text: "Robot coordination agent for navigation, safety, alerts, and human interaction.",
  },
];

const navItems = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Other", href: "#other" },
  { label: "Contact", href: "#contact" },
];

const mobileNavItems = [{ label: "Home", href: "#top" }, ...navItems];

const heroTitleWords = ["HONG", "YE", "WU"];
const EXPERIENCE_FOCUS_RATIO = 0.68;

const currentProjects = [
  {
    title: "Local VLM Semantic Costmap System",
    type: "Infosys Intern Work",
    status: "Jun. 2026 - Present",
    image: characterProjectImage,
    description:
      "A ROS2/Nav2 AMR workflow using local VLM reasoning to generate semantic costmap updates for socially aware robot navigation.",
    tools: ["ROS2", "AMR", "Nav2", "VLM", "Costmap"],
    link: "https://www.infosys.com/",
  },
  {
    title: "Robot Coordination Agent System",
    type: "Infosys Intern Work",
    status: "Jun. 2026 - Present",
    image: componentProjectImage,
    description:
      "A VLA-inspired AI agent layer that coordinates robot navigation, safety, alerts, and human interaction.",
    tools: ["AI Agent", "VLA", "ROS2", "AMR", "Safety"],
    link: "https://www.infosys.com/",
  },
  {
    title: "Modern Portfolio Website",
    type: "Personal Brand",
    status: "2026 - Present",
    image: portfolioProjectImage,
    description:
      "A responsive identity site shaped around clear presentation, interactive cards, and custom personal details.",
    tools: ["React", "Vite", "CSS", "Design"],
    link: "#top",
  },
];

const previousProjects = [
  {
    title: "Document Q&A RAG Prototype",
    type: "AI System",
    status: "Jan. 2026 - Mar. 2026",
    image: characterProjectImage,
    description:
      "A PDF question-answering pipeline that indexes documents in SQLite and retrieves cited passages with evaluation checks.",
    tools: ["Python", "SQLite", "OpenAI API", "Embeddings"],
    link: "https://github.com/CTHarry/rag-sql-qa",
  },
  {
    title: "SEO Website Generator & Optimizer",
    type: "Automation Product",
    status: "Nov. 2025 - Jan. 2026",
    image: portfolioProjectImage,
    description:
      "A generator that turns business context, location, and keyword intent into SEO-ready pages with reusable templates.",
    tools: ["JavaScript", "Node.js", "HTML/CSS", "OpenAI API"],
    link: "https://github.com/CTHarry",
  },
  {
    title: "AI-Enhanced Web Components Library",
    type: "Design System",
    status: "Jul. 2025 - Jan. 2026",
    image: componentProjectImage,
    description:
      "A reusable React component library with accessibility-first UI patterns and AI-assisted copy generation.",
    tools: ["React", "JavaScript", "Python", "Gemini API"],
    link: "https://github.com/CTHarry",
  },
];

const experiences = [
  {
    id: "infosys",
    company: "Infosys",
    role: "AI / Robotics Intern",
    date: "Jun. 2026 - Present",
    location: "Canada",
    detail:
      "Building ROS2/Nav2 AMR workflows, VLA/VLM costmap reasoning, and an AI agent layer for navigation, safety, alerts, and interaction.",
    projects: ["Local VLM semantic costmap system", "Robot coordination agent for navigation, safety, alerts, and interaction"],
    languages: ["Python", "C++"],
    tools: ["ROS2", "AMR", "Nav2", "VLA", "VLM", "Costmap", "AI agent"],
    responsibilities: [
      "Prototype semantic costmap updates for socially aware robot navigation.",
      "Connect perception, safety, alerting, and interaction logic into coordinated robot workflows.",
      "Evaluate robotics behavior across navigation and human-facing edge cases.",
    ],
    impact: "Advancing a more context-aware AMR workflow that can reason about navigation, safety, and interaction as one system.",
  },
  {
    id: "kyhu",
    company: "Keep Your Head Up Foundation",
    role: "Website Developer / SEO & Automation Engineer",
    date: "May 2025 - Aug. 2025",
    location: "Waterloo, ON",
    detail:
      "Improved technical SEO, standardized the Squarespace site, and built JavaScript automation workflows for cleaner operations.",
    projects: ["Technical SEO refresh", "Squarespace page system cleanup", "Automation workflows for operations"],
    languages: ["JavaScript", "HTML/CSS"],
    tools: ["Squarespace", "SEO", "Zapier", "Analytics"],
    responsibilities: [
      "Standardized page structure and content patterns across the website.",
      "Built automation workflows to reduce repeated manual data handling.",
      "Improved search visibility through cleaner technical SEO and content organization.",
    ],
    impact: "Made the site easier to maintain while improving discoverability for concussion-related resources.",
  },
  {
    id: "uwaterloo",
    company: "University of Waterloo",
    role: "Computer Science Student",
    date: "Sep. 2024 - May 2029",
    location: "Waterloo, ON",
    detail:
      "Studying Honours Computer Science with focus on data structures, object-oriented programming, C/C++, testing, and software design.",
    projects: ["Coursework labs", "Data structure implementations", "Software design and testing exercises"],
    languages: ["C", "C++", "Python"],
    tools: ["Git", "Linux", "Testing", "Debugging"],
    responsibilities: [
      "Build a strong foundation in algorithms, data structures, and systems-level programming.",
      "Practice testing, debugging, and clean implementation through coursework.",
      "Connect classroom CS fundamentals with robotics, AI, and web systems projects.",
    ],
    impact: "Developing the technical base behind my full-stack, AI, and robotics work.",
  },
  {
    id: "vic-park",
    company: "Victoria Park Collegiate Institute",
    role: "Math Club President / Mandarin Club Founder",
    date: "2020 - 2024",
    location: "Toronto, ON",
    detail:
      "Led student communities through teaching, competition preparation, cultural programming, and recurring events.",
    projects: ["Math club sessions", "Mandarin club programming", "Student events and competition preparation"],
    languages: [],
    tools: ["Leadership", "Teaching", "Event planning", "Mentorship"],
    responsibilities: [
      "Organized recurring club sessions and student-led programming.",
      "Supported peers through teaching, mentorship, and competition preparation.",
      "Built communities around problem solving, language, and culture.",
    ],
    impact: "Built the leadership and communication habits that still shape how I work on teams.",
  },
];

const otherItems = [
  {
    id: "photos",
    title: "photos",
    image: photoImage,
    text: "Visual notes, travel moments, and quiet composition practice.",
  },
  {
    id: "music",
    title: "music",
    image: portfolioProjectImage,
    text: "Rhythm, focus sessions, and sound as a design moodboard.",
  },
  {
    id: "videos",
    title: "videos",
    image: platformerImage,
    text: "Motion, short edits, and visual storytelling experiments.",
  },
  {
    id: "gaming",
    title: "gaming",
    image: minigameImage,
    text: "Game systems, playful mechanics, and interactive experiments.",
  },
];

const masonryHeights = [460, 320, 520, 280, 390, 580, 340, 430, 300, 500];

const otherDetailItems = otherItems.reduce((itemsByCategory, item) => {
  itemsByCategory[item.id] = Array.from({ length: 10 }, (_, index) => ({
    id: `${item.id}-${index + 1}`,
    img: "",
    height: masonryHeights[index],
    kicker: item.title,
    title: `${item.title} placeholder ${String(index + 1).padStart(2, "0")}`,
    description: "Placeholder block for future content, captions, embeds, or selected work.",
  }));

  return itemsByCategory;
}, {});

const contactLinks = [
  { label: "ctharry0106@gmail.com", href: "mailto:ctharry0106@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hongyewu/" },
  { label: "GitHub", href: "https://github.com/CTHarry" },
  { label: "Resume", href: assets.resume },
];

function parseDatePart(dateText) {
  const cleanText = dateText.trim().replace(/\./g, "");

  if (/present/i.test(cleanText)) {
    return { year: "Now", month: "Present" };
  }

  const parts = cleanText.split(/\s+/);

  if (parts.length === 1) {
    return { year: parts[0], month: "" };
  }

  return { year: parts[1], month: parts[0] };
}

function PeriodStamp({ period }) {
  const dates = period.split(/\s+-\s+/).map(parseDatePart);

  return (
    <span className="period-stamp" aria-label={period}>
      {dates.map((date, index) => (
        <span className="period-piece" key={`${date.year}-${date.month}-${index}`}>
          {index > 0 && <span className="period-divider" aria-hidden="true" />}
          <span className="period-date">
            <strong>{date.year}</strong>
            {date.month && <em>{date.month}</em>}
          </span>
        </span>
      ))}
    </span>
  );
}

function getCompanyInitials(company) {
  return company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function ProjectCard({ project, index, variant = "featured" }) {
  const cardClass =
    variant === "current"
      ? `project-card magic-border project-card-current current-card-${index + 1}`
      : `project-card magic-border project-card-${index + 1}`;

  return (
    <a
      className={cardClass}
      href={project.link}
      target={project.link.startsWith("#") ? undefined : "_blank"}
      rel={project.link.startsWith("#") ? undefined : "noreferrer"}
    >
      <img src={project.image} alt="" aria-hidden="true" />
      <div className="project-overlay">
        <div className="project-meta">
          <span>{project.type}</span>
          <PeriodStamp period={project.status} />
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tool-row">
          {project.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </div>
    </a>
  );
}

function ExperienceDetailGroup({ title, items, emptyText }) {
  return (
    <section className="experience-detail-card experience-detail-tag-card">
      <span>{title}</span>
      {items.length > 0 ? (
        <div className="experience-detail-tags">
          {items.map((item) => (
            <em key={item}>{item}</em>
          ))}
        </div>
      ) : (
        <p>{emptyText}</p>
      )}
    </section>
  );
}

function getExperienceImpactCards(experience) {
  const impactCards = {
    infosys: [
      { value: "ROS2", label: "robotics workflow" },
      { value: "VLM", label: "semantic costmap reasoning" },
      { value: "Agent", label: "navigation, safety, alerts" },
    ],
    kyhu: [
      { value: "SEO", label: "technical refresh" },
      { value: "30+", label: "pages standardized" },
      { value: "JS", label: "automation workflows" },
    ],
    uwaterloo: [
      { value: "Honours", label: "computer science" },
      { value: "C/C++", label: "systems foundations" },
      { value: "CS", label: "algorithms and design" },
    ],
    "vic-park": [
      { value: "2", label: "student communities" },
      { value: "Lead", label: "club programming" },
      { value: "Teach", label: "peer mentorship" },
    ],
  };

  return impactCards[experience.id] ?? [{ value: "Impact", label: experience.impact }];
}

function getExperienceOverview(experience) {
  const overview = {
    infosys:
      "Building ROS2/Nav2 AMR workflows with VLM costmap reasoning and an agent layer for navigation, safety, alerts, and interaction.",
    kyhu:
      "Improved the Squarespace site, technical SEO, and JavaScript automation for a youth-focused nonprofit.",
    uwaterloo:
      "Studying Honours Computer Science with a focus on systems programming, data structures, testing, and software design.",
    "vic-park":
      "Led student communities through math programming, Mandarin cultural events, mentorship, and competition preparation.",
  };

  return overview[experience.id] ?? experience.detail;
}

function getExperienceHighlights(experience) {
  const highlights = {
    infosys: [
      "Local VLM semantic costmap system.",
      "Robot coordination agent for navigation and safety.",
      "ROS2/Nav2 workflows for AMR behavior testing.",
    ],
    kyhu: [
      "Technical SEO refresh for the main website.",
      "Squarespace page cleanup and content structure.",
      "JavaScript automation workflows for operations.",
    ],
    uwaterloo: [
      "Coursework in algorithms, data structures, and systems.",
      "C/C++, Python, testing, debugging, and Linux workflows.",
      "Connecting CS fundamentals with AI, robotics, and web projects.",
    ],
    "vic-park": [
      "Math Club sessions and competition preparation.",
      "Mandarin Club programming and student events.",
      "Peer teaching, mentorship, and community leadership.",
    ],
  };

  return highlights[experience.id] ?? experience.projects;
}

function ExperienceDetails({ experience }) {
  const companyInitials = getCompanyInitials(experience.company);
  const impactCards = getExperienceImpactCards(experience);
  const overview = getExperienceOverview(experience);
  const highlights = getExperienceHighlights(experience);

  return (
    <aside className="experience-detail-panel magic-border" key={experience.id} aria-live="polite">
      <header className="experience-detail-top">
        <span className="experience-detail-logo" aria-hidden="true">
          {companyInitials}
        </span>
        <div>
          <span>{experience.company}</span>
          <strong>{experience.role}</strong>
          <p>{experience.location}</p>
        </div>
        <PeriodStamp period={experience.date} />
      </header>

      <section className="experience-detail-card experience-detail-wide">
        <span>Overview</span>
        <p>{overview}</p>
      </section>

      <section className="experience-detail-card experience-detail-wide">
        <span>Projects / Responsibilities</span>
        <ul className="experience-project-list">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="experience-detail-grid">
        <ExperienceDetailGroup title="Skills" items={experience.languages} emptyText="Not a programming-focused role." />
        <ExperienceDetailGroup title="Tools" items={experience.tools} emptyText="Tools and frameworks coming soon." />
      </div>

      <section className="experience-impact">
        <span>Impact</span>
        <p>{experience.impact}</p>
        <div className="experience-impact-grid">
          {impactCards.map((item) => (
            <div className="experience-impact-card" key={`${item.value}-${item.label}`}>
              <strong>{item.value}</strong>
              <small>{item.label}</small>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

function HeroTitle() {
  return (
    <h1 id="hero-title" className="hero-title" aria-label="Hong Ye Wu">
      <span className="hero-title-shine" aria-hidden="true">
        {heroTitleWords.map((word, wordIndex) => (
          <span className={`hero-title-word hero-title-word-${wordIndex + 1}`} key={word}>
            <span className="hero-title-word-inner">
              {[...word].map((letter, letterIndex) => (
                <span className="hero-title-letter" key={`${word}-${letter}-${letterIndex}`}>
                  {letter}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
}

function App() {
  const siteRef = useRef(null);
  const openingTimelineRef = useRef(null);
  const otherOpenTimerRef = useRef(null);
  const otherFinishTimerRef = useRef(null);
  const otherStageRef = useRef(null);
  const experienceTimelineRef = useRef(null);
  const experienceScrollFrameRef = useRef(null);
  const activeExperienceIndexRef = useRef(experiences.length - 1);
  const previousOtherNavHiddenRef = useRef(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(experiences.length - 1);
  const [accentMode, setAccentMode] = useState(() => {
    if (typeof window === "undefined") return "ember";

    return window.localStorage.getItem("portfolio-accent-mode") === "teal" ? "teal" : "ember";
  });
  const [introStarted, setIntroStarted] = useState(false);
  const [introDecrypted, setIntroDecrypted] = useState(false);
  const [openingOtherId, setOpeningOtherId] = useState(null);
  const [activeOtherId, setActiveOtherId] = useState(null);
  const [otherPhase, setOtherPhase] = useState("idle");
  const currentFocus = focusItems[focusIndex];
  const selectedOtherId = activeOtherId || openingOtherId;
  const activeOther = otherItems.find((item) => item.id === selectedOtherId);
  const isOtherDetailVisible = Boolean(activeOther && otherPhase !== "idle");
  const isOtherNavHidden = otherPhase !== "idle" || Boolean(activeOther) || Boolean(openingOtherId);
  const isTealAccent = accentMode === "teal";
  const timelineExperiences = [...experiences].reverse();
  const activeExperience = timelineExperiences[activeExperienceIndex] ?? timelineExperiences[timelineExperiences.length - 1];

  const toggleAccentMode = () => {
    setAccentMode((mode) => (mode === "teal" ? "ember" : "teal"));
  };

  const scrollExperienceToFocus = (index, behavior = "smooth") => {
    const timeline = experienceTimelineRef.current;
    const node = timeline?.querySelector(`[data-experience-index="${index}"]`);

    if (!timeline || !node) {
      return;
    }

    const targetLeft = node.offsetLeft + node.offsetWidth / 2 - timeline.clientWidth * EXPERIENCE_FOCUS_RATIO;
    timeline.scrollTo({ left: Math.max(0, targetLeft), behavior });
  };

  const selectExperience = (index) => {
    setActiveExperienceIndex(index);
    scrollExperienceToFocus(index);
  };

  useLayoutEffect(() => {
    const root = siteRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!root || prefersReducedMotion) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const openingTimeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.out" },
      });
      openingTimelineRef.current = openingTimeline;

      gsap.set(".intro-curtain", {
        autoAlpha: 1,
        pointerEvents: "auto",
      });
      gsap.set(".intro-curtain-bg", { autoAlpha: 1 });
      gsap.set(".intro-stage", {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        transformOrigin: "50% 50%",
      });
      gsap.set(".nav-shell", { autoAlpha: 0, x: -34 });
      gsap.set(".hero-video-frame", { autoAlpha: 0.42, scale: 1.14 });
      gsap.set(".hero-topline span", { autoAlpha: 0, y: -18 });
      gsap.set(".hero-title", { autoAlpha: 0, x: -220, scaleX: 0.68, scaleY: 1.12, transformOrigin: "left center" });
      gsap.set(".hero-title-word", { autoAlpha: 1, transformOrigin: "50% 50%" });
      gsap.set(".hero-title-word-inner", { display: "inline-block", scaleX: 0.82, scaleY: 1.08 });
      gsap.set(".hero-title-letter", { autoAlpha: 1, yPercent: 0 });
      gsap.set(".hero-status-block > *", { autoAlpha: 0, x: -44, scaleX: 0.94 });
      gsap.set(".hero-console", { autoAlpha: 0, x: 56, scaleX: 0.92 });

      openingTimeline
        .to(".intro-stage", {
          x: () => window.innerWidth * 0.72,
          scaleX: 0.58,
          scaleY: 1.18,
          autoAlpha: 0,
          duration: 0.72,
          ease: "expo.inOut",
        })
        .to(
          ".intro-curtain-bg",
          {
            autoAlpha: 0,
            duration: 0.92,
            ease: "power2.out",
          },
          0.12,
        )
        .to(
          ".hero-video-frame",
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
          },
          0.05,
        )
        .to(
          ".hero-title",
          {
            autoAlpha: 1,
            x: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.9,
            ease: "expo.out",
          },
          0.56,
        )
        .to(
          ".hero-title-word-inner",
          {
            scaleX: 1.1,
            scaleY: 0.9,
            duration: 0.22,
            stagger: 0.035,
            ease: "power3.inOut",
          },
          0.56,
        )
        .to(
          ".hero-title-word-inner",
          {
            scaleX: 1,
            scaleY: 1,
            duration: 0.72,
            stagger: 0.04,
            ease: "expo.out",
          },
          0.78,
        )
        .to(
          ".nav-shell",
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.82,
          },
          1,
        )
        .to(
          ".hero-topline span",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            stagger: 0.08,
          },
          1.14,
        )
        .to(
          ".hero-status-block > *",
          {
            autoAlpha: 1,
            x: 0,
            scaleX: 1,
            duration: 0.86,
            stagger: 0.075,
          },
          1.42,
        )
        .to(
          ".hero-console",
          {
            autoAlpha: 1,
            x: 0,
            scaleX: 1,
            duration: 0.96,
          },
          1.72,
        )
        .set(".intro-curtain", { autoAlpha: 0, pointerEvents: "none" });

      gsap.utils.toArray(".page-panel, .footer-section").forEach((section) => {
        const heading = section.querySelector("h2");
        const kicker = section.querySelector(".section-kicker");
        const titlePanel = section.querySelector(".profile-copy");
        const visualPanels = Array.from(
          section.querySelectorAll(".metric-grid, .experience-stack, .current-project-layout, .featured-grid, .other-gallery, .footer-links"),
        ).filter((panel) => !panel.contains(heading));
        const cards = section.querySelectorAll(
          ".metric-card, .experience-line, .project-group-heading, .project-card, .other-card, .footer-links a",
        );

        if (!heading) {
          return;
        }

        const sectionTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
          defaults: { ease: "power4.out" },
        });

        if (titlePanel) {
          sectionTimeline.fromTo(
            titlePanel,
            {
              autoAlpha: 0,
              y: 54,
              scaleY: 0.9,
              clipPath: "inset(16% 0% 0% 0%)",
              transformOrigin: "top center",
            },
            {
              autoAlpha: 1,
              y: 0,
              scaleY: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.9,
            },
            0,
          );
        }

        if (kicker) {
          sectionTimeline.fromTo(
            kicker,
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.62 },
            titlePanel ? 0.16 : 0,
          );
        }

        sectionTimeline
          .fromTo(
            heading,
            {
              autoAlpha: 0,
              y: 96,
              scaleY: 0.72,
              skewY: 4,
              clipPath: "inset(0% 0% 100% 0%)",
              transformOrigin: "left bottom",
            },
            {
              autoAlpha: 1,
              y: 0,
              scaleY: 1,
              skewY: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.08,
            },
            titlePanel ? 0.18 : 0.08,
          )
          .fromTo(
            visualPanels,
            {
              autoAlpha: 0,
              y: 54,
              scaleY: 0.88,
              clipPath: "inset(18% 0% 0% 0%)",
              transformOrigin: "top center",
            },
            {
              autoAlpha: 1,
              y: 0,
              scaleY: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.86,
              stagger: 0.08,
            },
            0.44,
          )
          .fromTo(
            cards,
            {
              autoAlpha: 0,
              y: 64,
              scaleY: 0.92,
              clipPath: "inset(18% 0% 0% 0%)",
              transformOrigin: "top center",
            },
            {
              autoAlpha: 1,
              y: 0,
              scaleY: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.9,
              stagger: 0.075,
            },
            0.68,
          );
      });

      gsap.utils.toArray(".project-card, .other-card").forEach((card) => {
        gsap.fromTo(
          card,
          { "--media-y": "34px" },
          {
            "--media-y": "-34px",
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });

      window.setTimeout(() => ScrollTrigger.refresh(), 350);
    }, root);

    return () => {
      openingTimelineRef.current = null;
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!introDecrypted) return undefined;

    const holdTimer = window.setTimeout(() => {
      openingTimelineRef.current?.restart();
    }, 650);

    return () => window.clearTimeout(holdTimer);
  }, [introDecrypted]);

  useEffect(() => {
    document.documentElement.dataset.accent = accentMode;
    window.localStorage.setItem("portfolio-accent-mode", accentMode);
  }, [accentMode]);

  useEffect(() => {
    activeExperienceIndexRef.current = activeExperienceIndex;
  }, [activeExperienceIndex]);

  useEffect(() => {
    const timeline = experienceTimelineRef.current;

    if (!timeline) {
      return undefined;
    }

    const updateActiveFromFocus = () => {
      const nodes = Array.from(timeline.querySelectorAll("[data-experience-index]"));
      const timelineRect = timeline.getBoundingClientRect();
      const focusX = timelineRect.left + timelineRect.width * EXPERIENCE_FOCUS_RATIO;

      const closestNode = nodes.reduce((closest, node) => {
        const rect = node.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - focusX);

        return !closest || distance < closest.distance ? { node, distance } : closest;
      }, null);

      if (!closestNode) {
        return;
      }

      const nextIndex = Number(closestNode.node.dataset.experienceIndex);
      setActiveExperienceIndex((index) => (index === nextIndex ? index : nextIndex));
    };

    const requestFocusUpdate = () => {
      if (experienceScrollFrameRef.current) {
        window.cancelAnimationFrame(experienceScrollFrameRef.current);
      }

      experienceScrollFrameRef.current = window.requestAnimationFrame(updateActiveFromFocus);
    };

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      event.preventDefault();
      timeline.scrollLeft += event.deltaY;
    };

    const handleResize = () => {
      scrollExperienceToFocus(activeExperienceIndexRef.current, "auto");
      requestFocusUpdate();
    };

    const animationFrame = window.requestAnimationFrame(() => {
      scrollExperienceToFocus(activeExperienceIndexRef.current, "auto");
      updateActiveFromFocus();
    });

    timeline.addEventListener("scroll", requestFocusUpdate, { passive: true });
    timeline.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (experienceScrollFrameRef.current) {
        window.cancelAnimationFrame(experienceScrollFrameRef.current);
      }
      timeline.removeEventListener("scroll", requestFocusUpdate);
      timeline.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const root = siteRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!root || prefersReducedMotion) {
      return undefined;
    }

    let activeElement = null;

    const resetElement = (element) => {
      element?.style.setProperty("--magic-intensity", "0");
    };

    const handlePointerMove = (event) => {
      const target = event.target.closest(".magic-border");

      if (!target || !root.contains(target)) {
        if (activeElement) resetElement(activeElement);
        activeElement = null;
        return;
      }

      const rect = target.getBoundingClientRect();
      const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
      const relativeY = ((event.clientY - rect.top) / rect.height) * 100;

      if (activeElement && activeElement !== target) {
        resetElement(activeElement);
      }

      activeElement = target;
      target.style.setProperty("--magic-x", `${relativeX}%`);
      target.style.setProperty("--magic-y", `${relativeY}%`);
      target.style.setProperty("--magic-intensity", "1");
    };

    const handlePointerOut = (event) => {
      const target = event.target.closest(".magic-border");

      if (!target || target.contains(event.relatedTarget)) {
        return;
      }

      resetElement(target);
      if (activeElement === target) {
        activeElement = null;
      }
    };

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerout", handlePointerOut);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);

  useEffect(() => () => {
    if (otherOpenTimerRef.current) {
      window.clearTimeout(otherOpenTimerRef.current);
    }

    if (otherFinishTimerRef.current) {
      window.clearTimeout(otherFinishTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (introStarted) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const introStage = siteRef.current?.querySelector(".intro-stage");

    if (prefersReducedMotion || !introStage) {
      return undefined;
    }

    const idleTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3.8 });
    idleTimeline
      .to(introStage, { y: -5, scaleX: 1.018, scaleY: 0.988, duration: 0.85, ease: "power2.inOut" })
      .to(introStage, { y: 0, scaleX: 1, scaleY: 1, duration: 0.95, ease: "power3.out" });

    const moveX = gsap.quickTo(introStage, "x", { duration: 0.48, ease: "power3.out" });
    const moveY = gsap.quickTo(introStage, "y", { duration: 0.48, ease: "power3.out" });
    const scaleX = gsap.quickTo(introStage, "scaleX", { duration: 0.48, ease: "power3.out" });
    const scaleY = gsap.quickTo(introStage, "scaleY", { duration: 0.48, ease: "power3.out" });
    const rotate = gsap.quickTo(introStage, "rotation", { duration: 0.48, ease: "power3.out" });

    const handlePointerMove = (event) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = (event.clientX - centerX) / centerX;
      const dy = (event.clientY - centerY) / centerY;
      const distance = Math.min(Math.hypot(dx, dy), 1);
      const pull = Math.max(0, 1 - distance);

      idleTimeline.pause();
      moveX(dx * pull * 18);
      moveY(dy * pull * 10);
      scaleX(1 + pull * 0.075);
      scaleY(1 - pull * 0.045);
      rotate(dx * pull * 1.4);
    };

    const handlePointerLeave = () => {
      moveX(0);
      moveY(0);
      scaleX(1);
      scaleY(1);
      rotate(0);
      idleTimeline.play();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      idleTimeline.kill();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [introStarted]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFocusIndex((index) => (index + 1) % focusItems.length);
    }, 18000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop,
      );
      setIsScrolled(scrollTop > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.body.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const nav = siteRef.current?.querySelector(".nav-shell");

    if (!nav || !introDecrypted) {
      return undefined;
    }

    const wasOtherNavHidden = previousOtherNavHiddenRef.current;
    previousOtherNavHiddenRef.current = isOtherNavHidden;

    if (!isOtherNavHidden && !wasOtherNavHidden) {
      return undefined;
    }

    gsap.to(nav, {
      autoAlpha: isOtherNavHidden ? 0 : 1,
      y: isOtherNavHidden ? -16 : 0,
      duration: isOtherNavHidden ? 0.3 : 0.46,
      delay: isOtherNavHidden ? 0 : 0.08,
      ease: isOtherNavHidden ? "power2.out" : "power3.out",
      pointerEvents: isOtherNavHidden ? "none" : "auto",
      overwrite: "auto",
    });

    return undefined;
  }, [introDecrypted, isOtherNavHidden]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getScrollTop = () => Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop);

  const scrollToPagePosition = (top, behavior = "auto") => {
    window.scrollTo({ top, behavior });
    document.documentElement.scrollTo?.({ top, behavior });
    document.body.scrollTo?.({ top, behavior });
  };

  const alignElementToViewportTop = (element, behavior = "auto") => {
    if (!element) return getScrollTop();

    const targetTop = Math.max(0, element.getBoundingClientRect().top + getScrollTop());
    scrollToPagePosition(targetTop, behavior);
    return targetTop;
  };

  const alignOtherTitleBelowNav = (behavior = "auto") => {
    const title = document.getElementById("other-title");
    const heading = title?.closest(".other-heading");
    const targetElement = heading || title;

    if (!targetElement) {
      return alignElementToViewportTop(otherStageRef.current, behavior);
    }

    const nav = siteRef.current?.querySelector(".nav-shell");
    const navRect = nav?.getBoundingClientRect();
    const navStyles = nav ? window.getComputedStyle(nav) : null;
    const navTop = navStyles ? parseFloat(navStyles.top) || 0 : 16;
    const navHeight = navRect?.height || 52;
    const navGap = window.innerWidth < 760 ? 10 : 14;
    const targetTop = Math.max(
      0,
      targetElement.getBoundingClientRect().top + getScrollTop() - navTop - navHeight - navGap,
    );

    scrollToPagePosition(targetTop, behavior);
    return targetTop;
  };

  const closeOtherDetail = () => {
    if (!selectedOtherId || otherPhase === "idle" || otherPhase === "closing") {
      return;
    }

    if (otherOpenTimerRef.current) {
      window.clearTimeout(otherOpenTimerRef.current);
      otherOpenTimerRef.current = null;
    }

    if (otherFinishTimerRef.current) {
      window.clearTimeout(otherFinishTimerRef.current);
      otherFinishTimerRef.current = null;
    }

    setOtherPhase("closing");

    otherFinishTimerRef.current = window.setTimeout(() => {
      flushSync(() => {
        setOpeningOtherId(null);
        setActiveOtherId(null);
        setOtherPhase("idle");
      });
      otherFinishTimerRef.current = null;
      alignOtherTitleBelowNav("smooth");
    }, 980);
  };

  const openOtherDetail = (itemId) => {
    if (otherPhase !== "idle" || activeOtherId || openingOtherId || otherOpenTimerRef.current) {
      return;
    }

    const otherSection = document.getElementById("other");
    const targetElement = otherStageRef.current || otherSection;
    const currentScrollTop = getScrollTop();
    const targetScrollTop = targetElement
      ? Math.max(0, targetElement.getBoundingClientRect().top + currentScrollTop)
      : currentScrollTop;
    const scrollDistance = Math.abs(targetScrollTop - currentScrollTop);
    const scrollDelay = Math.min(780, Math.max(320, scrollDistance * 0.28));

    scrollToPagePosition(targetScrollTop, "smooth");

    otherOpenTimerRef.current = window.setTimeout(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      scrollToPagePosition(targetScrollTop);

      setActiveOtherId(null);
      setOpeningOtherId(itemId);
      setOtherPhase(prefersReducedMotion ? "open" : "staging");
      otherOpenTimerRef.current = null;

      window.requestAnimationFrame(() => {
        alignElementToViewportTop(otherSection);
      });

      if (prefersReducedMotion) {
        setActiveOtherId(itemId);
        setOpeningOtherId(null);
        return;
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          alignElementToViewportTop(otherSection);
          setOtherPhase("opening");

          otherFinishTimerRef.current = window.setTimeout(() => {
            setActiveOtherId(itemId);
            setOpeningOtherId(null);
            setOtherPhase("open");
            otherFinishTimerRef.current = null;
            window.requestAnimationFrame(() => alignElementToViewportTop(otherSection));
          }, 880);
        });
      });
    }, scrollDelay);
  };

  const startIntro = () => {
    if (introStarted) return;
    setIntroStarted(true);
    gsap.to(".intro-prompt", { autoAlpha: 0, y: 10, duration: 0.16, ease: "power2.out" });
    gsap.to(".intro-stage", {
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 0.28,
      ease: "power3.out",
    });
  };

  const handleIntroKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      startIntro();
    }
  };

  return (
    <div className="site" id="top" ref={siteRef}>
      <header className={`nav-shell${isScrolled ? " is-scrolled" : ""}${isOtherNavHidden ? " is-hidden" : ""}`} aria-label="Primary navigation">
        <a className="brand-mark magic-border" href="#top" aria-label="Hong Ye Wu home">
          HW
        </a>
        <nav className="nav-links">
          {navItems.map((item) => (
            <a className="magic-border" key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <button
          className={`mobile-menu-button magic-border${isMobileMenuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-navigation"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>
        <button
          className="palette-toggle magic-border"
          type="button"
          aria-label={`Switch to ${isTealAccent ? "ember red" : "teal"} accent colors`}
          aria-pressed={isTealAccent}
          onClick={toggleAccentMode}
        >
          <span className="palette-toggle-swatch" aria-hidden="true" />
          <span>Color</span>
        </button>
      </header>

      <button
        className={`mobile-nav-backdrop${isMobileMenuOpen ? " is-open" : ""}`}
        type="button"
        aria-label="Close navigation menu"
        tabIndex={isMobileMenuOpen ? 0 : -1}
        onClick={closeMobileMenu}
      />

      <aside
        className={`mobile-nav-panel${isMobileMenuOpen ? " is-open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!isMobileMenuOpen}
      >
        <nav aria-label="Mobile navigation">
          {mobileNavItems.map((item) => (
            <a className="magic-border" key={item.href} href={item.href} onClick={closeMobileMenu}>
              {item.label}
            </a>
          ))}
        </nav>
        <button
          className="mobile-palette-toggle magic-border"
          type="button"
          aria-label={`Switch to ${isTealAccent ? "ember red" : "teal"} accent colors`}
          aria-pressed={isTealAccent}
          onClick={toggleAccentMode}
        >
          <span className="palette-toggle-swatch" aria-hidden="true" />
          <span>Change Color</span>
        </button>
      </aside>

      <div
        className={`intro-curtain${introStarted ? " is-started" : ""}`}
        role="button"
        tabIndex={introStarted ? -1 : 0}
        aria-label="Click to decrypt Hong Ye Wu and enter the portfolio"
        onClick={startIntro}
        onKeyDown={handleIntroKeyDown}
      >
        <div className="intro-curtain-bg" />
        <div className="intro-stage">
          <div className="intro-decrypt-wrap">
            <DecryptedText
              text="HONG YE WU"
              speed={54}
              sequential
              revealDirection="center"
              characters="HONGYEWU0123456789/\\[]{}<>"
              parentClassName="intro-decrypt-name"
              className="decrypt-revealed"
              encryptedClassName="decrypt-encrypted"
              animateOn="manual"
              startSignal={introStarted ? 1 : 0}
              onComplete={() => setIntroDecrypted(true)}
            />
          </div>
          <div className="intro-prompt" aria-hidden="true">
            <span>click to decrypt</span>
            <i />
          </div>
        </div>
      </div>

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-video-frame" aria-hidden="true">
            <div className="hero-video-fallback" />
          </div>

          <div className="hero-inner">
            <div className="hero-topline" aria-label="Portfolio metadata">
              <span>PORTFOLIO</span>
              <span>AI / BRAND / WEB SYSTEMS</span>
              <span>[2026]</span>
            </div>

            <HeroTitle />

            <div className="hero-bottom-grid">
              <div className="hero-status-block">
                <p className="hero-status-kicker">Computer Science Student</p>
                <strong>@ UWaterloo</strong>
                <p className="hero-trait-line">Fast Learner & creative thinker</p>
                <div className="hero-actions">
                  <a className="magic-border" href="#projects">View Projects</a>
                  <a className="magic-border" href="mailto:ctharry0106@gmail.com">Contact Me</a>
                </div>
              </div>

              <div className="hero-console" aria-label="Current focus">
                <div className="hero-console-top">
                  <span>currently designing</span>
                  <span>{currentFocus.source}</span>
                </div>
                <p key={currentFocus.text}>{currentFocus.text}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-section experience-section page-panel" id="experience" aria-labelledby="experience-title">
          <div className="experience-showcase content-shell">
            <div className="experience-timeline-panel">
              <div className="experience-display-heading">
                <h2 id="experience-title">Experience</h2>
              </div>

              <div className="experience-timeline" ref={experienceTimelineRef} aria-label="Horizontal experience timeline">
                <div className="experience-track">
                  <span className="experience-track-spacer experience-track-spacer-start" aria-hidden="true" />
                  {timelineExperiences.map((item, index) => {
                    const isActive = index === activeExperienceIndex;
                    const isCurrent = item.id === "infosys";
                    const isBeforeActive = index < activeExperienceIndex;
                    const isAfterActive = index > activeExperienceIndex;
                    const companyInitials = getCompanyInitials(item.company);

                    return (
                      <article
                        key={item.id}
                        className={`experience-line experience-node magic-border${isActive ? " is-active" : ""}${isCurrent ? " is-current-role" : ""}${isBeforeActive ? " is-before-active" : ""}${isAfterActive ? " is-after-active" : ""}`}
                        data-experience-index={index}
                        role="button"
                        tabIndex={0}
                        aria-current={isActive ? "step" : undefined}
                        onClick={() => selectExperience(index)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            selectExperience(index);
                          }
                        }}
                      >
                        <span className="experience-dot" aria-hidden="true" />
                        <div className="experience-node-identity">
                          <span className="experience-company-logo" aria-hidden="true">
                            {companyInitials}
                          </span>
                          <div>
                            <span>{item.company}</span>
                            <h3>{item.role}</h3>
                          </div>
                        </div>
                        <div className="experience-node-period">
                          <PeriodStamp period={item.date} />
                        </div>
                      </article>
                    );
                  })}
                  <span className="experience-track-spacer experience-track-spacer-end" aria-hidden="true" />
                </div>
              </div>

              <div
                className="experience-dot-nav"
                aria-label="Experience timeline navigation"
                style={{ "--active-step": activeExperienceIndex }}
              >
                <span className="experience-step-indicator" aria-hidden="true" />
                {timelineExperiences.map((item, index) => (
                  <button
                    className="experience-step-dot"
                    key={item.id}
                    type="button"
                    aria-label={`View ${item.company}`}
                    aria-current={index === activeExperienceIndex ? "step" : undefined}
                    title={item.company}
                    onClick={() => selectExperience(index)}
                  />
                ))}
              </div>
            </div>

            <ExperienceDetails experience={activeExperience} />
          </div>
        </section>

        <section className="projects-section page-panel" id="projects" aria-labelledby="projects-title">
          <div className="content-shell">
            <div className="section-heading">
              <p className="section-kicker">Featured Projects</p>
              <h2 id="projects-title">Selected systems, interfaces, and AI workflows.</h2>
            </div>

            <div className="project-group">
              <div className="project-group-heading">
                <span>Currently Working On</span>
              </div>
              <div className="current-project-layout">
                {currentProjects.map((project, index) => (
                  <ProjectCard project={project} index={index} variant="current" key={project.title} />
                ))}
              </div>
            </div>

            <div className="project-group">
              <div className="project-group-heading">
                <span>Previous Projects</span>
              </div>
              <div className="featured-grid featured-grid-compact">
                {previousProjects.map((project, index) => (
                  <ProjectCard project={project} index={index + currentProjects.length} key={project.title} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className={`other-section page-panel other-phase-${otherPhase}${isOtherDetailVisible ? " is-detail-open" : ""}`}
          id="other"
          aria-labelledby="other-title"
        >
          <div className="other-shell content-shell">
            <div className="other-heading">
              <p className="section-kicker">Other</p>
              <h2 id="other-title">Learn more about me...</h2>
            </div>

            <div className={`other-stage is-${otherPhase}`} ref={otherStageRef}>
              <div
                className={`other-gallery${otherPhase === "opening" || otherPhase === "open" ? " is-pulling" : ""}`}
              >
                {otherItems.map((item) => (
                  <article
                    className={`other-card magic-border${item.id === selectedOtherId ? " is-active" : ""}`}
                    key={item.title}
                    data-other-id={item.id}
                    role={otherPhase === "idle" ? "button" : undefined}
                    tabIndex={otherPhase === "idle" ? 0 : -1}
                    onClick={() => {
                      if (otherPhase === "idle") {
                        openOtherDetail(item.id);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (otherPhase !== "idle") return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openOtherDetail(item.id);
                      }
                    }}
                    aria-label={`Open ${item.title}`}
                  >
                    <img src={item.image} alt="" aria-hidden="true" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                    {isOtherDetailVisible && otherPhase !== "staging" && item.id === selectedOtherId && (
                      <button
                        className="other-return-button magic-border"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          closeOtherDetail();
                        }}
                        aria-label={`Return from ${item.title}`}
                      >
                        Return
                      </button>
                    )}
                  </article>
                ))}
              </div>

              {isOtherDetailVisible && otherPhase !== "staging" && activeOther && (
                <div className={`other-detail-view is-${otherPhase}`} aria-live="polite">
                  <div className="other-detail-panel">
                    <div className="other-detail-bar" aria-label={`${activeOther.title} detail controls`}>
                      <span>draft collection</span>
                      <span>10 draft slots</span>
                    </div>
                    <div className="other-detail-copy">
                      <span>{activeOther.title}</span>
                      <strong>{activeOther.text}</strong>
                      <p>Ten draft slots are ready for future media, notes, embeds, selected work, or personal collections.</p>
                    </div>
                    <Masonry
                      key={activeOther.id}
                      items={otherDetailItems[activeOther.id]}
                      ease="power3.out"
                      duration={0.6}
                      stagger={0.055}
                      initialDelay={0.34}
                      animateFrom="bottom"
                      scaleOnHover
                      hoverScale={0.985}
                      blurToFocus
                      fitToContainer
                      maxColumns={3}
                      minItemHeight={132}
                      itemGap={14}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-section" id="contact">
        <div className="footer-inner content-shell">
          <p className="section-kicker">Contact</p>
          <h2>Let's build something precise, useful, and memorable.</h2>
          <div className="footer-links">
            {contactLinks.map((link) => (
              <a className="magic-border" href={link.href} key={link.label} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
