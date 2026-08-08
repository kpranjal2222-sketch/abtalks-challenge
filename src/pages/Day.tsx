import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Clock, ExternalLink, Lock } from "lucide-react";
import "./Day.css";
import "./Landing.css";
import { useCurrentDay } from "../hooks/useCurrentDay";
import { generateAllChallenges, type ChallengeDay } from "../data/challenges";

const MIN_DAY = 1;
const MAX_DAY = 60;

function parseDayId(dayId: string | undefined): number | null {
  if (!dayId || !/^\d+$/.test(dayId)) return null;
  const num = parseInt(dayId, 10);
  if (num < MIN_DAY || num > MAX_DAY) return null;
  return num;
}

function DayNotFound() {
  return (
    <div className="day-page-root">
      <nav className="day-navbar">
        <div className="landing-container" style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <Link to="/" className="nav-logo-link">
            <div className="logo-symbol">AB</div>
            <span>abtalks</span>
          </Link>
          <Link to="/dashboard" className="nav-item">Dashboard</Link>
        </div>
      </nav>

      <main className="landing-container">
        <div className="breadcrumb-nav">
          <Link to="/dashboard" className="btn-back-dashboard">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        <div className="locked-shield-overlay">
          <h3 className="locked-shield-title">Challenge not found</h3>
          <p className="locked-shield-desc">
            Enter a day between {MIN_DAY} and {MAX_DAY} to view a challenge.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function Day() {
  const { dayId } = useParams<{ dayId: string }>();
  const dayNum = parseDayId(dayId);
  const isValidDay = dayNum !== null;

  const { currentDay, setCurrentDay } = useCurrentDay();
  const challenges = generateAllChallenges(currentDay);
  const challenge: ChallengeDay | undefined = isValidDay
    ? challenges.find((c) => c.dayNum === dayNum)
    : undefined;

  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});
  const [userProofUrl, setUserProofUrl] = useState<string>("");
  const [isEditingProof, setIsEditingProof] = useState(false);
  const [proofInput, setProofInput] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [completionPulse, setCompletionPulse] = useState(false);

  useEffect(() => {
    if (!isValidDay || dayNum === null) {
      setCheckedTasks({});
      setUserProofUrl("");
      setProofInput("");
      setIsEditingProof(false);
      setTimerSeconds(0);
      setTimerActive(false);
      return;
    }

    const savedChecked = localStorage.getItem(`abtalks_checked_${dayNum}`);
    if (savedChecked) {
      try {
        setCheckedTasks(JSON.parse(savedChecked));
      } catch {
        setCheckedTasks({});
      }
    } else {
      setCheckedTasks({});
    }

    const savedProof = localStorage.getItem(`abtalks_proof_${dayNum}`);
    const resolvedProof = savedProof || challenge?.proofUrl || "";
    setUserProofUrl(resolvedProof);
    setProofInput(resolvedProof);
    setIsEditingProof(false);

    const savedTimer = localStorage.getItem(`abtalks_timer_${dayNum}`);
    setTimerSeconds(savedTimer ? parseInt(savedTimer, 10) : 0);
    setTimerActive(false);
  }, [dayNum, isValidDay, challenge?.proofUrl]);

  useEffect(() => {
    if (!isValidDay || dayNum === null) return;

    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev + 1;
          localStorage.setItem(`abtalks_timer_${dayNum}`, next.toString());
          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, dayNum, isValidDay]);

  if (!isValidDay || !challenge || dayNum === null) {
    return <DayNotFound />;
  }

  const toggleTask = (index: number) => {
    if (challenge.status === "locked") return;
    const updated = {
      ...checkedTasks,
      [index]: !checkedTasks[index]
    };
    setCheckedTasks(updated);
    localStorage.setItem(`abtalks_checked_${dayNum}`, JSON.stringify(updated));
  };

  const completedTasksCount = challenge.tasks.reduce(
    (count, _, idx) => (checkedTasks[idx] ? count + 1 : count),
    0
  );
  const progressPercent = challenge.tasks.length > 0
    ? (completedTasksCount / challenge.tasks.length) * 100
    : 0;
  const allTasksCompleted = challenge.tasks.length > 0 && completedTasksCount === challenge.tasks.length;
  const canMarkComplete = allTasksCompleted;

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(0);
    localStorage.removeItem(`abtalks_timer_${dayNum}`);
  };

  const formatTime = (totalSeconds: number): string => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [
      h > 0 ? String(h).padStart(2, "0") : null,
      String(m).padStart(2, "0"),
      String(s).padStart(2, "0")
    ].filter(Boolean).join(":");
  };

  const parseEstimatedTime = (timeStr?: string): number => {
    if (!timeStr || timeStr === "--") return 0;
    let totalMinutes = 0;
    const hoursMatch = timeStr.match(/(\d+)h/);
    const minsMatch = timeStr.match(/(\d+)m/);
    if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;
    if (minsMatch) totalMinutes += parseInt(minsMatch[1], 10);
    return totalMinutes;
  };

  const estimatedMinutes = parseEstimatedTime(challenge.timeSpent);

  const handleSaveProof = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = proofInput.trim();
    localStorage.setItem(`abtalks_proof_${dayNum}`, trimmed);
    setUserProofUrl(trimmed);
    setIsEditingProof(false);
  };

  const handleMarkComplete = () => {
    if (challenge.status !== "current" || !canMarkComplete) return;
    setCompletionPulse(true);
    setTimeout(() => setCompletionPulse(false), 1600);
    setCurrentDay(Math.min(MAX_DAY, currentDay + 1));
  };

  const nextDayNum = dayNum + 1;
  const prevDayNum = dayNum - 1;
  const nextDayUnlocked = nextDayNum <= currentDay;
  const prevDayUnlocked = prevDayNum >= MIN_DAY;

  return (
    <div className="day-page-root">
      <nav className="day-navbar">
        <div className="landing-container" style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <Link to="/" className="nav-logo-link">
            <div className="logo-symbol">AB</div>
            <span>abtalks</span>
          </Link>
          <Link to="/dashboard" className="nav-item">Dashboard</Link>
        </div>
      </nav>

      <main className="landing-container">
        <div className="breadcrumb-nav">
          <Link to="/dashboard" className="btn-back-dashboard">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        <section className="day-header-section">
          <div className="day-header-meta">
            <span className="day-number-badge">Day {challenge.dayNum}</span>
            <span className={`status-badge ${challenge.status}`}>
              {challenge.status}
            </span>
          </div>
          <h1 className="day-title">{challenge.title}</h1>
          <p className="day-description">{challenge.description}</p>
          <div className="day-tech-tags">
            {challenge.techStack.map((tech) => (
              <span key={tech} className="day-tech-tag">{tech}</span>
            ))}
          </div>
        </section>

        {challenge.status === "locked" ? (
          <div className="locked-shield-overlay">
            <div className="locked-shield-icon"><Lock size={24} /></div>
            <h3 className="locked-shield-title">Challenge Locked</h3>
            <p className="locked-shield-desc">Complete previous days to unlock this milestone.</p>
            <Link to={`/day/${currentDay}`} className="btn-back-dashboard" style={{ marginTop: "16px" }}>
              Go to Day {currentDay}
            </Link>
          </div>
        ) : (
          <div className="day-grid">
            <div className="day-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 className="day-card-header" style={{ margin: 0 }}>Deliverables</h2>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
                  {completedTasksCount} of {challenge.tasks.length} completed ({Math.round(progressPercent)}%)
                </span>
              </div>

              <div className="day-task-progress-bar">
                <div className="day-task-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>

              {challenge.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className={`deliverable-card ${checkedTasks[idx] ? "checked" : ""}`}
                  onClick={() => toggleTask(idx)}
                >
                  <div className="checklist-checkbox">
                    {checkedTasks[idx] && <Check size={12} />}
                  </div>
                  <span>{task}</span>
                </div>
              ))}

              {challenge.status === "current" && (
                <button
                  onClick={handleMarkComplete}
                  disabled={!canMarkComplete}
                  className={`day-complete-button ${canMarkComplete ? "ready" : ""} ${completionPulse ? "pulse" : ""}`}
                  style={{
                    width: "100%",
                    marginTop: "24px",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: canMarkComplete ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease"
                  }}
                >
                  {canMarkComplete
                    ? "Mark Complete"
                    : "Complete all tasks to unlock Mark Complete"}
                </button>
              )}

              {challenge.status === "completed" && (
                <div
                  style={{
                    width: "100%",
                    marginTop: "24px",
                    padding: "14px",
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    color: "#10b981",
                    fontWeight: 600,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  <Check size={16} /> Completed
                </div>
              )}
            </div>

            <div className="day-card">
              <h2 className="day-card-header">Context</h2>

              {challenge.timeSpent && (
                <div className="metric-row-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div className={`metric-circle-icon ${timerActive ? "pulse" : ""}`}>
                        <Clock size={20} />
                      </div>
                      <div className="metric-data">
                        <span className="metric-value">{formatTime(timerSeconds)}</span>
                        <span className="metric-label">Active Focus Timer</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button
                        onClick={toggleTimer}
                        style={{
                          background: timerActive ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                          border: timerActive ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(16, 185, 129, 0.2)",
                          color: timerActive ? "#ef4444" : "#10b981",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          minWidth: "70px"
                        }}
                      >
                        {timerActive ? "Pause" : "Start"}
                      </button>
                      <button
                        onClick={resetTimer}
                        style={{
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-secondary)",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          minWidth: "70px"
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {estimatedMinutes > 0 && (
                    <div style={{ marginTop: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                        <span>Progress to Target ({challenge.timeSpent})</span>
                        <span>{Math.min(100, Math.round((timerSeconds / 60 / estimatedMinutes) * 100))}%</span>
                      </div>
                      <div className="day-task-progress-bar" style={{ height: "4px", margin: 0 }}>
                        <div
                          className="day-task-progress-fill"
                          style={{
                            width: `${Math.min(100, (timerSeconds / 60 / estimatedMinutes) * 100)}%`,
                            background: timerSeconds / 60 >= estimatedMinutes ? "#10b981" : "var(--accent-indigo)"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pow-card">
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px", color: "var(--text-primary)" }}>
                  Proof of Work
                </h3>
                {isEditingProof || !userProofUrl ? (
                  <form onSubmit={handleSaveProof} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div>
                      <input
                        type="text"
                        value={proofInput}
                        onChange={(e) => setProofInput(e.target.value)}
                        placeholder="github.com/your-username/repo"
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-primary)",
                          fontSize: "13px",
                          outline: "none",
                          transition: "border-color 0.2s"
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="submit"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: "8px",
                          background: "var(--accent-indigo)",
                          border: "none",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Save Proof
                      </button>
                      {userProofUrl && (
                        <button
                          type="button"
                          onClick={() => setIsEditingProof(false)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "8px",
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid var(--border-color)",
                            color: "var(--text-secondary)",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="proof-dispatched-box" style={{ padding: "16px", textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span className="proof-dispatched-header" style={{ margin: 0, gap: "6px" }}>
                        <Check size={14} /> Proof Dispatched
                      </span>
                      <button
                        onClick={() => {
                          setProofInput(userProofUrl);
                          setIsEditingProof(true);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          fontSize: "11px",
                          cursor: "pointer",
                          textDecoration: "underline"
                        }}
                      >
                        Edit
                      </button>
                    </div>
                    <a
                      href={userProofUrl.startsWith("http") ? userProofUrl : `https://${userProofUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="proof-dispatched-url"
                      style={{ display: "flex", width: "100%", justifyContent: "space-between", boxSizing: "border-box" }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {userProofUrl}
                      </span>
                      <ExternalLink size={12} style={{ flexShrink: 0 }} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <section className="sequence-nav-section">
          {prevDayUnlocked ? (
            <Link to={`/day/${prevDayNum}`} className="btn-sequence-nav prev">
              <span className="sequence-nav-day"><ArrowLeft size={14} /> Day {prevDayNum}</span>
            </Link>
          ) : (
            <div className="btn-sequence-nav prev disabled">
              <span className="sequence-nav-day"><ArrowLeft size={14} /> None</span>
            </div>
          )}

          {nextDayNum <= MAX_DAY && nextDayUnlocked ? (
            <Link to={`/day/${nextDayNum}`} className="btn-sequence-nav next">
              <span className="sequence-nav-day">Day {nextDayNum} <ArrowRight size={14} /></span>
            </Link>
          ) : dayNum === MAX_DAY ? (
            <div className="btn-sequence-nav next" style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#10b981", cursor: "default" }}>
              <span className="sequence-nav-day">Challenge Complete!</span>
            </div>
          ) : (
            <div className="btn-sequence-nav next disabled">
              <span className="sequence-nav-day">
                {nextDayNum > MAX_DAY ? "None" : `Day ${nextDayNum}`} <ArrowRight size={14} />
              </span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
