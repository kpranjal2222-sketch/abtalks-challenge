import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  Flame,
  Zap,
  Lock,
  Unlock,
  Users,
  Award,
  Terminal,
  MessageSquare
} from "lucide-react";
import "./Landing.css";

const Github = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
  </svg>
);
const Twitter = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
const Linkedin = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// 1. Interfaces for exact Type Safety
interface TimelinePhase {
  phase: string;
  duration: string;
  title: string;
  description: string;
  checklist: string[];
  stats: {
    value: string;
    label: string;
  }[];
}

interface Testimonial {
  category: string;
  name: string;
  college: string;
  quote: string;
  project: string;
  techs: string[];
  github: string;
  social: string;
  avatarChar: string;
}

// 2. Data Definitions
const TIMELINE_PHASES: TimelinePhase[] = [
  {
    phase: "Phase 1",
    duration: "Days 1–20",
    title: "Overcome the Blank Canvas",
    description: "Establish your daily coding habit. Learn to push raw code to GitHub and share your first public progress update. We help you overcome the fear of judgment and get past the 'Hello World' barrier.",
    checklist: [
      "Define your concrete 60-day project roadmap",
      "Setup automated continuous deployment pipelines",
      "Write your first public daily update summarizing your MVP structure",
      "Collaborate with active peers in Discord channels at 1:30 AM"
    ],
    stats: [
      { value: "98.4%", label: "First-week Consistency" },
      { value: "4,200+", label: "Active Late-Night Coders" }
    ]
  },
  {
    phase: "Phase 2",
    duration: "Days 21–45",
    title: "Full-Stack Velocity",
    description: "Deep-dive into advanced backend architectures, database schemas, and clean frontend components. Your public proof-of-work transitions from elementary scripts to production-ready stacks.",
    checklist: [
      "Implement multi-table SQL/NoSQL schemas with prisma/indexing",
      "Establish secure JWT-based auth and Redis caching models",
      "Manage background jobs, socket connections, and media uploads",
      "Participate in mid-cohort architecture reviews and peer refactors"
    ],
    stats: [
      { value: "1.8K+", label: "Daily DB Migrations" },
      { value: "3.2 hrs", label: "Avg Night Focus Time" }
    ]
  },
  {
    phase: "Phase 3",
    duration: "Days 46–60",
    title: "Production Polish & Demo Day",
    description: "Fine-tune page loading speeds, Dockerize services, write rigorous tests, and finalize your documentation. Your profile joins our exclusive public student directory visible to Indian startups.",
    checklist: [
      "Run extensive lighthouse and performance optimization audits",
      "Produce a 2-minute clean video walkthrough of your application",
      "Deploy live with full SSL, monitoring, and health check dashboards",
      "Pitch on Virtual Demo Day to verified tech founders and hiring managers"
    ],
    stats: [
      { value: "140+", label: "Hiring Partners" },
      { value: "₹8.4L", label: "Average Starter Package" }
    ]
  }
];

const TESTIMONIALS: Testimonial[] = [
  {
    category: "Full Stack",
    name: "Siddharth Nair",
    college: "PES University, Bengaluru",
    quote: "I used to have empty GitHub graphs and zero direction. Committing daily and sharing my work in public for 60 days got me noticed by a fast-growing US startup on Twitter. Hired as a founding backend dev before graduation!",
    project: "DevStream AI core",
    techs: ["Next.js", "PostgreSQL", "OpenAI"],
    github: "siddharth-nair",
    social: "siddharth_codes",
    avatarChar: "S"
  },
  {
    category: "Backend",
    name: "Tanvi Gupta",
    college: "DTU, Delhi",
    quote: "At 2 AM when you get stuck on database connection pool leaks, you are never debugging alone. The active late-night Discord is magic—hundreds of peers are active, reviewing code, and shipping updates right next to you.",
    project: "DistriCache Client",
    techs: ["Go", "gRPC", "Redis Cluster"],
    github: "tanvi-g",
    social: "tanvi_back_dev",
    avatarChar: "T"
  },
  {
    category: "AI & DevTools",
    name: "Aditya Vardhan",
    college: "SRM University, Chennai",
    quote: "I built and shipped 4 complete SaaS utilities during the 60 days. My LinkedIn went from 120 followers to 5,000+ following my daily design & logic breakdown posts. Startup founders literally DM'd me with custom roles.",
    project: "DocuSense Engine",
    techs: ["React", "FastAPI", "ChromaDB"],
    github: "aditya-v",
    social: "adityav_builds",
    avatarChar: "A"
  }
];

export default function Landing() {
  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Active interaction states
  const [activeTimelinePhaseIndex, setActiveTimelinePhaseIndex] = useState(0);
  const [testimonialCategory, setTestimonialCategory] = useState("All");

  // Commitment Checklist states
  const [codeEveryDay, setCodeEveryDay] = useState(false);
  const [shareInPublic, setShareInPublic] = useState(false);
  const [helpOthers, setHelpOthers] = useState(false);
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [registered, setRegistered] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  // Interactive Daily Loop states
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const [milestones, setMilestones] = useState([true, false, false]);
  const [proofUrl, setProofUrl] = useState("github.com/alex/ship-it");
  const [streakLocked, setStreakLocked] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  // Interactive Hero Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 3600; // Reset
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      h: String(h).padStart(2, "0"),
      m: String(m).padStart(2, "0"),
      s: String(s).padStart(2, "0")
    };
  };

  const handleToggleMilestone = (index: number) => {
    setMilestones((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleToggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(3600);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl.trim()) return;
    setStreakLocked(true);
    setStreakCount(1);
  };

  const handleResetProof = () => {
    setStreakLocked(false);
    setStreakCount(0);
    setProofUrl("github.com/alex/ship-it");
    setMilestones([true, false, false]);
    setTimeLeft(3600);
    setTimerRunning(false);
  };

  // Navbar scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if the enrollment form is unlocked
  const isCommitmentUnlocked = codeEveryDay && shareInPublic && helpOthers;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCommitmentUnlocked || !signUpName || !signUpEmail) return;
    
    // Simulate signup completion
    setRegistered(true);
  };

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filtered testimonials
  const filteredTestimonials = testimonialCategory === "All"
    ? TESTIMONIALS
    : TESTIMONIALS.filter(t => t.category === testimonialCategory);

  return (
    <div className="landing-page-root">
      {/* Background radial glows */}
      <div className="bg-glow bg-glow-top" />
      <div className="bg-glow bg-glow-middle" />
      <div className="bg-glow bg-glow-bottom" />

      {/* 1. Premium navigation */}
      <nav className={`premium-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="landing-container nav-wrapper">
          <a href="#" className="nav-logo-link" onClick={() => scrollToSection("hero")}>
            <div className="logo-symbol">AB</div>
            <span>abtalks<span style={{ color: "var(--accent-indigo)" }}>.challenge</span></span>
          </a>

          <div className="nav-links">
            <a href="#challenge" className="nav-item" onClick={(e) => { e.preventDefault(); scrollToSection("challenge"); }}>The Challenge</a>
            <a href="#why-public" className="nav-item" onClick={(e) => { e.preventDefault(); scrollToSection("why-public"); }}>Build In Public</a>
            <a href="#success" className="nav-item" onClick={(e) => { e.preventDefault(); scrollToSection("success"); }}>Student Stories</a>
            <a href="/dashboard" className="nav-item">Dashboard</a>
          </div>

          <div className="nav-actions">
            <a href="/dashboard" className="btn-nav-cta">
              <span className="pulse-dot" style={{ width: 8, height: 8, backgroundColor: "var(--success)", borderRadius: "50%", display: "inline-block" }}></span>
              <span>Launch Tracker</span>
            </a>
          </div>

          <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-menu-links">
              <a href="#challenge" className="mobile-menu-item" onClick={() => scrollToSection("challenge")}>The Challenge</a>
              <a href="#why-public" className="mobile-menu-item" onClick={() => scrollToSection("why-public")}>Build In Public</a>
              <a href="#success" className="mobile-menu-item" onClick={() => scrollToSection("success")}>Student Stories</a>
              <a href="/dashboard" className="mobile-menu-item">Launch Tracker</a>
            </div>
            
            <div className="mobile-menu-footer">
              <button className="btn-primary" onClick={() => scrollToSection("join")}>
                Commit To The Challenge <ArrowRight size={16} />
              </button>
              <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
                Next cohort starts tonight at 12:00 AM IST
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Section */}
      <header id="hero" className="hero-section">
        <div className="landing-container">
          <div className="hero-header">
            <motion.div 
              className="editorial-badge"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="pulse-dot" />
              <span>India's Ultimate 60-Day Late-Night Coding Sprint</span>
            </motion.div>

            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Build. Track. Prove.<br />Your 60-Day Progress.
            </motion.h1>

            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              ABTalks is a high-intensity 60-day interactive coding challenge designed to get you shipping daily. <strong style={{ color: "var(--text-primary)" }}>Build</strong> your product, <strong style={{ color: "var(--text-primary)" }}>Track</strong> your consistency with real-time analytics, and <strong style={{ color: "var(--text-primary)" }}>Prove</strong> your progress publicly to unlock exclusive career opportunities.
            </motion.p>

            <motion.div 
              className="hero-ctas"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a href="/dashboard" className="btn-primary">
                Launch Your Tracker <ArrowRight size={18} />
              </a>
              <button onClick={() => scrollToSection("challenge")} className="btn-secondary">
                Explore The Loop <Sparkles size={16} />
              </button>
            </motion.div>
          </div>

          {/* Interactive Hero Code Mockup Component */}
          <motion.div 
            className="hero-mockup-wrapper"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-mockup-header">
              <div className="mockup-dots">
                <div className="mockup-dot red" />
                <div className="mockup-dot yellow" />
                <div className="mockup-dot green" />
              </div>
            </div>

            <div className="hero-mockup-content loop-mockup-grid">
              {/* Step 1: Focus */}
              <div className="loop-step focus-step">
                <div className="loop-step-header">
                  <div className="step-number">01</div>
                  <div className="step-info">
                    <span className="step-label">MIDNIGHT FOCUS</span>
                    <span className="step-action">Start your session</span>
                  </div>
                </div>
                <div className="timer-display">
                  <div className="timer-digit">{formatTime(timeLeft).h}</div>
                  <div className="timer-sep">:</div>
                  <div className="timer-digit">{formatTime(timeLeft).m}</div>
                  <div className="timer-sep">:</div>
                  <div className="timer-digit">{formatTime(timeLeft).s}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    type="button" 
                    onClick={handleToggleTimer} 
                    className={`btn-loop-action focus-active ${timerRunning ? "running" : ""}`}
                    style={{ flex: 1 }}
                  >
                    <Flame size={16} className={timerRunning ? "animate-pulse" : ""} />
                    <span>{timerRunning ? "Pause Focus" : "Start Focus Session"}</span>
                  </button>
                  {timeLeft !== 3600 && (
                    <button 
                      type="button" 
                      onClick={handleResetTimer} 
                      className="btn-loop-reset"
                      title="Reset Timer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="loop-step-connector">
                  <ArrowRight size={14} className="connector-arrow" />
                </div>
              </div>

              {/* Step 2: Ship */}
              <div className="loop-step ship-step">
                <div className="loop-step-header">
                  <div className="step-number">02</div>
                  <div className="step-info">
                    <span className="step-label">DAILY SHIP</span>
                    <span className="step-action">Complete milestones</span>
                  </div>
                </div>
                <div className="mock-checklist">
                  <button 
                    type="button"
                    className={`mock-check-btn ${milestones[0] ? "completed" : ""}`}
                    onClick={() => handleToggleMilestone(0)}
                  >
                    {milestones[0] ? (
                      <CheckCircle2 size={16} className="checklist-icon" />
                    ) : (
                      <span className="mock-check-box" />
                    )}
                    <span>Setup project architecture</span>
                  </button>
                  <button 
                    type="button"
                    className={`mock-check-btn ${milestones[1] ? "completed" : ""}`}
                    onClick={() => handleToggleMilestone(1)}
                  >
                    {milestones[1] ? (
                      <CheckCircle2 size={16} className="checklist-icon" />
                    ) : (
                      <span className="mock-check-box" />
                    )}
                    <span>Implement user authentication</span>
                  </button>
                  <button 
                    type="button"
                    className={`mock-check-btn ${milestones[2] ? "completed" : ""}`}
                    onClick={() => handleToggleMilestone(2)}
                  >
                    {milestones[2] ? (
                      <CheckCircle2 size={16} className="checklist-icon" />
                    ) : (
                      <span className="mock-check-box" />
                    )}
                    <span>Deploy MVP to production</span>
                  </button>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>
                    <span>SHIPPING PROGRESS</span>
                    <span>{Math.round((milestones.filter(Boolean).length / 3) * 100)}%</span>
                  </div>
                  <div className="progress-bar-mini">
                    <div className="progress-fill" style={{ width: `${(milestones.filter(Boolean).length / 3) * 100}%`, transition: "width 0.3s ease" }} />
                  </div>
                </div>

                <div className="loop-step-connector">
                  <ArrowRight size={14} className="connector-arrow" />
                </div>
              </div>

              {/* Step 3: Prove */}
              <div className="loop-step prove-step">
                <div className="loop-step-header">
                  <div className="step-number">03</div>
                  <div className="step-info">
                    <span className="step-label">PUBLIC PROOF</span>
                    <span className="step-action">Lock your streak</span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmitProof} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  <div className="mock-proof-input">
                    <label htmlFor="hero-proof-url" className="mock-input-label">GitHub or Twitter URL</label>
                    <input
                      id="hero-proof-url"
                      type="text"
                      className="mock-input-field-interactive"
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder="github.com/alex/ship-it"
                      disabled={streakLocked}
                    />
                  </div>

                  {!streakLocked ? (
                    <button 
                      type="submit" 
                      className="btn-loop-action prove-active"
                      disabled={!proofUrl.trim()}
                    >
                      <Zap size={16} />
                      <span>Submit Proof of Work</span>
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleResetProof} 
                      className="btn-loop-action streak-secured"
                    >
                      <CheckCircle2 size={16} />
                      <span>Streak Secured! Reset</span>
                    </button>
                  )}
                </form>

                <div className="mock-streak-status">
                  <Flame size={12} className={streakLocked ? "glow-streak-flame" : ""} />
                  <span>
                    {streakLocked ? (
                      <strong style={{ color: "var(--success)" }}>Day {streakCount} Streak LOCKED! 🔥</strong>
                    ) : (
                      "Day 1 Streak Initializing..."
                    )}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Strip */}
          <div className="stats-strip">
            <div className="stat-card">
              <div className="stat-value glow-indigo-text">60 Days</div>
              <div className="stat-label">Non-stop Shipping</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">12,400+</div>
              <div className="stat-label">Projects Shipped</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">11 PM - 3 AM</div>
              <div className="stat-label">Peak Coding Hours</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">₹14.2 LPA</div>
              <div className="stat-label">Highest Career Leap</div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. "How the 60-day challenge works" */}
      <section id="challenge" className="section-padding" style={{ borderTop: "1px solid var(--border-color)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="landing-container">
          <div className="section-header">
            <span className="section-title-sm">The Curriculum Roadmap</span>
            <h2 className="section-title">How the 60-day sprint works</h2>
            <p className="section-subtitle">
              Every day at 11:00 PM IST, the daily cohort challenge drops. You have 24 hours to code, debug, push, and tweet. Here is how your skill accelerates.
            </p>
          </div>

          <div className="timeline-grid">
            {/* Interactive Timeline Column (Left) */}
            <div className="timeline-interactive-column">
              {TIMELINE_PHASES.map((phase, index) => (
                <div
                  key={phase.phase}
                  className={`timeline-card ${activeTimelinePhaseIndex === index ? "active" : ""}`}
                  onClick={() => setActiveTimelinePhaseIndex(index)}
                >
                  <div className="timeline-card-header">
                    <span className="timeline-phase">{phase.phase}</span>
                    <span className="timeline-duration">{phase.duration}</span>
                  </div>
                  <h3 className="timeline-card-title">{phase.title}</h3>
                  <p className="timeline-card-desc">{phase.description}</p>
                </div>
              ))}
            </div>

            {/* Visual Checklist Column (Right) */}
            <div className="timeline-visual-column">
              <div>
                <div className="visual-title-row">
                  <div className="visual-icon-box">
                    <Terminal size={20} />
                  </div>
                  <h4 className="visual-title">{TIMELINE_PHASES[activeTimelinePhaseIndex].title}</h4>
                </div>
                
                <div className="visual-content-body">
                  <div className="checklist-title">Phase Milestones & Deliverables</div>
                  <ul className="visual-checklist">
                    {TIMELINE_PHASES[activeTimelinePhaseIndex].checklist.map((item, idx) => (
                      <li key={idx} className="checklist-item">
                        <CheckCircle2 size={16} className="checklist-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="visual-footer-stats">
                {TIMELINE_PHASES[activeTimelinePhaseIndex].stats.map((stat, idx) => (
                  <div key={idx} className="v-stat">
                    <span className="v-stat-value" style={{ color: idx === 0 ? "var(--accent-indigo)" : "var(--text-primary)" }}>{stat.value}</span>
                    <span className="v-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Build In Public Section */}
      <section id="why-public" className="section-padding" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div className="landing-container">
          <div className="section-header">
            <span className="section-title-sm">The Philosophy of Proof-of-Work</span>
            <h2 className="section-title">Why we build in public</h2>
            <p className="section-subtitle">
              Traditional college placements are broken. Applying with a generic resume leads to automatic rejection. Sharing your daily progress is a cheat code to getting discovered.
            </p>
          </div>

          <div className="bip-grid">
            {/* Card 1: Resume is Dead */}
            <div className="bip-card">
              <div className="bip-icon-wrapper">
                <Code2 size={22} />
              </div>
              <h3 className="bip-card-title">Your GitHub is Your CV</h3>
              <p className="bip-card-desc">
                Recruiters do not read bullet points on a PDF. They click active, live URLs. Building in public creates an undeniable backlog of daily git contributions and real commits.
              </p>
            </div>

            {/* Card 2: Compounding Audience */}
            <div className="bip-card">
              <div className="bip-icon-wrapper">
                <Twitter size={22} />
              </div>
              <h3 className="bip-card-title">Compounding Network</h3>
              <p className="bip-card-desc">
                When you share a brief 45-second loom video or code highlight on Twitter/LinkedIn, founders, developers, and tech managers start to notice your growth. You bypass standard HR channels completely.
              </p>
            </div>

            {/* Card 3: Late-Night Friction Reduction */}
            <div className="bip-card">
              <div className="bip-icon-wrapper">
                <Flame size={22} />
              </div>
              <h3 className="bip-card-title">Collective Discipline</h3>
              <p className="bip-card-desc">
                Coding at 2 AM is lonely. Doing it with 5,000 other Indian students who are debugging, troubleshooting, and sharing on the same timelines creates an electric, addictive accountability loop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Student Success / Testimonial Section */}
      <section id="success" className="section-padding" style={{ borderTop: "1px solid var(--border-color)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="landing-container">
          <div className="section-header" style={{ margin: "0 auto 48px auto", textAlign: "center" }}>
            <span className="section-title-sm">Alumni Impact</span>
            <h2 className="section-title">Turn messy code into clear careers</h2>
            <p className="section-subtitle" style={{ maxWidth: "600px", margin: "0 auto" }}>
              Meet Indian students from tier-2 and tier-3 colleges who committed to the 60-day sprint and bypassed campus placements entirely.
            </p>
          </div>

          {/* Testimonial Filter Category Tabs */}
          <div style={{ textAlign: "center" }}>
            <div className="success-tabs">
              {["All", "Full Stack", "Backend", "AI & DevTools"].map((cat) => (
                <button
                  key={cat}
                  className={`success-tab ${testimonialCategory === cat ? "active" : ""}`}
                  onClick={() => setTestimonialCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="testimonials-grid">
            {filteredTestimonials.map((item) => (
              <div key={item.name} className="testimonial-card">
                <div>
                  <div className="quote-icon">
                    <MessageSquare size={32} fill="currentColor" />
                  </div>
                  <p className="testimonial-quote">
                    "{item.quote}"
                  </p>
                </div>

                <div>
                  <div className="testimonial-project">
                    <span className="project-label">60-Day Capstone Build</span>
                    <div className="project-name">
                      <span>{item.project}</span>
                      <Github size={14} style={{ opacity: 0.6 }} />
                    </div>
                    <div className="project-techs">
                      {item.techs.map((t) => (
                        <span key={t} className="tech-tag">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="testimonial-profile">
                    <div className="profile-info">
                      <div className="profile-avatar">
                        {item.avatarChar}
                      </div>
                      <div>
                        <div className="profile-name">{item.name}</div>
                        <div className="profile-college">{item.college}</div>
                      </div>
                    </div>
                    <div className="social-icons-row">
                      <a href={`https://github.com/${item.github}`} target="_blank" rel="noreferrer" className="social-icon-link" aria-label="GitHub Profile">
                        <Github size={16} />
                      </a>
                      <a href={`https://twitter.com/${item.social}`} target="_blank" rel="noreferrer" className="social-icon-link" aria-label="Twitter Profile">
                        <Twitter size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final CTA (Late Night High Impact Challenge Form) */}
      <section id="join" className="section-padding" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div className="landing-container">
          <div className="final-cta-wrapper">
            <div className="cta-grid">
              {/* Left Side: Motivational copy */}
              <div>
                <span className="batch-status-badge">
                  <Flame size={14} />
                  <span>COHORT 12: SIGNUPS CLOSING TONIGHT AT MIDNIGHT</span>
                </span>
                <h2 className="cta-headline">Are you ready to commit?</h2>
                <p className="cta-subtext">
                  60 days of writing public code requires exceptional discipline. We do not charge money. We charge focus and consistency. Read and unlock the Honor Code below to request your slot.
                </p>
                <div style={{ display: "flex", gap: "24px", opacity: 0.8 }} className="cta-stats-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Users size={18} style={{ color: "var(--accent-indigo)" }} />
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>4,821 Students Enrolling</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Award size={18} style={{ color: "var(--accent-indigo)" }} />
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>Honor Certificate Unlocks</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Interactive Honor Code Sign Up Card */}
              <button 
                onClick={() => setIsRegistrationModalOpen(true)}
                className="btn-primary"
              >
                Request Admission Slot <Zap size={16} />
              </button>

              <AnimatePresence>
                {isRegistrationModalOpen && (
                  <motion.div
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 10000,
                      background: "rgba(5, 5, 8, 0.85)",
                      backdropFilter: "blur(8px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px"
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      style={{
                        width: "100%",
                        maxWidth: "480px",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        background: "var(--bg-secondary)",
                        border: "1.5px solid var(--border-hover)",
                        borderRadius: "24px",
                        padding: "32px",
                        position: "relative",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
                      }}
                      initial={{ scale: 0.9, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 15 }}
                    >
                      <button 
                        onClick={() => setIsRegistrationModalOpen(false)}
                        style={{
                          position: "absolute",
                          top: 20,
                          right: 20,
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer"
                        }}
                      >
                        <X size={20} />
                      </button>
                      
                      <div className={`commitment-card ${isCommitmentUnlocked ? "unlocked" : ""}`} style={{ border: 'none', padding: 0 }}>
                        <div className="commitment-title">
                          {isCommitmentUnlocked ? (
                            <Unlock size={20} style={{ color: "var(--success)" }} />
                          ) : (
                            <Lock size={20} style={{ color: "var(--accent-violet)" }} />
                          )}
                          <span>ABTalks Honor Commitment</span>
                        </div>
                        <div className="commitment-subtitle">
                          Check all 3 parameters to unlock the admission slot
                        </div>

                        {/* Form or Completion State */}
                        {!registered ? (
                          <form onSubmit={handleRegisterSubmit}>
                            <div className="commitment-list">
                              {/* Checkbox 1 */}
                              <label className={`commitment-checkbox-label ${codeEveryDay ? "checked" : ""}`}>
                                <input
                                  type="checkbox"
                                  className="checkbox-custom-input"
                                  checked={codeEveryDay}
                                  onChange={(e) => setCodeEveryDay(e.target.checked)}
                                />
                                <span className="checkbox-visual-box">
                                  <CheckCircle2 size={12} fill="currentColor" />
                                </span>
                                <span>I commit to write code for at least 1 hour every single day for 60 consecutive days.</span>
                              </label>

                              {/* Checkbox 2 */}
                              <label className={`commitment-checkbox-label ${shareInPublic ? "checked" : ""}`}>
                                <input
                                  type="checkbox"
                                  className="checkbox-custom-input"
                                  checked={shareInPublic}
                                  onChange={(e) => setShareInPublic(e.target.checked)}
                                />
                                <span className="checkbox-visual-box">
                                  <CheckCircle2 size={12} fill="currentColor" />
                                </span>
                                <span>I commit to share raw public updates (even when my code is messy/incomplete).</span>
                              </label>

                              {/* Checkbox 3 */}
                              <label className={`commitment-checkbox-label ${helpOthers ? "checked" : ""}`}>
                                <input
                                  type="checkbox"
                                  className="checkbox-custom-input"
                                  checked={helpOthers}
                                  onChange={(e) => setHelpOthers(e.target.checked)}
                                />
                                <span className="checkbox-visual-box">
                                  <CheckCircle2 size={12} fill="currentColor" />
                                </span>
                                <span>I commit to lift up and debug with fellow coders when they are stuck in our Discord.</span>
                              </label>
                            </div>

                            <div className="cta-action-container">
                              <div style={{ marginBottom: "16px" }}>
                                <input
                                  type="text"
                                  placeholder="Your Name"
                                  required
                                  disabled={!isCommitmentUnlocked}
                                  value={signUpName}
                                  onChange={(e) => setSignUpName(e.target.value)}
                                  style={{
                                    width: "100%",
                                    background: "var(--bg-secondary)",
                                    border: "1px solid var(--border-color)",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    color: "var(--text-primary)",
                                    fontSize: "14px",
                                    marginBottom: "10px",
                                    outline: "none"
                                  }}
                                />
                                <input
                                  type="email"
                                  placeholder="College Email Address"
                                  required
                                  disabled={!isCommitmentUnlocked}
                                  value={signUpEmail}
                                  onChange={(e) => setSignUpEmail(e.target.value)}
                                  style={{
                                    width: "100%",
                                    background: "var(--bg-secondary)",
                                    border: "1px solid var(--border-color)",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    color: "var(--text-primary)",
                                    fontSize: "14px",
                                    outline: "none"
                                  }}
                                />
                              </div>

                              <button
                                type="submit"
                                disabled={!isCommitmentUnlocked}
                                className={`btn-cta-submit ${isCommitmentUnlocked ? "unlocked" : "locked"}`}
                              >
                                {isCommitmentUnlocked ? (
                                  <>
                                    <span>Request Admission Slot</span>
                                    <Zap size={16} style={{ color: "var(--accent-indigo)" }} />
                                  </>
                                ) : (
                                  <>
                                    <span>Unlock Honor Code First</span>
                                    <Lock size={14} />
                                  </>
                                )}
                              </button>

                              <span className="lock-helper-text">
                                {isCommitmentUnlocked 
                                  ? "✓ System Unlocked. Slots are assigned on first-come-first-served basis." 
                                  : "🔒 Accept all three parameters above to initiate admission sequence."}
                              </span>

                              <div className="existing-user-link" style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                Already have an account? <a href="/dashboard" style={{ color: "var(--accent-indigo)", textDecoration: "none", fontWeight: "600" }}>Access your Dashboard &rarr;</a>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: "center", padding: "24px 0" }}
                          >
                            <div style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              backgroundColor: "var(--success-bg)",
                              color: "var(--success)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 16px auto"
                            }}>
                              <CheckCircle2 size={24} />
                            </div>
                            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Welcome to the sprint, {signUpName}!</h3>
                            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                              We have sent an verification lock-link to <strong style={{ color: "var(--text-primary)" }}>{signUpEmail}</strong>. Verification must be completed within 3 hours.
                            </p>
                            <div style={{
                              background: "rgba(255, 255, 255, 0.03)",
                              border: "1px solid var(--border-color)",
                              padding: "12px",
                              borderRadius: "8px",
                              fontFamily: "var(--font-mono)",
                              fontSize: "12px",
                              color: "var(--text-secondary)",
                              marginBottom: "24px"
                            }}>
                              Cohort #12 starts at 12:00 AM IST tonight.<br />
                              Streak initialization link included in email.
                            </div>

                            <a href="/dashboard" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                              Launch Dashboard & Start Day 1 <Zap size={16} />
                            </a>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Editorial Footer */}
      <footer className="premium-footer">
        <div className="landing-container footer-content">
          <div className="footer-logo">
            <div className="logo-symbol" style={{ width: 22, height: 22, fontSize: "12px", borderRadius: "4px" }}>AB</div>
            <span>abtalks.challenge</span>
          </div>
          
          <div className="footer-copyright">
            © {new Date().getFullYear()} ABTalks Dev community. Dedicated to the builders coding through the night.
          </div>

          <div className="footer-socials">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
