import avatarImage from "../assets/images/profile-hong-ye-wu.png";
import portraitImage from "../assets/images/profile-alt-ctharry.jpg";
import characterProjectImage from "../assets/images/project-character-app.png";
import portfolioProjectImage from "../assets/images/project-new-portfolio.png";
import componentProjectImage from "../assets/images/project-portfolio.png";
import resumePdf from "../assets/documents/harry-wu-resume.pdf";

const assets = {
  avatar: avatarImage,
  portrait: portraitImage,
  resume: resumePdf,
  video: "/assets/video/hero-loop.mp4",
};

const navItems = [
  { label: "Profile", href: "#profile" },
  { label: "Projects", href: "#projects" },
  { label: "Strengths", href: "#strengths" },
  { label: "Contact", href: "#contact" },
];

const metrics = [
  { value: "30+", label: "Pages optimized" },
  { value: "3+", label: "Automation workflows" },
  { value: "20+", label: "Tests and eval checks" },
  { value: "Top 5", label: "SEO ranking result" },
];

const featuredProjects = [
  {
    title: "Document Q&A RAG Prototype",
    type: "AI System",
    status: "Active",
    image: characterProjectImage,
    description:
      "A PDF question-answering pipeline that indexes documents in SQLite and retrieves cited passages with evaluation checks.",
    tools: ["Python", "SQLite", "OpenAI API", "Embeddings"],
    link: "https://github.com/CTHarry/rag-sql-qa",
  },
  {
    title: "SEO Website Generator & Optimizer",
    type: "Automation Product",
    status: "Jan 2026",
    image: portfolioProjectImage,
    description:
      "A generator that turns business context, location, and keyword intent into SEO-ready pages with reusable templates.",
    tools: ["JavaScript", "Node.js", "HTML/CSS", "OpenAI API"],
    link: "https://github.com/CTHarry",
  },
  {
    title: "AI-Enhanced Web Components Library",
    type: "Design System",
    status: "Jan 2026",
    image: componentProjectImage,
    description:
      "A reusable React component library with accessibility-first UI patterns and AI-assisted copy generation.",
    tools: ["React", "JavaScript", "Python", "Gemini API"],
    link: "https://github.com/CTHarry",
  },
  {
    title: "Modern Portfolio Website",
    type: "Personal Brand",
    status: "Active",
    image: portfolioProjectImage,
    description:
      "A responsive identity site shaped around clear presentation, interactive cards, and custom personal details.",
    tools: ["React", "Vite", "CSS", "Design"],
    link: "#top",
  },
];

const experiences = [
  {
    role: "Website Developer / SEO & Automation Engineer",
    place: "Keep Your Head Up Foundation",
    detail:
      "Improved Google ranking for Waterloo concussion from page 3+ to page 1 top 5, standardized 30+ pages, and built automation workflows that reduced manual data handling by about 40%.",
  },
  {
    role: "Computer Science Student",
    place: "University of Waterloo",
    detail:
      "Honours Bachelor of Computer Science with focus on data structures, object-oriented programming, C/C++, testing, and software design.",
  },
  {
    role: "Math Club President / Mandarin Club Founder",
    place: "Victoria Park Collegiate Institute",
    detail:
      "Led student communities through teaching, competition preparation, cultural programming, and recurring events.",
  },
];

const strengths = [
  {
    title: "AI Product Thinking",
    text: "I turn model capability into clear workflows, structured prompts, retrieval checks, and usable product behavior.",
  },
  {
    title: "Systems Front-End",
    text: "I build interfaces with attention to hierarchy, accessibility, state, and the small details that make tools feel reliable.",
  },
  {
    title: "Automation Sense",
    text: "I like replacing repetitive work with scripts, API links, Zapier flows, validation, logging, and measurable operations.",
  },
  {
    title: "Brand-Minded Detail",
    text: "I care about how technical work is perceived: naming, visual rhythm, tone, and the way a first impression lands.",
  },
];

const contactLinks = [
  { label: "Email", href: "mailto:hywu@uwaterloo.ca" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hongyewu/" },
  { label: "GitHub", href: "https://github.com/CTHarry" },
  { label: "Resume", href: assets.resume },
];

function App() {
  return (
    <div className="site" id="top">
      <header className="nav-shell" aria-label="Primary navigation">
        <a className="brand-mark" href="#top" aria-label="Hong Ye Wu home">
          HW
        </a>
        <nav className="nav-links">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="nav-contact" href="mailto:hywu@uwaterloo.ca">
          Contact
        </a>
      </header>

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-video-frame" aria-hidden="true">
            {/* Replace /assets/video/hero-loop.mp4 with your final video background. */}
            <video autoPlay muted loop playsInline poster="/assets/images/project-new-portfolio.png">
              <source src={assets.video} type="video/mp4" />
            </video>
            <div className="hero-video-fallback" />
          </div>

          <div className="hero-inner">
            <p className="section-kicker">AI designer / front-end engineer / automation builder</p>
            <h1 id="hero-title">
              Hong Ye Wu
              <span>Harry Wu</span>
            </h1>
            <p className="hero-copy">
              I design and build AI-enabled web systems with a product mindset: clean interfaces,
              automation, SEO, retrieval pipelines, and details that make technical work feel intentional.
            </p>
            <div className="hero-actions">
              <a href="#projects">View Projects</a>
              <a href="mailto:hywu@uwaterloo.ca">Start a Conversation</a>
            </div>
          </div>
        </section>

        <section className="profile-section page-panel" id="profile" aria-labelledby="profile-title">
          <div className="profile-grid content-shell">
            <div className="profile-visual">
              <img src={assets.avatar} alt="Hong Ye Wu profile" />
              <div className="profile-tag">Hong Ye Wu / Harry Wu</div>
            </div>

            <div className="profile-copy">
              <p className="section-kicker">Personal Experience</p>
              <h2 id="profile-title">Building useful AI and web systems with a designer's eye.</h2>
              <p>
                I am an Honours Bachelor of Computer Science student at the University of Waterloo.
                My current work connects full-stack development, AI automation, technical SEO, RAG,
                and interface design.
              </p>
              <div className="contact-strip" aria-label="Contact information">
                <a href="mailto:hywu@uwaterloo.ca">hywu@uwaterloo.ca</a>
                <a href="https://www.linkedin.com/in/hongyewu/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href="https://github.com/CTHarry" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </div>

            <div className="metric-grid" aria-label="Project data">
              {metrics.map((metric) => (
                <div className="metric-card" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>

            <div className="experience-stack">
              {experiences.map((item) => (
                <article key={item.role} className="experience-line">
                  <span>{item.place}</span>
                  <h3>{item.role}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="projects-section page-panel" id="projects" aria-labelledby="projects-title">
          <div className="content-shell">
            <div className="section-heading">
              <p className="section-kicker">Featured Projects</p>
              <h2 id="projects-title">Selected systems, interfaces, and AI workflows.</h2>
            </div>

            <div className="featured-grid">
              {featuredProjects.map((project, index) => (
                <a
                  className={`project-card project-card-${index + 1}`}
                  href={project.link}
                  target={project.link.startsWith("#") ? undefined : "_blank"}
                  rel={project.link.startsWith("#") ? undefined : "noreferrer"}
                  key={project.title}
                >
                  <img src={project.image} alt="" aria-hidden="true" />
                  <div className="project-overlay">
                    <div className="project-meta">
                      <span>{project.type}</span>
                      <span>{project.status}</span>
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
              ))}
            </div>
          </div>
        </section>

        <section className="strengths-section page-panel" id="strengths" aria-labelledby="strengths-title">
          <div className="content-shell">
            <div className="section-heading compact">
              <p className="section-kicker">Strengths</p>
              <h2 id="strengths-title">I work where design taste meets technical execution.</h2>
            </div>

            <div className="strength-grid">
              {strengths.map((strength, index) => (
                <article className="strength-card" key={strength.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{strength.title}</h3>
                  <p>{strength.text}</p>
                </article>
              ))}
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
              <a href={link.href} key={link.label} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}>
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
