import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Flame,
  CheckCircle2,
  Unlock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Award,
  Terminal,
  Check,
  X,
  Clock,
  Activity
} from "lucide-react";
import "./Landing.css";
import "./Dashboard.css";
import { useCurrentDay } from "../hooks/useCurrentDay";
import { generateAllChallenges, type ChallengeDay } from "../data/challenges";

// Custom SVGs for proof providers
const GithubIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
  </svg>
);
const TwitterIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
const LinkedinIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface UserProfile {
  name: string;
  college: string;
  githubUrl: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Navigation / Scroll effect state
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSettingUpProfile, setIsSettingUpProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>({ 
    name: "Pranjal Kumar", 
    college: "SR University", 
    githubUrl: "https://github.com/pranjalkumar" 
  });

  // Load profile on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("abtalks_user_profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setIsSettingUpProfile(true);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("abtalks_user_profile", JSON.stringify(tempProfile));
    setProfile(tempProfile);
    setIsSettingUpProfile(false);
  };

  // Helper for initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';
  };

  // Dynamic user and progress states
  const { currentDay, setCurrentDay } = useCurrentDay();
  const [streak, setStreak] = useState(12);
  const [challenges, setChallenges] = useState<ChallengeDay[]>([]);
  const [completedPercent, setCompletedPercent] = useState(20);

  // Active checked items for today's challenge card
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});

  // Submission Popup / Toast Simulation
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [proofUrlInput, setProofUrlInput] = useState("");
  const [proofTypeInput, setProofTypeInput] = useState<"GitHub" | "Twitter" | "LinkedIn">("GitHub");
  const [showCelebration, setShowCelebration] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected completed / upcoming day in detail view
  const [selectedReviewDay, setSelectedReviewDay] = useState<ChallengeDay | null>(null);

  // Scroll event for styling navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize challenges on mount or day update
  useEffect(() => {
    const data = generateAllChallenges(currentDay);
    setChallenges(data);
    const completedCount = data.filter((c) => c.status === "completed").length;
    setCompletedPercent(Math.round((completedCount / 60) * 100));
  }, [currentDay]);

  // Load persisted checklist state for the active day
  useEffect(() => {
    const savedChecked = localStorage.getItem(`abtalks_checked_${currentDay}`);
    if (savedChecked) {
      try {
        setCheckedTasks(JSON.parse(savedChecked));
      } catch {
        setCheckedTasks({});
      }
    } else {
      setCheckedTasks({});
    }
  }, [currentDay]);

  // Current day reference challenge details
  const todayChallenge = challenges.find((c) => c.dayNum === currentDay) || {
    dayNum: currentDay,
    title: "Review & Continue",
    description: "Review your recent code bases, finalize documentation, and prepare for the upcoming scaling phases.",
    phase: "Phase 1: Habit",
    status: "current" as const,
    techStack: ["Node.js", "Express"],
    tasks: ["Check CD pipelines", "Write comprehensive inline docs"]
  };

  // Toggle checklist checkbox
  const toggleTask = (index: number) => {
    setCheckedTasks((prev) => {
      const updated = {
        ...prev,
        [index]: !prev[index]
      };
      localStorage.setItem(`abtalks_checked_${currentDay}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Compute how many tasks are done for today
  const activeTasks = todayChallenge.tasks || [];
  const completedTasksCount = activeTasks.reduce(
    (count, _, idx) => (checkedTasks[idx] ? count + 1 : count),
    0
  );
  const allTasksCompleted = activeTasks.length > 0 && completedTasksCount === activeTasks.length;

  const handleCloseSubmission = () => {
    setIsSubmittingProof(false);
    setProofUrlInput("");
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedProof = proofUrlInput.trim();
    if (!trimmedProof) {
      triggerToast("Please provide a valid proof URL!");
      return;
    }

    const submittedDay = currentDay;
    localStorage.setItem(`abtalks_proof_${submittedDay}`, trimmedProof);

    setIsSubmittingProof(false);
    setShowCelebration(true);
    setStreak((prev) => prev + 1);

    triggerToast(`Successfully submitted proof for Day ${submittedDay}! Streak updated.`);

    setTimeout(() => {
      setShowCelebration(false);
      setCurrentDay(Math.min(60, submittedDay + 1));
      setProofUrlInput("");
    }, 4000);
  };

  // Trigger quick fleeting alerts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Click on any block in the 60-day visual grid
  const handleBlockClick = (day: ChallengeDay) => {
    if (day.status === "locked") {
      triggerToast(`Day ${day.dayNum} is locked. Complete Day ${currentDay} first!`);
      return;
    }
    setSelectedReviewDay(day);
    navigate(`/day/${day.dayNum}`);
  };

  // Get proof icon components helper
  const renderProofIcon = (type: "GitHub" | "Twitter" | "LinkedIn") => {
    switch (type) {
      case "GitHub":
        return <GithubIcon size={16} />;
      case "Twitter":
        return <TwitterIcon size={16} />;
      case "LinkedIn":
        return <LinkedinIcon size={16} />;
    }
  };

  return (
    <div className="dashboard-page">
      {/* Dynamic Background Glows */}
      <div className="bg-glow bg-glow-top" />
      <div className="bg-glow bg-glow-middle" />

      {/* 1. Dashboard Navbar */}
      <nav className={`dashboard-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="landing-container nav-wrapper" style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <Link to="/" className="nav-logo-link">
            <div className="logo-symbol">AB</div>
            <span>abtalks<span style={{ color: "var(--accent-indigo)" }}>.challenge</span></span>
          </Link>

          <button className="mobile-nav-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><div style={{ width: '20px', height: '2px', background: 'var(--text-primary)' }} /><div style={{ width: '20px', height: '2px', background: 'var(--text-primary)' }} /></div>}
          </button>

          <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`} style={{ display: "flex", gap: "24px" }}>
            <Link to="/" className="nav-item">Home</Link>
            <a href="#dashboard" className="nav-item active" style={{ color: "var(--text-primary)", fontWeight: 600 }}>My Dashboard</a>
          </div>

          <div className="user-nav-profile">
            <div className="user-nav-avatar">{profile ? getInitials(profile.name) : '??'}</div>
            <div className="user-nav-info">
              <span className="student-proof-name">{profile?.name || "Set up profile"}</span>
              <span className="student-proof-college" style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{profile?.college || "Please set up your info"}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Main Container */}
      <main className="landing-container dashboard-main-content">
        
        {/* Floating Dynamic Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="editorial-badge"
              style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 1000,
                background: "rgba(11, 12, 16, 0.95)",
                border: "1.5px solid rgba(139, 92, 246, 0.3)",
                color: "var(--text-primary)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
              }}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pulse-dot" style={{ backgroundColor: "var(--accent-orange)", boxShadow: "0 0 8px var(--accent-orange)" }} />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Day Increment/Unlock Celebration Overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                background: "rgba(5, 5, 8, 0.9)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 15 }}
                style={{ maxWidth: "480px", padding: "32px" }}
              >
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏆</div>
                <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "12px", background: "linear-gradient(135deg, #a5b4fc, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Day {currentDay} Logged!
                </h2>
                <div className="editorial-badge" style={{ marginBottom: "20px" }}>
                  <Flame size={14} style={{ color: "var(--accent-orange)" }} />
                  <span>Streak Increased to {streak} Days</span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: 1.6 }}>
                  Excellent consistency! Your public proof has been securely dispatched to the main cohort pipeline. Preparing to unlock the next milestone...
                </p>
                <div style={{ marginTop: "32px", display: "flex", justifyContent: "center" }}>
                  <div className="pulse-dot" style={{ width: 12, height: 12, backgroundColor: "var(--accent-indigo)", borderRadius: "50%" }} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          
          {/* Main Left Side Columns */}
          <div className="dashboard-left-col">
            
            {/* A. Welcome Banner & Overall Progress */}
            <section className="welcome-banner">
              <div className="welcome-header-flex">
                <div className="welcome-title-group">
                  <span className="section-title-sm">Developer Workspace</span>
                  <h2>Welcome back, {profile?.name.split(' ')[0] || 'Developer'}!</h2>
                  <p className="welcome-subtitle">
                    You're crushing the challenge. Day {currentDay} is active. Keep the fire burning tonight!
                  </p>
                </div>
                <div className="editorial-badge">
                  <div className="pulse-dot" />
                  <span>Cohort Rank: Top 4%</span>
                </div>
              </div>

              {/* Responsive Metrics Strip inside Banner */}
              <div className="metrics-row">
                <div className="metric-mini-card streak-active">
                  <div className="metric-icon-box">
                    <Flame size={20} />
                  </div>
                  <div className="metric-content-group">
                    <span className="metric-mini-val">{streak} Days</span>
                    <span className="metric-mini-lbl">Current Streak</span>
                  </div>
                </div>

                <div className="metric-mini-card progress-card-metric">
                  <div className="metric-icon-box">
                    <Award size={20} />
                  </div>
                  <div className="metric-content-group">
                    <span className="metric-mini-val">{completedPercent}%</span>
                    <span className="metric-mini-lbl">Completed</span>
                  </div>
                </div>

                <div className="metric-mini-card rank-metric">
                  <div className="metric-icon-box">
                    <Activity size={20} />
                  </div>
                  <div className="metric-content-group">
                    <span className="metric-mini-val">Active</span>
                    <span className="metric-mini-lbl">Cohort Status</span>
                  </div>
                </div>
              </div>
            </section>

            {/* B. Interactive 60-Day Progress Grid */}
            <section className="progress-grid-section">
              <div className="progress-section-header">
                <div className="progress-section-title">
                  <Code2 size={20} style={{ color: "var(--accent-indigo)" }} />
                  <span>Your 60-Day Sprint Roadmap</span>
                  <span className="progress-percent-badge">{challenges.filter(c => c.status === "completed").length} / 60 Completed</span>
                </div>
                
                <div className="grid-legend">
                  <div className="legend-item">
                    <div className="legend-color completed" />
                    <span>Done</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color current" />
                    <span>Active</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color locked" />
                    <span>Locked</span>
                  </div>
                </div>
              </div>

              {/* Scrollable grid wrapper */}
              <div className="grid-60-scroll-container">
                <div className="progress-grid-60">
                  {challenges.map((day) => (
                    <div
                      key={day.dayNum}
                      className={`progress-block ${day.status}`}
                      onClick={() => handleBlockClick(day)}
                    >
                      {day.dayNum}
                      
                      {/* Interactive block hover tooltip */}
                      <div className="progress-block-tooltip">
                        <strong style={{ display: "block", color: "var(--text-primary)" }}>Day {day.dayNum}</strong>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{day.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Road progress-bar visualizer */}
              <div className="roadmap-progress-bar-container">
                <div 
                  className="roadmap-progress-bar-fill" 
                  style={{ width: `${completedPercent}%` }}
                />
              </div>

              {/* C. Dynamic Day Detail panel (triggers when clicking completed day) */}
              <AnimatePresence>
                {selectedReviewDay && (
                  <motion.div 
                    className="active-detail-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="active-detail-header">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="editor-badge-phase" style={{ color: "var(--success)", background: "rgba(16, 185, 129, 0.08)", borderColor: "rgba(16, 185, 129, 0.15)" }}>
                          Day {selectedReviewDay.dayNum} Completed
                        </span>
                        <span className="challenge-phase-label">{selectedReviewDay.phase}</span>
                      </div>
                      <button className="active-detail-close" onClick={() => setSelectedReviewDay(null)}>
                        <X size={16} />
                      </button>
                    </div>

                    <h4 className="active-detail-title">{selectedReviewDay.title}</h4>
                    <p className="active-detail-desc">{selectedReviewDay.description}</p>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                      {selectedReviewDay.techStack.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>

                    <div className="active-detail-stats">
                      {selectedReviewDay.timeSpent && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Clock size={12} />
                          <span>Focus Time: {selectedReviewDay.timeSpent}</span>
                        </div>
                      )}
                      {selectedReviewDay.proofUrl && (
                        <a 
                          href={`https://${selectedReviewDay.proofUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--accent-indigo)", textDecoration: "none" }}
                        >
                          {renderProofIcon(selectedReviewDay.proofType || "GitHub")}
                          <span>View Public Proof-of-Work</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* D. Current Active Challenge Card */}
            <section className="active-challenge-card" id="active-challenge-module">
              <div className="challenge-card-badge-row">
                <span className="current-day-label">ACTIVE DAY {todayChallenge.dayNum}</span>
                <span className="challenge-phase-label">{todayChallenge.phase}</span>
              </div>

              <h3 className="challenge-title">{todayChallenge.title}</h3>
              <p className="challenge-desc">{todayChallenge.description}</p>

              <div className="checklist-container">
                <span className="checklist-header">Today's Deliverable Checklist ({completedTasksCount} of {activeTasks.length} Completed)</span>
                {activeTasks.map((task, idx) => (
                  <div
                    key={idx}
                    className={`checklist-item ${checkedTasks[idx] ? "checked" : ""}`}
                    onClick={() => toggleTask(idx)}
                  >
                    <div className="checklist-checkbox">
                      {checkedTasks[idx] && <Check size={12} />}
                    </div>
                    <span className="checklist-item-text">{task}</span>
                  </div>
                ))}
              </div>

              <div className="challenge-action-flex">
                <Link
                  to={`/day/${currentDay}`}
                  className="btn-continue-challenge"
                  style={{
                    opacity: allTasksCompleted ? 1 : 0.6,
                    cursor: allTasksCompleted ? "pointer" : "not-allowed",
                    textDecoration: "none"
                  }}
                >
                  <span>Submit Daily Proof-of-Work</span>
                  <ArrowRight size={18} />
                </Link>
                
                <div className="challenge-status-text">
                  <div className="pulse-dot" />
                  <span>Late Night Window Active (IST)</span>
                </div>
              </div>
            </section>

          </div>

          {/* Right Sidebar */}
          <div className="dashboard-right-col">
            
            {/* A. Profile panel & local info */}
            <section className="sidebar-profile-card">
              <div className="sidebar-profile-header">
                <div className="sidebar-avatar-large">{profile ? getInitials(profile.name) : '??'}</div>
                <h3 className="sidebar-name">{profile?.name || "Set up profile"}</h3>
                <span className="sidebar-college">{profile?.college || "Update your details"}</span>
                <span className="profile-cohort-tag">
                  <Sparkles size={12} style={{ color: "var(--accent-indigo)" }} />
                  <span>Cohort #04 Late-Night</span>
                </span>
              </div>

              <div className="sidebar-repo-box">
                <div className="sidebar-repo-header">
                  <span>Tracking Repository</span>
                  <Terminal size={12} />
                </div>
                <a 
                  href={profile?.githubUrl || "#"}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="sidebar-repo-link"
                >
                  <span>{profile?.githubUrl || "Update your Repo URL"}</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div style={{ padding: "0 8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  <span>Weekly Consistency</span>
                  <span style={{ color: "var(--success)" }}>100% Perfect</span>
                </div>
                <div style={{ height: "4px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "100%", background: "var(--success)" }} />
                </div>
              </div>
            </section>

            {/* B. Previous Days Completed Log */}
            <section className="recent-days-section">
              <span className="section-title-sm" style={{ marginBottom: "16px" }}>Submission Log</span>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>Recent Proof-of-Work</h3>
              
              <div className="recent-days-list">
                
                <div className="recent-day-row-card">
                  <div className="recent-day-meta-group">
                    <div className="recent-day-circle-num">12</div>
                    <div className="recent-day-text-info">
                      <span className="recent-day-task-title">Database & Prisma Setup</span>
                      <span className="recent-day-subtext">Day 12 • Completed Yesterday</span>
                    </div>
                  </div>
                  <div className="recent-day-actions">
                    <a 
                      href="https://linkedin.com/in/saurav-codes/posts/day12-prisma" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="proof-icon-btn"
                      title="LinkedIn Proof"
                    >
                      <LinkedinIcon size={14} />
                    </a>
                    <a 
                      href="https://github.com/saurav-codes/ab-60" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="proof-icon-btn"
                      title="GitHub Code"
                    >
                      <GithubIcon size={14} />
                    </a>
                  </div>
                </div>

                <div className="recent-day-row-card">
                  <div className="recent-day-meta-group">
                    <div className="recent-day-circle-num">3</div>
                    <div className="recent-day-text-info">
                      <span className="recent-day-task-title">Dockerize Workspace</span>
                      <span className="recent-day-subtext">Day 3 • Completed Aug 3</span>
                    </div>
                  </div>
                  <div className="recent-day-actions">
                    <a 
                      href="https://twitter.com/saurav_codes" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="proof-icon-btn"
                      title="Twitter Proof"
                    >
                      <TwitterIcon size={14} />
                    </a>
                    <a 
                      href="https://github.com/saurav-codes/ab-60" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="proof-icon-btn"
                      title="GitHub Code"
                    >
                      <GithubIcon size={14} />
                    </a>
                  </div>
                </div>

                <div className="recent-day-row-card">
                  <div className="recent-day-meta-group">
                    <div className="recent-day-circle-num">2</div>
                    <div className="recent-day-text-info">
                      <span className="recent-day-task-title">Request Body Validation</span>
                      <span className="recent-day-subtext">Day 2 • Completed Aug 2</span>
                    </div>
                  </div>
                  <div className="recent-day-actions">
                    <a 
                      href="https://github.com/saurav-codes/ab-60" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="proof-icon-btn"
                      title="GitHub Code"
                    >
                      <GithubIcon size={14} />
                    </a>
                  </div>
                </div>

                <div className="recent-day-row-card">
                  <div className="recent-day-meta-group">
                    <div className="recent-day-circle-num">1</div>
                    <div className="recent-day-text-info">
                      <span className="recent-day-task-title">Server Setup & Health</span>
                      <span className="recent-day-subtext">Day 1 • Completed Aug 1</span>
                    </div>
                  </div>
                  <div className="recent-day-actions">
                    <a 
                      href="https://github.com/saurav-codes/ab-60" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="proof-icon-btn"
                      title="GitHub Code"
                    >
                      <GithubIcon size={14} />
                    </a>
                  </div>
                </div>

              </div>
            </section>

          </div>

        </div>
      </main>

      {/* 3. Proof Submission Modal / Overlay Dialog */}
      <AnimatePresence>
        {isSubmittingProof && (
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
                onClick={handleCloseSubmission}
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

              <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Unlock size={18} style={{ color: "var(--accent-indigo)" }} />
                <span>Submit Proof of Work</span>
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5, marginBottom: "24px" }}>
                Submit the public proof-of-work link for <strong>Day {currentDay}: {todayChallenge.title}</strong> to update your cohort profile.
              </p>

              <form onSubmit={handleSubmitProof}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                    Select Platform
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {(["GitHub", "Twitter", "LinkedIn"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setProofTypeInput(type)}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: proofTypeInput === type ? "1.5px solid var(--accent-indigo)" : "1px solid var(--border-color)",
                          background: proofTypeInput === type ? "rgba(99, 102, 241, 0.08)" : "none",
                          color: proofTypeInput === type ? "var(--text-primary)" : "var(--text-secondary)",
                          fontSize: "13px",
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {renderProofIcon(type)}
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                    Proof URL
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder={proofTypeInput === "GitHub" ? "github.com/username/project/tree/day..." : "twitter.com/username/status/..."}
                      value={proofUrlInput}
                      onChange={(e) => setProofUrlInput(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        background: "rgba(5, 5, 8, 0.4)",
                        border: "1.5px solid var(--border-color)",
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-sans)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.2s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "var(--accent-indigo)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--border-color)"}
                    />
                  </div>
                  <span className="lock-helper-text" style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px", display: "block" }}>
                    Must be a publicly accessible post or code tree URL.
                  </span>
                </div>

                <button 
                  type="submit" 
                  className="btn-continue-challenge"
                  style={{ width: "100%", padding: "14px" }}
                >
                  <span>Verify and Lock Progress</span>
                  <CheckCircle2 size={16} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. User Profile Setup Modal */}
      <AnimatePresence>
        {isSettingUpProfile && (
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
              <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={18} style={{ color: "var(--accent-indigo)" }} />
                <span>Set up your profile</span>
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5, marginBottom: "24px" }}>
                Welcome! Please set up your profile to start tracking your 60-day challenge.
              </p>

              <form onSubmit={handleSaveProfile}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Name</label>
                  <input type="text" value={tempProfile.name} onChange={e => setTempProfile({...tempProfile, name: e.target.value})} required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", background: "rgba(5, 5, 8, 0.4)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>College</label>
                  <input type="text" value={tempProfile.college} onChange={e => setTempProfile({...tempProfile, college: e.target.value})} required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", background: "rgba(5, 5, 8, 0.4)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>GitHub Repository URL</label>
                  <input type="text" value={tempProfile.githubUrl} onChange={e => setTempProfile({...tempProfile, githubUrl: e.target.value})} required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", background: "rgba(5, 5, 8, 0.4)", border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }} />
                </div>
                <button type="submit" className="btn-continue-challenge" style={{ width: "100%", padding: "14px" }}>
                  <span>Save Profile</span>
                  <CheckCircle2 size={16} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Elegant Editorial Footer */}
      <footer className="premium-footer" style={{ marginTop: "80px" }}>
        <div className="landing-container footer-content">
          <div className="footer-logo">
            <div className="logo-symbol" style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "11px", color: "var(--bg-primary)" }}>AB</div>
            <span>abtalks<span style={{ color: "var(--accent-indigo)" }}>.challenge</span></span>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} abtalks.challenge. Dedicated 60-day Build-In-Public sprint.
          </div>
          <div className="footer-socials">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <GithubIcon size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <TwitterIcon size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <LinkedinIcon size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
