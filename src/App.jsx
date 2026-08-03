import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import characterProjectImage from "../assets/images/project-character-app.png";
import portfolioProjectImage from "../assets/images/project-new-portfolio.png";
import componentProjectImage from "../assets/images/project-portfolio.png";
import infosysExperienceIcon from "../assets/images/experience-infosys-icon.png";
import kyhuExperienceIcon from "../assets/images/experience-kyhu-icon.png";
import uwExperienceIcon from "../assets/images/experience-uw-icon.png";
import vpciExperienceIcon from "../assets/images/experience-vpci-icon.png";
import assistantStandingImage from "../assets/images/assistant-standing.png";
import assistantLeaningImage from "../assets/images/assistant-leaning.png";
import assistantHangingImage from "../assets/images/assistant-hanging.png";
import assistantLyingImage from "../assets/images/assistant-lying.png";
import videoCoverImage from "../assets/images/videos/muzimi-cake-cover.png";
import muzimiCakePlanCover from "../assets/images/videos/muzimi-cake-plan.jpg";
import tonyBirthdayAdventureCover from "../assets/images/videos/tony-birthday-adventure.jpg";
import lavaBalloonsCover from "../assets/images/videos/lava-balloons.jpg";
import laoQiaoFallCover from "../assets/images/videos/lao-qiao-fall.jpg";
import monitoringBestFriendCover from "../assets/images/music/monitoring-best-friend-remix.png";
import sensoryOverloadCover from "../assets/images/music/sensory-overload-cover.png";
import emotionalRecyclingStationCover from "../assets/images/music/emotional-recycling-station-cover.png";
import mikazukiCover from "../assets/images/music/mikazuki.jpg";
import tekItCover from "../assets/images/music/tek-it.jpg";
import kuzuriCover from "../assets/images/music/kuzuri.jpg";
import eireneCover from "../assets/images/music/eirene.jpg";
import nightDancerCover from "../assets/images/music/night-dancer.jpg";
import lazySongCover from "../assets/images/music/the-lazy-song.jpg";
import youngDumbBrokeCover from "../assets/images/music/young-dumb-and-broke.jpg";
import kokoronashiCover from "../assets/images/music/kokoronashi.jpg";
import ghostInAFlowerCover from "../assets/images/music/ghost-in-a-flower.jpg";
import travelersEncoreCover from "../assets/images/music/travelers-encore.jpg";
import heroismCover from "../assets/images/music/heroism.jpg";
import deepSeaGirlCover from "../assets/images/music/deep-sea-girl.jpg";
import patchworkStaccatoCover from "../assets/images/music/patchwork-staccato.jpg";
import handInHandCover from "../assets/images/music/hand-in-hand.jpg";
import whiteMindCover from "../assets/images/music/white-mind.jpg";
import overwatchCover from "../assets/images/games/overwatch-2.jpg";
import counterStrikeCover from "../assets/images/games/counter-strike-2.jpg";
import apexLegendsCover from "../assets/images/games/apex-legends.jpg";
import repoCover from "../assets/images/games/repo.jpg";
import lethalCompanyCover from "../assets/images/games/lethal-company.jpg";
import contentWarningCover from "../assets/images/games/content-warning.jpg";
import left4DeadCover from "../assets/images/games/left-4-dead.jpg";
import sevenDaysCover from "../assets/images/games/7-days-to-die.jpg";
import terrariaCover from "../assets/images/games/terraria.jpg";
import minecraftCover from "../assets/images/games/minecraft.jpg";
import noitaCover from "../assets/images/games/noita.jpg";
import shapeOfDreamsCover from "../assets/images/games/shape-of-dreams.jpg";
import deadCellsCover from "../assets/images/games/dead-cells.jpg";
import cyberpunkCover from "../assets/images/games/cyberpunk-2077.jpg";
import emotionalRecyclingStationPreview from "../assets/music/previews/emotional-recycling-station-preview.mp3";
import sensoryOverloadPreview from "../assets/music/previews/sensory-overload-preview.mp3";
import resumePdf from "../assets/documents/harry-wu-resume.pdf";
import DecryptedText from "./DecryptedText.jsx";
import Masonry from "./Masonry.jsx";

const assets = {
  resume: resumePdf,
};

const photoFiles = import.meta.glob("../assets/images/photos/*", {
  eager: true,
  query: "?url",
  import: "default",
});
const photoPreviewFiles = import.meta.glob("../assets/images/photos/web/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const getPhotoUrl = (fileName) => photoFiles[`../assets/images/photos/${fileName}`];
const getPhotoPreviewUrl = (fileName) =>
  photoPreviewFiles[
    `../assets/images/photos/web/${fileName.replace(/\.[^.]+$/, ".jpg")}`
  ];

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

const sectionOrder = ["home", "experience", "projects", "other", "contact"];

const navItems = [
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "other", label: "Other", href: "#other" },
  { id: "contact", label: "Contact", href: "#contact" },
];

const mobileNavItems = [
  { id: "home", label: "Home", href: "#home" },
  ...navItems,
];

const assistantPrompts = [
  {
    id: "current-work",
    label: "What is Harry working on?",
    response:
      "Harry is building semantic navigation workflows for autonomous mobile robots using ROS2, Nav2, local costmaps, and vision-language models.",
  },
  {
    id: "best-project",
    label: "Show me a featured project",
    response:
      "Start with the Local VLM Semantic Costmap System. It translates visual scene reasoning into navigation-aware costmap updates for socially aware robot movement.",
  },
  {
    id: "infosys",
    label: "Tell me about Infosys",
    response:
      "At Infosys, Harry works across robotics perception, navigation, safety, alerts, and interaction through a coordinated ROS2 and AI-agent workflow.",
  },
  {
    id: "contact",
    label: "How can I contact Harry?",
    response:
      "Email ctharry0106@gmail.com, or use the LinkedIn and GitHub links in the Contact section.",
  },
];

function getInitialSection() {
  if (typeof window === "undefined") return "home";

  const requestedSection = window.location.hash.replace("#", "");
  return sectionOrder.includes(requestedSection) ? requestedSection : "home";
}

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
    tools: ["Python", "ROS2", "Nav2", "VLM", "Costmap"],
    link: "https://www.infosys.com/",
  },
  {
    title: "Robot Coordination Agent System",
    type: "Infosys Intern Work",
    status: "Jun. 2026 - Present",
    image: componentProjectImage,
    description:
      "A VLA-inspired AI agent layer that coordinates robot navigation, safety, alerts, and human interaction.",
    tools: ["Python", "ROS2", "AI Agents", "VLA", "Safety"],
    link: "https://www.infosys.com/",
  },
  {
    title: "Modern Portfolio Website",
    type: "Personal Brand",
    status: "2026 - Present",
    image: portfolioProjectImage,
    description:
      "A responsive identity site shaped around clear presentation, interactive cards, and custom personal details.",
    tools: ["JavaScript", "React", "Vite", "CSS"],
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
    projects: [
      "Local VLM semantic costmap system",
      "Robot coordination agent for navigation, safety, alerts, and interaction",
    ],
    languages: ["Python", "C++"],
    tools: ["ROS2", "AMR", "Nav2", "VLA", "VLM", "Costmap", "AI agent"],
    responsibilities: [
      "Prototype semantic costmap updates for socially aware robot navigation.",
      "Connect perception, safety, alerting, and interaction logic into coordinated robot workflows.",
      "Evaluate robotics behavior across navigation and human-facing edge cases.",
    ],
    impact:
      "Advancing a more context-aware AMR workflow that can reason about navigation, safety, and interaction as one system.",
  },
  {
    id: "kyhu",
    company: "Keep Your Head Up Foundation",
    role: "Website Developer / SEO & Automation Engineer",
    date: "May 2025 - Aug. 2025",
    location: "Waterloo, ON",
    detail:
      "Improved technical SEO, standardized the Squarespace site, and built JavaScript automation workflows for cleaner operations.",
    projects: [
      "Technical SEO refresh",
      "Squarespace page system cleanup",
      "Automation workflows for operations",
    ],
    languages: ["JavaScript", "HTML/CSS"],
    tools: ["Squarespace", "SEO", "Zapier", "Analytics"],
    responsibilities: [
      "Standardized page structure and content patterns across the website.",
      "Built automation workflows to reduce repeated manual data handling.",
      "Improved search visibility through cleaner technical SEO and content organization.",
    ],
    impact:
      "Made the site easier to maintain while improving discoverability for concussion-related resources.",
  },
  {
    id: "uwaterloo",
    company: "University of Waterloo",
    role: "Computer Science Student",
    date: "Sep. 2024 - May 2029",
    location: "Waterloo, ON",
    detail:
      "Studying Honours Computer Science with focus on data structures, object-oriented programming, C/C++, testing, and software design.",
    projects: [
      "Coursework labs",
      "Data structure implementations",
      "Software design and testing exercises",
    ],
    languages: ["C", "C++", "Python"],
    tools: ["Git", "Linux", "Testing", "Debugging"],
    responsibilities: [
      "Build a strong foundation in algorithms, data structures, and systems-level programming.",
      "Practice testing, debugging, and clean implementation through coursework.",
      "Connect classroom CS fundamentals with robotics, AI, and web systems projects.",
    ],
    impact:
      "Developing the technical base behind my full-stack, AI, and robotics work.",
  },
  {
    id: "vic-park",
    company: "Victoria Park Collegiate Institute",
    role: "Math Club President / Mandarin Club Founder",
    date: "2020 - 2024",
    location: "Toronto, ON",
    detail:
      "Led student communities through teaching, competition preparation, cultural programming, and recurring events.",
    projects: [
      "Math club sessions",
      "Mandarin club programming",
      "Student events and competition preparation",
    ],
    languages: [],
    tools: ["Leadership", "Teaching", "Event planning", "Mentorship"],
    responsibilities: [
      "Organized recurring club sessions and student-led programming.",
      "Supported peers through teaching, mentorship, and competition preparation.",
      "Built communities around problem solving, language, and culture.",
    ],
    impact:
      "Built the leadership and communication habits that still shape how I work on teams.",
  },
];

const photoJournal = [
  { file: "IMG_1396.JPG", title: "Quiet water", height: 320 },
  { file: "IMG_1669.JPG", title: "Garden lights", height: 280 },
  { file: "IMG_1821.JPG", title: "Autumn trail", height: 360 },
  { file: "IMG_1916.JPG", title: "Weather front", height: 280 },
  { file: "IMG_20240801_173318.jpg", title: "Pagoda day", height: 420 },
  { file: "IMG_20240803_143831.jpg", title: "Mahjong table", height: 320 },
  { file: "IMG_20240902_215649.jpg", title: "Painted portrait", height: 380 },
  { file: "IMG_20260126_213823.jpg", title: "Miku collection", height: 300 },
  { file: "IMG_2684.JPG", title: "Window light", height: 420 },
  { file: "IMG_3240.JPG", title: "Wide-angle hello", height: 300 },
  { file: "IMG_4281.JPG", title: "Summer frame", height: 300 },
  { file: "IMG_4639.JPG", title: "Old Quebec", height: 440 },
  { file: "IMG_5031.png", title: "Adiyogi", height: 320 },
  { file: "IMG_5091.JPG", title: "Red wall", height: 400 },
  { file: "IMG_5158.JPG", title: "Roadside type", height: 300 },
  { file: "IMG_1885.JPG", title: "Perspective check", height: 300 },
].map((photo, index) => ({
  id: `photo-${index + 1}`,
  img: getPhotoPreviewUrl(photo.file),
  href: getPhotoUrl(photo.file),
  height: photo.height,
  kicker: "Photo journal",
  title: photo.title,
  description: "Photographed by Hong Ye Wu.",
  alt: photo.title,
}));

const musicRecommendations = [
  { title: "ミカヅキ", artist: "Sayuri", cover: mikazukiCover },
  { title: "Tek It", artist: "Cafuné", cover: tekItCover },
  { title: "KUZURI", artist: "ZUTOMAYO", cover: kuzuriCover },
  { title: "エイレネ", artist: "Chao's Mall", cover: eireneCover },
  { title: "NIGHT DANCER", artist: "imase", cover: nightDancerCover },
  { title: "The Lazy Song", artist: "Bruno Mars", cover: lazySongCover },
  {
    title: "Young Dumb & Broke",
    artist: "Khalid",
    cover: youngDumbBrokeCover,
  },
  { title: "心做し", artist: "majiko", cover: kokoronashiCover },
  {
    title: "Ghost In A Flower",
    artist: "Yorushika",
    cover: ghostInAFlowerCover,
  },
  {
    title: "Travelers' Encore",
    artist: "Andrew Prahlow",
    cover: travelersEncoreCover,
    appleHref: "https://music.apple.com/us/song/1641696360",
  },
  {
    title: "感官过载",
    artist: "M3mo",
    cover: sensoryOverloadCover,
    previewUrl: sensoryOverloadPreview,
    sourceHref: "https://www.bilibili.com/video/BV1hkGt6hEva/",
    sourceLabel: "Bilibili",
  },
  {
    title: "情绪回收站",
    artist: "失落花园",
    cover: emotionalRecyclingStationCover,
    previewUrl: emotionalRecyclingStationPreview,
    sourceHref: "https://www.bilibili.com/video/BV1J4zWB8EuQ",
    sourceLabel: "Bilibili",
  },
  {
    title: "英雄主义",
    artist: "在虚无中永存",
    cover: heroismCover,
    appleHref:
      "https://music.apple.com/us/album/%E8%8B%B1%E9%9B%84%E4%B8%BB%E4%B9%89-single/1831162924",
  },
  {
    title: "深海少女",
    artist: "Yuuyu-P feat. Hatsune Miku",
    cover: deepSeaGirlCover,
  },
  {
    title: "拼凑的断音",
    artist: "Toa feat. Hatsune Miku",
    cover: patchworkStaccatoCover,
    previewTitle: "Patchwork Staccato",
    appleHref:
      "https://music.apple.com/hk/song/patchwork-staccato-feat-hatsune-miku/1585735640",
  },
  {
    title: "Monitoring (Best Friend Remix)",
    artist: "DECO*27 feat. Hatsune Miku",
    cover: monitoringBestFriendCover,
    previewUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/29/05/a8/2905a8c7-9cb0-1204-1923-a212ef935627/mzaf_16246785443421993678.plus.aac.p.m4a",
    appleHref:
      "https://music.apple.com/us/song/1832605668",
  },
  {
    title: "Hand in Hand (Magical Mirai ver.)",
    artist: "kz (livetune) feat. Hatsune Miku",
    cover: handInHandCover,
  },
  {
    title: "White Mind",
    artist: "Glue feat. Hatsune Miku",
    cover: whiteMindCover,
  },
].map((song, index) => ({
  ...song,
  id: `song-${index + 1}`,
  href:
    song.sourceHref ??
    song.appleHref ??
    `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`,
}));

// Music groups: move song IDs between groups to reorganize the collection.
const musicGroups = [
  {
    id: "japanese-alt",
    title: "Japanese alt",
    description: "Sharp vocals and restless arrangements",
    songIds: ["song-1", "song-3", "song-4", "song-8", "song-9"],
  },
  {
    id: "instrumental-focus",
    title: "Instrumental focus",
    description: "Game scores and quiet electronic pieces",
    songIds: ["song-10", "song-11", "song-12", "song-13"],
  },
  {
    id: "vocaloid",
    title: "Vocaloid & Miku",
    description: "Digital voices, bright hooks, and nostalgia",
    songIds: ["song-14", "song-15", "song-16", "song-17", "song-18"],
  },
  {
    id: "late-night-pop",
    title: "Late-night pop",
    description: "Easy energy and familiar comfort tracks",
    songIds: ["song-2", "song-5", "song-6", "song-7"],
  },
].map((group) => ({
  ...group,
  songs: group.songIds
    .map((songId) => musicRecommendations.find((song) => song.id === songId))
    .filter(Boolean),
}));

// Video collection: update titles, BVIDs, page numbers, and covers here.
const videoCollection = [
  {
    title: "睦子米蛋糕计划",
    bvid: "BV1tQ3c62E3C",
    page: 1,
    cover: muzimiCakePlanCover,
    href: "https://www.bilibili.com/video/BV1tQ3c62E3C/?vd_source=eaea3286194f606c08f5a6343db5d443",
  },
  {
    title: "Tony的奇妙冒险【生日作品】",
    bvid: "BV168NX6cEsz",
    page: 2,
    cover: tonyBirthdayAdventureCover,
    href: "https://www.bilibili.com/video/BV168NX6cEsz?vd_source=eaea3286194f606c08f5a6343db5d443&p=2&spm_id_from=333.788.player.switch",
  },
  {
    title: "我有两颗熔岩气球!",
    bvid: "BV1THKQ6rEmM",
    page: 1,
    cover: lavaBalloonsCover,
    href: "https://www.bilibili.com/video/BV1THKQ6rEmM/?vd_source=eaea3286194f606c08f5a6343db5d443",
  },
  {
    title: "老乔：坠落",
    bvid: "BV1RzdKBLEcE",
    page: 1,
    cover: laoQiaoFallCover,
    href: "https://www.bilibili.com/video/BV1RzdKBLEcE/?vd_source=eaea3286194f606c08f5a6343db5d443",
  },
].map((video, index) => ({
  ...video,
  id: `video-${index + 1}`,
  embedUrl: `https://player.bilibili.com/player.html?bvid=${video.bvid}&page=${video.page}&high_quality=1&danmaku=0&autoplay=1`,
}));

const gameCatalog = {
  overwatch: {
    title: "Overwatch 2",
    cover: overwatchCover,
    href: "https://store.steampowered.com/app/2357570/Overwatch_2/",
  },
  counterStrike: {
    title: "Counter-Strike 2",
    cover: counterStrikeCover,
    href: "https://store.steampowered.com/app/730/CounterStrike_2/",
  },
  apexLegends: {
    title: "Apex Legends",
    cover: apexLegendsCover,
    href: "https://store.steampowered.com/app/1172470/Apex_Legends/",
  },
  repo: {
    title: "R.E.P.O.",
    cover: repoCover,
    href: "https://store.steampowered.com/app/3241660/REPO/",
  },
  lethalCompany: {
    title: "Lethal Company",
    cover: lethalCompanyCover,
    href: "https://store.steampowered.com/app/1966720/Lethal_Company/",
  },
  contentWarning: {
    title: "Content Warning",
    cover: contentWarningCover,
    href: "https://store.steampowered.com/app/2881650/Content_Warning/",
  },
  left4Dead: {
    title: "Left 4 Dead",
    cover: left4DeadCover,
    href: "https://store.steampowered.com/app/500/Left_4_Dead/",
  },
  sevenDays: {
    title: "7 Days to Die",
    cover: sevenDaysCover,
    href: "https://store.steampowered.com/app/251570/7_Days_to_Die/",
  },
  terraria: {
    title: "Terraria",
    cover: terrariaCover,
    href: "https://store.steampowered.com/app/105600/Terraria/",
  },
  minecraft: {
    title: "Minecraft",
    cover: minecraftCover,
    href: "https://www.xbox.com/en-US/games/store/minecraft-java-bedrock-edition-for-pc/9NXP44L49SHJ",
  },
  noita: {
    title: "Noita",
    cover: noitaCover,
    href: "https://store.steampowered.com/app/881100/Noita/",
  },
  shapeOfDreams: {
    title: "Shape of Dreams",
    cover: shapeOfDreamsCover,
    href: "https://store.steampowered.com/app/2444750/Shape_of_Dreams/",
  },
  deadCells: {
    title: "Dead Cells",
    cover: deadCellsCover,
    href: "https://store.steampowered.com/app/588650/Dead_Cells/",
  },
  cyberpunk: {
    title: "Cyberpunk 2077",
    cover: cyberpunkCover,
    href: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
  },
};

// Gaming library: add or reorganize game objects within these groups.
const gamingGroups = [
  {
    id: "competitive",
    title: "Competitive",
    games: [
      gameCatalog.overwatch,
      gameCatalog.counterStrike,
      gameCatalog.apexLegends,
    ],
  },
  {
    id: "co-op-horror",
    title: "Co-op horror",
    games: [
      gameCatalog.repo,
      gameCatalog.lethalCompany,
      gameCatalog.contentWarning,
      gameCatalog.left4Dead,
    ],
  },
  {
    id: "survival-sandbox",
    title: "Survival & sandbox",
    games: [gameCatalog.sevenDays, gameCatalog.terraria, gameCatalog.minecraft],
  },
  {
    id: "action-adventure",
    title: "Action & adventure",
    games: [
      gameCatalog.noita,
      gameCatalog.shapeOfDreams,
      gameCatalog.deadCells,
      gameCatalog.cyberpunk,
    ],
  },
];

const gamingCount = gamingGroups.reduce(
  (total, group) => total + group.games.length,
  0,
);

const otherItems = [
  {
    id: "photos",
    title: "photos",
    image: getPhotoPreviewUrl("IMG_1396.JPG"),
    text: "Visual notes from places, people, and small moments.",
    detailLabel: "Photo journal",
    detailMeta: `${photoJournal.length} frames`,
    detailBody:
      "A personal archive of landscapes, travel, friends, and quiet details worth keeping.",
  },
  {
    id: "music",
    title: "music",
    image: getPhotoPreviewUrl("IMG_20260126_213823.jpg"),
    text: "Rhythm, focus sessions, and sound as a design moodboard.",
    detailLabel: "On repeat",
    detailMeta: `${musicRecommendations.length} recommendations`,
    detailBody:
      "Japanese alt, instrumental scores, Vocaloid, and familiar late-night tracks in my regular rotation.",
  },
  {
    id: "videos",
    title: "videos",
    image: videoCoverImage,
    text: "Animation, gameplay, and character-led video experiments.",
    detailLabel: "Video collection",
    detailMeta: `${videoCollection.length} films`,
    detailBody:
      "Four separate videos, each with its own story, edit, and visual direction.",
  },
  {
    id: "gaming",
    title: "gaming",
    image: deadCellsCover,
    text: "Game systems, playful mechanics, and interactive experiments.",
    detailLabel: "Games library",
    detailMeta: `${gamingCount} favorites`,
    detailBody:
      "A mix of competitive teamwork, chaotic co-op sessions, survival sandboxes, and sharp action games.",
  },
];

const otherDetailItems = { photos: photoJournal };

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

function getExperienceStartDate(period) {
  return parseDatePart(period.split(/\s+-\s+/)[0]);
}

function formatExperienceDateRange(period) {
  const dates = period.split(/\s+-\s+/).map(parseDatePart);
  const [start, end] = dates;
  const startText = start.month
    ? `${start.month.toUpperCase()} ${start.year}`
    : start.year;
  const endText =
    end?.year === "Now"
      ? "PRESENT"
      : end?.month
        ? `${end.month.toUpperCase()} ${end.year}`
        : end?.year;

  return { startText, endText: endText || "PRESENT" };
}

function formatEditorialPeriod(period) {
  const { startText, endText } = formatExperienceDateRange(period);

  return `${startText} — ${endText}`;
}

function formatTimelinePeriod(period) {
  const { startText, endText } = formatExperienceDateRange(period);

  return `${startText} - ${endText}`;
}

function PeriodStamp({ period }) {
  const dates = period.split(/\s+-\s+/).map(parseDatePart);

  return (
    <span className="period-stamp" aria-label={period}>
      {dates.map((date, index) => (
        <span
          className="period-piece"
          key={`${date.year}-${date.month}-${index}`}
        >
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
      data-project-index={String(index + 1).padStart(2, "0")}
    >
      <img src={project.image} alt="" aria-hidden="true" />
      <div className="project-overlay">
        <div className="project-meta">
          <span>{project.type}</span>
          <PeriodStamp period={project.status} />
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div
          className="tool-row"
          aria-label={`Skills used: ${project.tools.join(", ")}`}
        >
          {project.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </div>
    </a>
  );
}

function getTimelineRoleLines(experience) {
  const roleLines = {
    kyhu: ["Website Developer", "SEO & Automation Engineer"],
    "vic-park": ["Math Club President", "Mandarin Club Founder"],
  };

  return roleLines[experience.id] ?? [experience.role];
}

function getTimelineCompanyLabel(experience) {
  const compactNames = {
    "vic-park": "Victoria Park",
    uwaterloo: "UWaterloo",
    kyhu: "KYHU",
    infosys: "Infosys",
  };

  return compactNames[experience.id] ?? experience.company;
}

function getTimelineIconSource(experience) {
  const iconSources = {
    "vic-park": vpciExperienceIcon,
    uwaterloo: uwExperienceIcon,
    kyhu: kyhuExperienceIcon,
    infosys: infosysExperienceIcon,
  };

  return iconSources[experience.id];
}

const experiencePullTimers = new WeakMap();

function updateExperienceTagMotion(event) {
  if (
    event.pointerType === "touch" ||
    event.currentTarget.dataset.pulling === "true"
  )
    return;

  const tag = event.currentTarget;
  const bounds = tag.getBoundingClientRect();
  const horizontal = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
  const vertical = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

  tag.style.setProperty("--tag-x", `${(horizontal * 5).toFixed(2)}px`);
  tag.style.setProperty("--tag-y", `${(vertical * 2.5).toFixed(2)}px`);
  tag.style.setProperty("--tag-rotate", `${(horizontal * 0.45).toFixed(2)}deg`);
  tag.style.setProperty("--string-angle", `${(horizontal * -5).toFixed(2)}deg`);
}

function resetExperienceTagMotion(eventOrElement) {
  const tag = eventOrElement?.currentTarget ?? eventOrElement;

  if (!tag) return;

  tag.style.setProperty("--tag-x", "0px");
  tag.style.setProperty("--tag-y", "0px");
  tag.style.setProperty("--tag-rotate", "0deg");
  tag.style.setProperty("--string-angle", "0deg");
}

function playExperienceTagPull(tag) {
  if (!tag) return;

  const previousTimer = experiencePullTimers.get(tag);
  if (previousTimer) window.clearTimeout(previousTimer);

  resetExperienceTagMotion(tag);
  delete tag.dataset.pulling;
  void tag.offsetWidth;
  tag.dataset.pulling = "true";

  const timer = window.setTimeout(() => {
    delete tag.dataset.pulling;
    experiencePullTimers.delete(tag);
  }, 620);

  experiencePullTimers.set(tag, timer);
}

function getExperienceOverview(experience) {
  const overview = {
    infosys:
      "Building semantic navigation systems for autonomous mobile robots using vision-language models, ROS2, Nav2, and local costmaps.",
    kyhu: "Improved the Squarespace site, technical SEO, and JavaScript automation for a youth-focused nonprofit.",
    uwaterloo:
      "Studying Honours Computer Science with a focus on systems programming, data structures, testing, and software design.",
    "vic-park":
      "Led student communities through math programming, Mandarin cultural events, mentorship, and competition preparation.",
  };

  return overview[experience.id] ?? experience.detail;
}

function getExperienceWorkItems(experience) {
  const workItems = {
    infosys: [
      {
        title: "Semantic costmap generation",
        outcome:
          "Converted visual scene interpretations into navigation-aware cost values.",
      },
      {
        title: "Robot coordination agent",
        outcome:
          "Connected navigation state, safety events, and interaction logic.",
      },
      {
        title: "ROS2 simulation workflows",
        outcome:
          "Created repeatable test scenarios for evaluating robot behaviour.",
      },
    ],
    kyhu: [
      {
        title: "Technical SEO refresh",
        outcome:
          "Improved discovery and made concussion resources easier to find.",
      },
      {
        title: "Squarespace page system cleanup",
        outcome: "Standardized page structure so updates stayed consistent.",
      },
      {
        title: "JavaScript automation workflows",
        outcome: "Reduced repeated manual data handling for operations.",
      },
    ],
    uwaterloo: [
      {
        title: "Systems and algorithms coursework",
        outcome:
          "Built the CS foundation behind robotics, AI, and web projects.",
      },
      {
        title: "Data structure implementations",
        outcome: "Turned theory into tested, debuggable code.",
      },
      {
        title: "Software design practice",
        outcome:
          "Connected implementation details with maintainable project structure.",
      },
    ],
    "vic-park": [
      {
        title: "Math club sessions",
        outcome: "Supported peer learning and competition preparation.",
      },
      {
        title: "Mandarin club programming",
        outcome: "Created recurring space for language and cultural events.",
      },
      {
        title: "Student mentorship",
        outcome: "Built communication habits that carry into team projects.",
      },
    ],
  };

  return (
    workItems[experience.id] ??
    experience.responsibilities.map((responsibility) => ({
      title: responsibility.replace(/\.$/, ""),
      outcome: experience.impact,
    }))
  );
}

function getExperienceTechStack(experience) {
  const stacks = {
    infosys: ["Python", "C++", "ROS2", "Nav2", "Qwen2.5-VL", "Local costmaps"],
    kyhu: ["JavaScript", "Squarespace", "SEO", "Zapier", "Analytics"],
    uwaterloo: ["C", "C++", "Python", "Git", "Linux", "Testing"],
    "vic-park": ["Leadership", "Teaching", "Event planning", "Mentorship"],
  };

  return (
    stacks[experience.id] ?? [
      ...new Set([...experience.languages, ...experience.tools]),
    ]
  );
}

function ExperienceDetails({ experience, transitionDirection, transitionPhase }) {
  const overview = getExperienceOverview(experience);
  const workItems = getExperienceWorkItems(experience);
  const techStack = getExperienceTechStack(experience);
  const directionClass =
    transitionDirection < 0 ? "is-windmill-backward" : "is-windmill-forward";

  return (
    <aside
      className={`experience-detail-panel is-windmill-${transitionPhase} ${directionClass}`}
      data-experience-id={experience.id}
      aria-busy={transitionPhase !== "idle"}
      aria-live="polite"
    >
      <header className="experience-detail-top">
        <div className="experience-detail-title-row">
          <span className="experience-detail-company">
            {experience.company}
          </span>
          <span className="experience-detail-date">
            {formatTimelinePeriod(experience.date)}
          </span>
        </div>
        <h3>{experience.role}</h3>
        <p>{experience.location}</p>
      </header>

      <section className="experience-detail-card experience-detail-wide">
        <p>{overview}</p>
      </section>

      <section className="experience-detail-card experience-work-section">
        <span>Selected work</span>
        <div className="experience-work-list">
          {workItems.map((item) => (
            <article className="experience-work-item" key={item.title}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="experience-detail-card experience-tech-section">
        <span>Tools</span>
        <p className="experience-tool-line">{techStack.join(", ")}</p>
      </section>
    </aside>
  );
}

function HeroTitle() {
  return (
    <h1 id="hero-title" className="hero-title" aria-label="Hong Ye Wu">
      <span className="hero-title-shine" aria-hidden="true">
        {heroTitleWords.map((word, wordIndex) => (
          <span
            className={`hero-title-word hero-title-word-${wordIndex + 1}`}
            key={word}
          >
            <span className="hero-title-word-inner">
              {[...word].map((letter, letterIndex) => (
                <span
                  className="hero-title-letter"
                  key={`${word}-${letter}-${letterIndex}`}
                >
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

function PortfolioAssistant({
  activeSection,
  isOpen,
  message,
  onClose,
  onPrompt,
  onToggle,
}) {
  const drawerSide = activeSection === "projects" ? "left" : "right";
  const assistantImage = {
    home: assistantLeaningImage,
    experience: assistantStandingImage,
    projects: assistantLeaningImage,
    other: assistantHangingImage,
    contact: assistantLyingImage,
  }[activeSection] ?? assistantStandingImage;
  const triggerAssistantReaction = (event) => {
    if ("repeat" in event && event.repeat) return;

    event.currentTarget
      .querySelectorAll(".assistant-pose")
      .forEach((pose) => {
        pose.classList.remove("is-reacting");
        void pose.offsetWidth;
        pose.classList.add("is-reacting");
      });
  };
  const handleAssistantKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      triggerAssistantReaction(event);
    }
  };
  const clearAssistantReaction = (event) => {
    event.currentTarget.classList.remove("is-reacting");
  };

  return (
    <div
      className={`portfolio-assistant assistant-${activeSection} drawer-${drawerSide}${isOpen ? " is-open" : ""}`}
    >
      <button
        className="assistant-scrim"
        type="button"
        aria-label="Close portfolio assistant"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
      />

      <aside
        className="assistant-drawer"
        aria-label="Portfolio assistant"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="assistant-drawer-header">
          <div>
            <span>Harry's assistant</span>
            <strong>Portfolio guide</strong>
          </div>
          <button
            className="assistant-close"
            type="button"
            aria-label="Close portfolio assistant"
            tabIndex={isOpen ? 0 : -1}
            onClick={onClose}
          >
            <span />
            <span />
          </button>
        </div>

          <div className="assistant-chat-log">
            <span className="assistant-chat-status" aria-hidden="true" />
            <p className="assistant-message" aria-live="polite">
              {message}
            </p>
          </div>

        <div className="assistant-prompts" aria-label="Suggested questions">
          {assistantPrompts.map((prompt) => (
            <button
              type="button"
              key={prompt.id}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => onPrompt(prompt)}
            >
              {prompt.label}
            </button>
          ))}
          </div>

          <div className="assistant-future-input" aria-hidden="true">
            <span>Ask me anything</span>
            <i>LLM later</i>
          </div>
      </aside>

      <button
        className="assistant-placeholder"
        type="button"
        aria-label={isOpen ? "Close portfolio assistant" : "Open portfolio assistant"}
        aria-expanded={isOpen}
        onPointerDown={triggerAssistantReaction}
        onKeyDown={handleAssistantKeyDown}
        onClick={onToggle}
      >
        <img
          className="assistant-pose assistant-pose-desktop"
          src={assistantImage}
          alt=""
          aria-hidden="true"
          onAnimationEnd={clearAssistantReaction}
        />
        <img
          className="assistant-pose assistant-pose-mobile"
          src={assistantStandingImage}
          alt=""
          aria-hidden="true"
          onAnimationEnd={clearAssistantReaction}
        />
      </button>
    </div>
  );
}

function normalizeMusicText(value = "") {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/feat\.?|featuring|remix|ver\.?/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function selectBestMusicResult(results, song) {
  const expectedTitle = normalizeMusicText(song.previewTitle ?? song.title);
  const expectedArtist = normalizeMusicText(song.artist);

  const bestMatch = results
    .filter((result) => result.previewUrl)
    .map((result) => {
      const title = normalizeMusicText(result.trackName);
      const artist = normalizeMusicText(result.artistName);
      let score = 0;

      if (title === expectedTitle) score += 12;
      else if (title.includes(expectedTitle) || expectedTitle.includes(title)) score += 7;

      if (artist === expectedArtist) score += 8;
      else if (
        artist.includes(expectedArtist) ||
        expectedArtist.includes(artist) ||
        expectedArtist
          .split(" ")
          .some((part) => part.length > 2 && artist.includes(part))
      ) {
        score += 4;
      }

      return { result, score };
    })
    .sort((first, second) => second.score - first.score)[0];

  return bestMatch?.score >= 4 ? bestMatch.result : undefined;
}

function requestMusicPreviewWithJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `__portfolioMusicPreview${Date.now()}${Math.random()
      .toString(16)
      .slice(2)}`;
    const script = document.createElement("script");
    const cleanup = () => {
      window.clearTimeout(timeout);
      script.remove();
      delete window[callbackName];
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Preview search timed out."));
    }, 8000);

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("Preview search failed."));
    };
    script.src = `${url}&callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

async function findMusicPreview(song) {
  const query = encodeURIComponent(
    `${song.previewTitle ?? song.title} ${song.artist}`,
  );
  const url = `https://itunes.apple.com/search?term=${query}&country=CA&media=music&entity=song&limit=8`;
  const data = await requestMusicPreviewWithJsonp(url);

  const match = selectBestMusicResult(data.results ?? [], song);
  if (!match) throw new Error("No preview is available for this track.");

  return {
    previewUrl: match.previewUrl,
    trackUrl: song.appleHref ?? match.trackViewUrl,
  };
}

function formatPreviewTime(value) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function MusicLibrary() {
  const audioRef = useRef(null);
  const requestIdRef = useRef(0);
  const [preview, setPreview] = useState({
    status: "idle",
    song: null,
    trackUrl: null,
    embedUrl: null,
    message: "Choose a track to hear a short preview.",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);

  useEffect(
    () => () => {
      requestIdRef.current += 1;
      audioRef.current?.pause();
    },
    [],
  );

  const togglePreview = async (song) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (preview.song?.id === song.id && preview.status === "ready") {
      if (audio.paused) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      } else {
        audio.pause();
        setIsPlaying(false);
      }
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setCurrentTime(0);
    setDuration(30);
    setIsPlaying(false);

    if (song.previewUrl) {
      audio.src = song.previewUrl;
      audio.load();
      setPreview({
        status: "ready",
        song,
        trackUrl: song.href,
        embedUrl: null,
        message: "30-second preview",
      });

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    if (song.embedUrl || song.bilibiliBvid) {
      setPreview({
        status: "embedded",
        song,
        trackUrl: song.href,
        embedUrl:
          song.embedUrl ??
          `https://player.bilibili.com/player.html?bvid=${song.bilibiliBvid}&page=1&high_quality=1&danmaku=0&autoplay=0`,
        message: `${song.sourceLabel ?? "Embedded"} preview`,
      });
      return;
    }

    setPreview({
      status: "loading",
      song,
      trackUrl: null,
      embedUrl: null,
      message: "Finding a preview...",
    });

    try {
      const result = await findMusicPreview(song);
      if (requestId !== requestIdRef.current) return;

      audio.src = result.previewUrl;
      audio.load();
      setPreview({
        status: "ready",
        song,
        trackUrl: result.trackUrl,
        embedUrl: null,
        message: "30-second preview",
      });

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setPreview({
        status: "error",
        song,
        trackUrl: null,
        embedUrl: null,
        message: error.message || "Preview unavailable.",
      });
    }
  };

  const seekPreview = (event) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(event.target.value);
    setCurrentTime(audio.currentTime);
  };

  return (
    <div className="music-library">
      <audio
        ref={audioRef}
        preload="none"
        onDurationChange={(event) => {
          const nextDuration = event.currentTarget.duration;
          if (Number.isFinite(nextDuration)) setDuration(nextDuration);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      <div className="music-groups" aria-label="Harry's music recommendations">
        {musicGroups.map((group, groupIndex) => (
          <section
            className="music-group"
            key={group.id}
            style={{ "--music-group-index": groupIndex }}
          >
            <header>
              <span>{String(groupIndex + 1).padStart(2, "0")}</span>
              <div>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
            </header>
            <div className="music-group-tracks">
              {group.songs.map((song, trackIndex) => {
                const isActive = preview.song?.id === song.id;
                const isLoading = isActive && preview.status === "loading";

                return (
                  <article
                    className={`music-track${isActive ? " is-active" : ""}`}
                    key={song.id}
                    style={{ "--track-index": trackIndex }}
                  >
                    <button
                      className={`music-track-preview${song.cover ? " has-cover" : ""}`}
                      type="button"
                      onClick={() => togglePreview(song)}
                      aria-label={`${isActive && isPlaying ? "Pause" : "Preview"} ${song.title} by ${song.artist}`}
                    >
                      {song.cover && <img src={song.cover} alt="" />}
                      <span aria-hidden="true">
                        {isLoading ? "..." : isActive && isPlaying ? "Ⅱ" : "▶"}
                      </span>
                    </button>
                    <span className="music-track-copy">
                      <strong>{song.title}</strong>
                      <small>{song.artist}</small>
                    </span>
                    <a
                      className="music-track-link"
                      href={song.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${song.title} by ${song.artist} on ${song.sourceLabel ?? (song.appleHref ? "Apple Music" : "Spotify")}`}
                      title={`Open on ${song.sourceLabel ?? (song.appleHref ? "Apple Music" : "Spotify")}`}
                    >
                      ↗
                    </a>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className={`music-preview-dock is-${preview.status}`} aria-live="polite">
        {preview.status === "embedded" ? (
          <div className="music-preview-embed">
            <iframe
              src={preview.embedUrl}
              title={`${preview.song.title} ${preview.song.sourceLabel ?? "embedded"} preview`}
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <button
            className={`music-preview-toggle${preview.song?.cover ? " has-cover" : ""}`}
            type="button"
            onClick={() => preview.song && togglePreview(preview.song)}
            disabled={!preview.song || preview.status === "loading" || preview.status === "error"}
            aria-label={isPlaying ? "Pause preview" : "Play preview"}
          >
            {preview.song?.cover && <img src={preview.song.cover} alt="" />}
            <span aria-hidden="true">
              {preview.status === "loading" ? "..." : isPlaying ? "Ⅱ" : "▶"}
            </span>
          </button>
        )}
        <div className="music-preview-copy">
          <span>{preview.message}</span>
          <strong>{preview.song?.title ?? "Preview a track"}</strong>
          <small>{preview.song?.artist ?? "Play without leaving this page"}</small>
        </div>
        {preview.status !== "embedded" && (
          <div className="music-preview-progress">
            <input
              type="range"
              min="0"
              max={Math.max(duration, 1)}
              step="0.1"
              value={Math.min(currentTime, duration)}
              onChange={seekPreview}
              disabled={preview.status !== "ready"}
              aria-label="Preview position"
            />
            <time>{formatPreviewTime(currentTime)}</time>
            <span>/</span>
            <time>{formatPreviewTime(duration)}</time>
          </div>
        )}
        <div className="music-preview-actions">
          {preview.trackUrl && (
            <a href={preview.trackUrl} target="_blank" rel="noreferrer">
              Full track ↗
            </a>
          )}
          <small>
            {preview.status === "embedded"
              ? `Preview hosted by ${preview.song?.sourceLabel ?? "the source"}.`
              : "Preview provided courtesy of iTunes."}
          </small>
        </div>
      </div>
    </div>
  );
}

function App() {
  const siteRef = useRef(null);
  const photoLightboxCloseRef = useRef(null);
  const openingTimelineRef = useRef(null);
  const otherOpenTimerRef = useRef(null);
  const otherFinishTimerRef = useRef(null);
  const otherStageRef = useRef(null);
  const videoPlayerCloseRef = useRef(null);
  const experienceTimelineRef = useRef(null);
  const experienceScrollFrameRef = useRef(null);
  const experienceSnapTimerRef = useRef(null);
  const experienceTransitionTimerRef = useRef(null);
  const sectionPointerStartRef = useRef(null);
  const activeExperienceIndexRef = useRef(0);
  const previousOtherNavHiddenRef = useRef(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(getInitialSection);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState(
    "Choose a question to explore Harry's work and background.",
  );
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0);
  const [displayedExperienceIndex, setDisplayedExperienceIndex] = useState(0);
  const [experienceTransitionDirection, setExperienceTransitionDirection] =
    useState(1);
  const [experienceTransitionPhase, setExperienceTransitionPhase] =
    useState("idle");
  const [accentMode, setAccentMode] = useState(() => {
    if (typeof window === "undefined") return "ember";

    return window.localStorage.getItem("portfolio-accent-mode") === "teal"
      ? "teal"
      : "ember";
  });
  const [introStarted, setIntroStarted] = useState(false);
  const [introDecrypted, setIntroDecrypted] = useState(false);
  const [openingOtherId, setOpeningOtherId] = useState(null);
  const [activeOtherId, setActiveOtherId] = useState(null);
  const [otherPhase, setOtherPhase] = useState("idle");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const currentFocus = focusItems[focusIndex];
  const selectedOtherId = activeOtherId || openingOtherId;
  const activeOther = otherItems.find((item) => item.id === selectedOtherId);
  const isOtherDetailVisible = Boolean(activeOther && otherPhase !== "idle");
  const isOtherNavHidden =
    otherPhase !== "idle" && otherPhase !== "closing";
  const isTealAccent = accentMode === "teal";
  const isPhotoLightboxOpen = selectedPhotoIndex !== null;
  const selectedPhoto = isPhotoLightboxOpen
    ? photoJournal[selectedPhotoIndex]
    : null;
  const isVideoPlayerOpen = selectedVideoIndex !== null;
  const selectedVideo = isVideoPlayerOpen
    ? videoCollection[selectedVideoIndex]
    : null;
  const isMediaViewerOpen = isPhotoLightboxOpen || isVideoPlayerOpen;
  const timelineExperiences = experiences;
  const displayedExperience =
    timelineExperiences[displayedExperienceIndex] ??
    timelineExperiences[0];
  const timelineItems = timelineExperiences.map((item, index) => ({
    item,
    index,
  }));
  const visibleTimelineItems = timelineItems;
  const toggleAccentMode = () => {
    setAccentMode((mode) => (mode === "teal" ? "ember" : "teal"));
  };

  useEffect(() => {
    if (!isPhotoLightboxOpen) return undefined;

    photoLightboxCloseRef.current?.focus();

    const handlePhotoKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedPhotoIndex(null);
      } else if (event.key === "ArrowRight") {
        setSelectedPhotoIndex((index) => (index + 1) % photoJournal.length);
      } else if (event.key === "ArrowLeft") {
        setSelectedPhotoIndex(
          (index) => (index - 1 + photoJournal.length) % photoJournal.length,
        );
      }
    };

    window.addEventListener("keydown", handlePhotoKeyDown);
    return () => window.removeEventListener("keydown", handlePhotoKeyDown);
  }, [isPhotoLightboxOpen]);

  useEffect(() => {
    if (!isVideoPlayerOpen) return undefined;

    videoPlayerCloseRef.current?.focus();

    const handleVideoKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedVideoIndex(null);
      }
    };

    window.addEventListener("keydown", handleVideoKeyDown);
    return () => window.removeEventListener("keydown", handleVideoKeyDown);
  }, [isVideoPlayerOpen]);

  const navigateToSection = useCallback(
    (sectionId, { updateHistory = true } = {}) => {
      if (!sectionOrder.includes(sectionId)) return;

      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
      setIsAssistantOpen(false);

      if (updateHistory) {
        window.history.pushState(null, "", `#${sectionId}`);
      }

      window.requestAnimationFrame(() => {
        document
          .querySelector(`[data-section-id="${sectionId}"]`)
          ?.scrollTo({ top: 0, behavior: "auto" });
      });
    },
    [],
  );

  const getSceneState = (sectionId) => {
    const sectionIndex = sectionOrder.indexOf(sectionId);
    const activeIndex = sectionOrder.indexOf(activeSection);

    if (sectionIndex === activeIndex) return "active";
    return sectionIndex < activeIndex ? "before" : "after";
  };

  const handleSectionLink = (event, sectionId) => {
    event.preventDefault();
    navigateToSection(sectionId);
  };

  const moveBySection = useCallback(
    (direction) => {
      const activeIndex = sectionOrder.indexOf(activeSection);
      const nextIndex = Math.min(
        sectionOrder.length - 1,
        Math.max(0, activeIndex + direction),
      );

      if (nextIndex !== activeIndex) {
        navigateToSection(sectionOrder[nextIndex]);
      }
    },
    [activeSection, navigateToSection],
  );

  const handleScenePointerDown = (event) => {
    if (event.pointerType === "mouse") return;

    sectionPointerStartRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handleScenePointerUp = (event) => {
    const start = sectionPointerStartRef.current;
    sectionPointerStartRef.current = null;

    if (!start || start.id !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaX) < 64 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) {
      return;
    }

    moveBySection(deltaX < 0 ? 1 : -1);
  };

  const selectExperience = (index) => {
    if (
      index === activeExperienceIndex ||
      experienceTransitionPhase !== "idle"
    ) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.clearTimeout(experienceTransitionTimerRef.current);
    setActiveExperienceIndex(index);
    setExperienceTransitionDirection(
      index > activeExperienceIndex ? 1 : -1,
    );

    if (prefersReducedMotion) {
      setDisplayedExperienceIndex(index);
      setExperienceTransitionPhase("idle");
      return;
    }

    setExperienceTransitionPhase("leaving");
    experienceTransitionTimerRef.current = window.setTimeout(() => {
      setDisplayedExperienceIndex(index);
      setExperienceTransitionPhase("entering");

      experienceTransitionTimerRef.current = window.setTimeout(() => {
        setExperienceTransitionPhase("idle");
      }, 430);
    }, 230);
  };

  useEffect(
    () => () => window.clearTimeout(experienceTransitionTimerRef.current),
    [],
  );

  useEffect(() => {
    const centerActiveExperience = () => {
      if (activeSection !== "experience" || window.innerWidth > 820) return;

      const timeline = experienceTimelineRef.current;
      const activeItem = timeline?.querySelector(
        ".experience-vertical-item.is-active",
      );

      if (!timeline || !activeItem) return;

      timeline.scrollTo({
        left:
          activeItem.offsetLeft -
          (timeline.clientWidth - activeItem.clientWidth) / 2,
        behavior: "smooth",
      });
    };

    const frameId = window.requestAnimationFrame(centerActiveExperience);
    window.addEventListener("resize", centerActiveExperience);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", centerActiveExperience);
    };
  }, [activeExperienceIndex, activeSection]);

  useLayoutEffect(() => {
    const root = siteRef.current;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!root || prefersReducedMotion) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);
    const pageScroller = document.body;
    const syncScrollTriggers = () => ScrollTrigger.update();

    pageScroller.addEventListener("scroll", syncScrollTriggers, {
      passive: true,
    });

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
      gsap.set(".hero-title", {
        autoAlpha: 0,
        x: -220,
        scaleX: 0.68,
        scaleY: 1.12,
        transformOrigin: "left center",
      });
      gsap.set(".hero-title-word", {
        autoAlpha: 1,
        transformOrigin: "50% 50%",
      });
      gsap.set(".hero-title-word-inner", {
        display: "inline-block",
        scaleX: 0.82,
        scaleY: 1.08,
      });
      gsap.set(".hero-title-letter", { autoAlpha: 1, yPercent: 0 });
      gsap.set(".hero-status-block > *", {
        autoAlpha: 0,
        x: -44,
        scaleX: 0.94,
      });
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

    }, root);

    return () => {
      openingTimelineRef.current = null;
      pageScroller.removeEventListener("scroll", syncScrollTriggers);
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
    document.documentElement.dataset.activeSection = activeSection;
    setIsScrolled(activeSection !== "home");

    const activeScene = document.querySelector(
      `[data-section-id="${activeSection}"]`,
    );
    activeScene?.focus({ preventScroll: true });
  }, [activeSection]);

  useEffect(() => {
    const handleHistoryChange = () => {
      navigateToSection(getInitialSection(), { updateHistory: false });
    };

    window.addEventListener("hashchange", handleHistoryChange);
    window.addEventListener("popstate", handleHistoryChange);

    return () => {
      window.removeEventListener("hashchange", handleHistoryChange);
      window.removeEventListener("popstate", handleHistoryChange);
    };
  }, [navigateToSection]);

  useEffect(() => {
    const handleSectionKeyDown = (event) => {
      if (
        isAssistantOpen ||
        isMobileMenuOpen ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(
          event.target?.tagName,
        )
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveBySection(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveBySection(-1);
      }
    };

    window.addEventListener("keydown", handleSectionKeyDown);
    return () => window.removeEventListener("keydown", handleSectionKeyDown);
  }, [isAssistantOpen, isMobileMenuOpen, moveBySection]);

  useEffect(() => {
    if (!isAssistantOpen) return undefined;

    const handleAssistantEscape = (event) => {
      if (event.key === "Escape") {
        setIsAssistantOpen(false);
      }
    };

    window.addEventListener("keydown", handleAssistantEscape);
    return () => window.removeEventListener("keydown", handleAssistantEscape);
  }, [isAssistantOpen]);

  useEffect(() => {
    activeExperienceIndexRef.current = activeExperienceIndex;
  }, [activeExperienceIndex]);

  useEffect(() => {
    const root = siteRef.current;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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

  useEffect(
    () => () => {
      if (otherOpenTimerRef.current) {
        window.clearTimeout(otherOpenTimerRef.current);
      }

      if (otherFinishTimerRef.current) {
        window.clearTimeout(otherFinishTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (introStarted) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const introStage = siteRef.current?.querySelector(".intro-stage");

    if (prefersReducedMotion || !introStage) {
      return undefined;
    }

    const idleTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3.8 });
    idleTimeline
      .to(introStage, {
        y: -5,
        scaleX: 1.018,
        scaleY: 0.988,
        duration: 0.85,
        ease: "power2.inOut",
      })
      .to(introStage, {
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.95,
        ease: "power3.out",
      });

    const moveX = gsap.quickTo(introStage, "x", {
      duration: 0.48,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(introStage, "y", {
      duration: 0.48,
      ease: "power3.out",
    });
    const scaleX = gsap.quickTo(introStage, "scaleX", {
      duration: 0.48,
      ease: "power3.out",
    });
    const scaleY = gsap.quickTo(introStage, "scaleY", {
      duration: 0.48,
      ease: "power3.out",
    });
    const rotate = gsap.quickTo(introStage, "rotation", {
      duration: 0.48,
      ease: "power3.out",
    });

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

  const closeOtherDetail = () => {
    if (!selectedOtherId || otherPhase === "idle" || otherPhase === "closing") {
      return;
    }

    setSelectedPhotoIndex(null);
    setSelectedVideoIndex(null);

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
    }, 780);
  };

  const openOtherDetail = (itemId) => {
    if (
      otherPhase !== "idle" ||
      activeOtherId ||
      openingOtherId ||
      otherOpenTimerRef.current
    ) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const stage = otherStageRef.current;
    const startTop = stage?.getBoundingClientRect().top ?? 0;
    const startOffsetTop = stage?.offsetTop ?? 0;

    flushSync(() => {
      setActiveOtherId(null);
      setOpeningOtherId(itemId);
      setOtherPhase(prefersReducedMotion ? "open" : "staging");
    });

    if (prefersReducedMotion) {
      setActiveOtherId(itemId);
      setOpeningOtherId(null);
      return;
    }

    const endTop = stage?.getBoundingClientRect().top ?? startTop;
    const endOffsetTop = stage?.offsetTop ?? startOffsetTop;
    const stageOffset = Math.max(
      0,
      startTop - endTop,
      startOffsetTop - endOffsetTop,
    );
    stage?.style.setProperty(
      "--other-stage-offset",
      `${stageOffset}px`,
    );

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setOtherPhase("opening");

        otherFinishTimerRef.current = window.setTimeout(() => {
          setActiveOtherId(itemId);
          setOpeningOtherId(null);
          setOtherPhase("open");
          otherFinishTimerRef.current = null;
        }, 740);
      });
    });
  };

  const startIntro = () => {
    if (introStarted) return;
    setIntroStarted(true);
    gsap.to(".intro-prompt", {
      autoAlpha: 0,
      y: 10,
      duration: 0.16,
      ease: "power2.out",
    });
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
      <header
        className={`nav-shell${isScrolled ? " is-scrolled" : ""}${isOtherNavHidden ? " is-hidden" : ""}`}
        aria-label="Primary navigation"
      >
        <a
          className="brand-mark magic-border"
          href="#home"
          aria-label="Hong Ye Wu home"
          aria-current={activeSection === "home" ? "page" : undefined}
          onClick={(event) => handleSectionLink(event, "home")}
        >
          HW
        </a>
        <nav className="nav-links">
          {navItems.map((item) => (
            <a
              className={`magic-border${activeSection === item.id ? " is-active" : ""}`}
              key={item.id}
              href={item.href}
              aria-current={activeSection === item.id ? "page" : undefined}
              onClick={(event) => handleSectionLink(event, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          className={`mobile-menu-button magic-border${isMobileMenuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={
            isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
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
        aria-hidden={!isMobileMenuOpen}
        tabIndex={isMobileMenuOpen ? 0 : -1}
        onClick={closeMobileMenu}
      />

      <aside
        className={`mobile-nav-panel${isMobileMenuOpen ? " is-open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
      >
        <nav aria-label="Mobile navigation">
          {mobileNavItems.map((item) => (
            <a
              className={`magic-border${activeSection === item.id ? " is-active" : ""}`}
              key={item.id}
              href={item.href}
              aria-current={activeSection === item.id ? "page" : undefined}
              onClick={(event) => handleSectionLink(event, item.id)}
            >
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

      <main
        className="app-scenes"
        onPointerDown={handleScenePointerDown}
        onPointerUp={handleScenePointerUp}
        onPointerCancel={() => {
          sectionPointerStartRef.current = null;
        }}
      >
        <section
          className="hero-section app-scene"
          id="home"
          data-section-id="home"
          data-scene-state={getSceneState("home")}
          tabIndex={-1}
          aria-hidden={activeSection !== "home"}
          aria-labelledby="hero-title"
        >
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
                <p className="hero-trait-line">
                  Fast Learner & creative thinker
                </p>
                <div className="hero-actions">
                  <a
                    className="magic-border"
                    href="#projects"
                    onClick={(event) => handleSectionLink(event, "projects")}
                  >
                    View Projects
                  </a>
                  <a
                    className="magic-border"
                    href="#contact"
                    onClick={(event) => handleSectionLink(event, "contact")}
                  >
                    Contact Me
                  </a>
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

        <section
          className="profile-section experience-section page-panel app-scene"
          id="experience"
          data-section-id="experience"
          data-scene-state={getSceneState("experience")}
          tabIndex={-1}
          aria-hidden={activeSection !== "experience"}
          aria-labelledby="experience-title"
        >
          <div className="experience-showcase content-shell">
            <div className="experience-display-heading">
              <p className="experience-eyebrow">My Journey</p>
              <h2 id="experience-title">Experience</h2>
              <p className="experience-lede">
                Web systems, automation, and robotics work shaped through
                practical delivery.
              </p>
            </div>

            <div
              className={`experience-vertical-layout${
                experienceTransitionPhase !== "idle" ? " is-switching" : ""
              }`}
            >
              <div
                className="experience-vertical-timeline"
                ref={experienceTimelineRef}
                aria-label="Experience timeline"
              >
                {visibleTimelineItems.map(({ item, index }) => {
                  const isActive = index === activeExperienceIndex;
                  const startDate = getExperienceStartDate(item.date);

                  return (
                    <button
                      className={`experience-vertical-item${isActive ? " is-active" : ""}`}
                      type="button"
                      key={`${item.id}-timeline`}
                      aria-current={isActive ? "step" : undefined}
                      onClick={() => selectExperience(index)}
                    >
                      <span className="experience-vertical-marker" aria-hidden="true" />
                      <span className="experience-vertical-icon" aria-hidden="true">
                        <img src={getTimelineIconSource(item)} alt="" />
                      </span>
                      <span className="experience-vertical-copy">
                        <span className="experience-vertical-year">
                          {startDate.year}
                        </span>
                        <strong>{getTimelineCompanyLabel(item)}</strong>
                        <span>{getTimelineRoleLines(item)[0]}</span>
                        <small>{formatTimelinePeriod(item.date)}</small>
                      </span>
                    </button>
                  );
                })}
              </div>

              <ExperienceDetails
                key={displayedExperience.id}
                experience={displayedExperience}
                transitionDirection={experienceTransitionDirection}
                transitionPhase={experienceTransitionPhase}
              />

              <div className="experience-assistant-reserve" aria-hidden="true" />
            </div>
          </div>
        </section>
        <section
          className="projects-section page-panel app-scene"
          id="projects"
          data-section-id="projects"
          data-scene-state={getSceneState("projects")}
          tabIndex={-1}
          aria-hidden={activeSection !== "projects"}
          aria-labelledby="projects-title"
          >
            <div className="content-shell">
              <div className="projects-header-row">
                <div className="projects-display-heading">
                  <p className="projects-eyebrow">Featured Work</p>
                  <h2 id="projects-title">Projects</h2>
                  <p className="projects-lede">
                    Selected systems, interfaces, and AI workflows.
                  </p>
                </div>
                <div className="projects-header-note" aria-label="Project overview">
                  <span>03 active builds</span>
                  <p>Robotics, applied AI, and web systems.</p>
                </div>
              </div>

            <div className="project-group">
              <div className="project-group-heading">
                <span>Currently Working On</span>
              </div>
              <div className="current-project-layout">
                {currentProjects.map((project, index) => (
                  <ProjectCard
                    project={project}
                    index={index}
                    variant="current"
                    key={project.title}
                  />
                ))}
              </div>
            </div>

            <div className="project-group">
              <div className="project-group-heading">
                <span>Previous Projects</span>
              </div>
              <div className="featured-grid featured-grid-compact">
                {previousProjects.map((project, index) => (
                  <ProjectCard
                    project={project}
                    index={index + currentProjects.length}
                    key={project.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className={`other-section page-panel app-scene other-phase-${otherPhase}${isOtherDetailVisible ? " is-detail-open" : ""}`}
          id="other"
          data-section-id="other"
          data-scene-state={getSceneState("other")}
          tabIndex={-1}
          aria-hidden={activeSection !== "other"}
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
                    {isOtherDetailVisible &&
                      item.id === selectedOtherId && (
                        <button
                          className="other-return-button"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            closeOtherDetail();
                          }}
                          aria-label={`Return from ${item.title}`}
                        >
                          Back
                        </button>
                      )}
                  </article>
                ))}
              </div>

              {isOtherDetailVisible && activeOther && (
                  <div
                    className={`other-detail-view is-${otherPhase}`}
                    aria-live="polite"
                  >
                    <div
                      className={`other-detail-panel other-detail-panel-${activeOther.id}`}
                    >
                      <div
                        className="other-detail-bar"
                        aria-label={`${activeOther.title} detail controls`}
                      >
                        <span>{activeOther.detailLabel}</span>
                        <span>{activeOther.detailMeta}</span>
                      </div>
                      <div className="other-detail-copy">
                        <span>{activeOther.title}</span>
                        <strong>{activeOther.text}</strong>
                        <p>{activeOther.detailBody}</p>
                      </div>
                      {otherPhase !== "staging" && activeOther.id === "music" && (
                        <MusicLibrary />
                      )}
                      {otherPhase !== "staging" && activeOther.id === "videos" && (
                        <div
                          className="video-collection"
                          aria-label="Harry's Bilibili video collection"
                        >
                          {videoCollection.map((video, index) => (
                            <button
                              className="video-card"
                              type="button"
                              key={video.id}
                              style={{ "--video-index": index }}
                              aria-label={`Play ${video.title}`}
                              onClick={() => setSelectedVideoIndex(index)}
                            >
                              <img src={video.cover} alt="" loading="lazy" />
                              <span className="video-card-shade" aria-hidden="true" />
                              <span className="video-card-play" aria-hidden="true">
                                <span />
                              </span>
                              <span className="video-card-copy">
                                <strong>{video.title}</strong>
                              </span>
                              <span className="video-card-link" aria-hidden="true">
                                Bilibili ↗
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      {otherPhase !== "staging" && activeOther.id === "gaming" && (
                        <div
                          className="gaming-library"
                          aria-label="Harry's favorite games by category"
                        >
                          {gamingGroups.map((group, groupIndex) => (
                            <section
                              className="gaming-group"
                              key={group.id}
                              style={{ "--group-index": groupIndex }}
                              aria-labelledby={`gaming-group-${group.id}`}
                            >
                              <header>
                                <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                                <h3 id={`gaming-group-${group.id}`}>{group.title}</h3>
                                <small>{group.games.length}</small>
                              </header>
                              <ol>
                                {group.games.map((game, gameIndex) => (
                                  <li key={game.title}>
                                    <a
                                      href={game.href}
                                      target="_blank"
                                      rel="noreferrer"
                                      aria-label={`Open ${game.title} store page`}
                                    >
                                      <img src={game.cover} alt="" loading="lazy" />
                                      <strong>{game.title}</strong>
                                      <span>
                                        {String(gameIndex + 1).padStart(2, "0")}
                                      </span>
                                    </a>
                                  </li>
                                ))}
                              </ol>
                            </section>
                          ))}
                        </div>
                      )}
                      {otherPhase !== "staging" &&
                        activeOther.id !== "music" &&
                        activeOther.id !== "videos" &&
                        activeOther.id !== "gaming" && (
                        <Masonry
                          key={activeOther.id}
                          items={otherDetailItems[activeOther.id]}
                          ease="power2.out"
                          duration={0.7}
                          stagger={0.045}
                          initialDelay={0.2}
                          animateFrom="bottom"
                          scaleOnHover={activeOther.id !== "photos"}
                          hoverScale={0.985}
                          blurToFocus
                          fitToContainer={activeOther.id !== "photos"}
                          maxColumns={activeOther.id === "photos" ? 4 : 3}
                          minItemHeight={activeOther.id === "photos" ? 56 : 132}
                          itemGap={activeOther.id === "photos" ? 10 : 14}
                          showCopy={activeOther.id !== "photos"}
                          variant={activeOther.id}
                          waitForImages={activeOther.id !== "photos"}
                          onItemClick={
                            activeOther.id === "photos"
                              ? (photo) => {
                                  const photoIndex = photoJournal.findIndex(
                                    (item) => item.id === photo.id,
                                  );
                                  if (photoIndex >= 0) {
                                    setSelectedPhotoIndex(photoIndex);
                                  }
                                }
                              : undefined
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
          {selectedPhoto && (
            <div
              className="photo-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedPhoto.title} enlarged photo`}
            >
              <button
                className="photo-lightbox-backdrop"
                type="button"
                aria-label="Close enlarged photo"
                onClick={() => setSelectedPhotoIndex(null)}
              />
              <figure className="photo-lightbox-frame">
                <header>
                  <span>
                    {String(selectedPhotoIndex + 1).padStart(2, "0")} /{" "}
                    {String(photoJournal.length).padStart(2, "0")}
                  </span>
                  <strong>{selectedPhoto.title}</strong>
                  <button
                    ref={photoLightboxCloseRef}
                    type="button"
                    aria-label="Close enlarged photo"
                    onClick={() => setSelectedPhotoIndex(null)}
                  >
                    Close
                  </button>
                </header>
                <div
                  className="photo-lightbox-stage"
                  onClick={(event) => {
                    if (event.target === event.currentTarget) {
                      setSelectedPhotoIndex(null);
                    }
                  }}
                >
                  <button
                    className="photo-lightbox-control is-previous"
                    type="button"
                    aria-label="Previous photo"
                    onClick={() =>
                      setSelectedPhotoIndex(
                        (index) =>
                          (index - 1 + photoJournal.length) % photoJournal.length,
                      )
                    }
                  >
                    ←
                  </button>
                  <img
                    key={selectedPhoto.id}
                    src={selectedPhoto.href}
                    alt={selectedPhoto.alt}
                  />
                  <button
                    className="photo-lightbox-control is-next"
                    type="button"
                    aria-label="Next photo"
                    onClick={() =>
                      setSelectedPhotoIndex(
                        (index) => (index + 1) % photoJournal.length,
                      )
                    }
                  >
                    →
                  </button>
                </div>
                <figcaption>Photographed by Hong Ye Wu.</figcaption>
              </figure>
            </div>
          )}
          {selectedVideo && (
            <div
              className="video-player-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedVideo.title} video player`}
            >
              <button
                className="video-player-backdrop"
                type="button"
                aria-label="Close video player"
                onClick={() => setSelectedVideoIndex(null)}
              />
              <div className="video-player-frame">
                <header>
                  <strong>{selectedVideo.title}</strong>
                  <div>
                    <a
                      href={selectedVideo.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open on Bilibili
                    </a>
                    <button
                      ref={videoPlayerCloseRef}
                      type="button"
                      aria-label="Close video player"
                      onClick={() => setSelectedVideoIndex(null)}
                    >
                      Close
                    </button>
                  </div>
                </header>
                <div className="video-player-stage">
                  <iframe
                    key={selectedVideo.id}
                    src={selectedVideo.embedUrl}
                    title={selectedVideo.title}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}
        </section>
        <section
          className="footer-section app-scene"
          id="contact"
          data-section-id="contact"
          data-scene-state={getSceneState("contact")}
          tabIndex={-1}
          aria-hidden={activeSection !== "contact"}
          aria-labelledby="contact-title"
        >
          <div className="footer-inner content-shell">
            <p className="section-kicker">Contact</p>
            <h2 id="contact-title">
              Let's build something precise, useful, and memorable.
            </h2>
            <div className="footer-links">
              {contactLinks.map((link) => (
                <a
                  className="magic-border"
                  href={link.href}
                  key={link.label}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
        </main>

        {introDecrypted && !isMediaViewerOpen && (
          <div
            className={`mobile-control-dock${isAssistantOpen ? " is-chat-open" : ""}`}
            aria-hidden="true"
          />
        )}

        {introDecrypted && !isMediaViewerOpen && (
          <PortfolioAssistant
          activeSection={activeSection}
          isOpen={isAssistantOpen}
          message={assistantMessage}
          onClose={() => setIsAssistantOpen(false)}
          onToggle={() => setIsAssistantOpen((isOpen) => !isOpen)}
          onPrompt={(prompt) => setAssistantMessage(prompt.response)}
        />
      )}

        {introDecrypted && (
          <div
            className={`section-navigation${isOtherNavHidden ? " is-hidden" : ""}${isAssistantOpen ? " is-chat-open" : ""}`}
            aria-label="Section navigation"
          >
          <button
            type="button"
            aria-label="Previous section"
            disabled={activeSection === sectionOrder[0]}
            onClick={() => moveBySection(-1)}
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <span>
            {String(sectionOrder.indexOf(activeSection) + 1).padStart(2, "0")}
            <i>/</i>
            {String(sectionOrder.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label="Next section"
            disabled={activeSection === sectionOrder[sectionOrder.length - 1]}
            onClick={() => moveBySection(1)}
          >
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
