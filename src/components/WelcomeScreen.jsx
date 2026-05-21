import { useState } from "react";
import BrandLayout from "./BrandLayout";
import Leaderboard from "./Leaderboard";
import { registerAttendee } from "../utils/leaderboard";

/* ── Department lists ─────────────────────────────────────────────────────── */
const STUDENT_DEPARTMENTS = [
  "Physics Cycle (1st Year)",
  "Chemistry Cycle (1st Year)",
  "Maths (1st Year)",
  "Computer Science & Engineering (CSE)",
  "Information Science & Engineering (ISE)",
  "Artificial Intelligence & Machine Learning (AIML)",
  "Data Science (DS)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Other",
];

const FACULTY_DEPARTMENTS = [
  "Department of Computer Science & Engineering",
  "Department of Information Science & Engineering",
  "Department of AI & Machine Learning",
  "Department of Data Science",
  "Department of Electronics & Communication Engineering",
  "Department of Electrical & Electronics Engineering",
  "Department of Mechanical Engineering",
  "Department of Civil Engineering",
  "Department of Mathematics",
  "Department of Physics",
  "Department of Chemistry",
  "Department of Management Studies (MBA)",
  "Other",
];

const DESIGNATIONS = [
  "Professor & Head of Department",
  "Associate Professor",
  "Assistant Professor",
  "Senior Assistant Professor",
  "Lecturer",
  "Lab Instructor / Technical Staff",
  "Administrative Staff",
  "Other",
];

/* ── Role selector card ───────────────────────────────────────────────────── */
function RoleCard({ selected, icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`role-card ${selected ? "role-card-active" : ""}`}
    >
      <span className="role-card-icon">{icon}</span>
      <span className="role-card-title">{title}</span>
      <span className="role-card-sub">{subtitle}</span>
      {selected && <span className="role-card-check">✓</span>}
    </button>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function WelcomeScreen({ onStart, onHome }) {
  const [role,        setRole]        = useState("");
  const [name,        setName]        = useState("");
  const [usn,         setUsn]         = useState("");
  const [designation, setDesignation] = useState("");
  const [department,  setDepartment]  = useState("");
  const [errors,      setErrors]      = useState({});

  function handleRoleSelect(r) {
    setRole(r);
    setUsn(""); setDesignation(""); setDepartment("");
    setErrors({});
  }

  function validate() {
    const e = {};
    if (!name.trim())  e.name = "Full name is required.";
    if (!department)   e.department = "Please select your department.";
    if (role === "student") {
      if (!usn.trim()) e.usn = "USN is required.";
      else if (!/^[0-9][A-Za-z]{2}[0-9]{2}[A-Za-z]{2}[0-9]{3}$/.test(usn.trim()))
        e.usn = "Enter a valid USN — e.g. 1DB23CS121";
    }
    if (role === "faculty") {
      if (!designation) e.designation = "Please select your designation.";
    }
    return e;
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const details = role === "student"
      ? { role, name: name.trim(), usn: usn.trim().toUpperCase(), department }
      : { role, name: name.trim(), department, designation };

    // Register attendee in the background — non-blocking
    registerAttendee(details);

    onStart(details);
  }

  const deptList = role === "faculty" ? FACULTY_DEPARTMENTS : STUDENT_DEPARTMENTS;

  return (
    <BrandLayout onHome={onHome}>
      <div className="flex flex-col items-center px-6 py-10 min-h-[calc(100vh-72px)]">
        <div className="w-full max-w-4xl space-y-8">

          {/* ── Event hero banner ─────────────────────────────────────────── */}
          <div className="text-center pt-2">
            <div className="inline-flex items-center gap-2 bg-[#e91e8c]/10 border border-[#e91e8c]/40 rounded-full px-4 py-1 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#e91e8c] animate-pulse" />
              <span className="text-[#e91e8c] text-sm font-bold tracking-widest uppercase">Live Event</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-2">
              Vignanotsava
            </h1>
            <p className="text-[#e91e8c] text-xl font-semibold mb-1">AWS Typing Challenge</p>
            <p className="text-[#8888aa] text-sm">
              AWS Student Builder Group · Don Bosco Institute of Technology
            </p>
          </div>

          {/* ── Registration card ─────────────────────────────────────────── */}
          <div className="brand-card brand-card-accent px-8 sm:px-12 py-10">

            <div className="flex items-center gap-3 mb-8">
              <img
                src="/AWS Student Builder Group_RGB_Icons_Single Bracket Smile_White.png"
                alt="" aria-hidden="true"
                className="h-10 w-10 object-contain flex-shrink-0"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">Participant Registration</h2>
                <p className="text-[#8888aa] text-sm mt-0.5">
                  You have <span className="text-[#e91e8c] font-bold">60 seconds</span> — type as fast and accurately as you can.
                </p>
              </div>
            </div>

            {/* Role selector */}
            <div className="mb-8">
              <p className="form-label mb-3">I am a…</p>
              <div className="grid grid-cols-2 gap-4">
                <RoleCard selected={role === "student"} icon="🎓" title="Student"
                  subtitle="Undergraduate / Postgraduate" onClick={() => handleRoleSelect("student")} />
                <RoleCard selected={role === "faculty"} icon="👨‍🏫" title="Faculty"
                  subtitle="Teaching / Administrative Staff" onClick={() => handleRoleSelect("faculty")} />
              </div>
            </div>

            {/* Dynamic form */}
            {role ? (
              <form onSubmit={handleSubmit} noValidate className="space-y-5 animate-fade-in">

                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input id="name" type="text" autoComplete="name" placeholder="e.g. Arjun Sharma"
                    value={name}
                    onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: "" })); }}
                    className={`brand-input brand-input-lg ${errors.name ? "error" : ""}`} />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>

                {/* Student: USN */}
                {role === "student" && (
                  <div>
                    <label htmlFor="usn" className="form-label">
                      USN <span className="text-sm font-normal text-[#8888aa]">University Seat Number</span>
                    </label>
                    <input id="usn" type="text" autoComplete="off" placeholder="e.g. 1DB23CS121"
                      value={usn} maxLength={10}
                      onChange={e => { setUsn(e.target.value.toUpperCase()); if (errors.usn) setErrors(p => ({ ...p, usn: "" })); }}
                      className={`brand-input brand-input-lg font-mono tracking-widest ${errors.usn ? "error" : ""}`} />
                    {errors.usn
                      ? <p className="form-error">{errors.usn}</p>
                      : <p className="form-hint">Format: <span className="font-mono text-[#8888aa]">1DB23CS121</span> · auto-uppercased</p>}
                  </div>
                )}

                {/* Faculty: Designation */}
                {role === "faculty" && (
                  <div>
                    <label htmlFor="designation" className="form-label">Designation</label>
                    <select id="designation" value={designation}
                      onChange={e => { setDesignation(e.target.value); if (errors.designation) setErrors(p => ({ ...p, designation: "" })); }}
                      className={`brand-input brand-input-lg ${errors.designation ? "error" : ""} ${!designation ? "text-[#8888aa]" : "text-white"}`}>
                      <option value="" disabled>Select your designation</option>
                      {DESIGNATIONS.map(d => <option key={d} value={d} className="bg-[#1a1a28] text-white">{d}</option>)}
                    </select>
                    {errors.designation && <p className="form-error">{errors.designation}</p>}
                  </div>
                )}

                {/* Department */}
                <div>
                  <label htmlFor="dept" className="form-label">Department</label>
                  <select id="dept" value={department}
                    onChange={e => { setDepartment(e.target.value); if (errors.department) setErrors(p => ({ ...p, department: "" })); }}
                    className={`brand-input brand-input-lg ${errors.department ? "error" : ""} ${!department ? "text-[#8888aa]" : "text-white"}`}>
                    <option value="" disabled>Select your department</option>
                    {deptList.map(d => <option key={d} value={d} className="bg-[#1a1a28] text-white">{d}</option>)}
                  </select>
                  {errors.department && <p className="form-error">{errors.department}</p>}
                </div>

                <button type="submit" className="btn-pink btn-lg w-full mt-2">
                  Register &amp; Continue →
                </button>
              </form>
            ) : (
              <p className="text-center text-[#555570] text-sm py-4">
                ↑ Select your role above to continue
              </p>
            )}

            <p className="mt-6 text-center text-sm text-[#555570]">
              Your score will be recorded on the live leaderboard.
            </p>
          </div>

          {/* ── Live Leaderboard — full width section ─────────────────────── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#2e2e45]" />
              <p className="text-[#8888aa] text-sm font-semibold uppercase tracking-widest whitespace-nowrap px-2">
                🏆 Live Leaderboard
              </p>
              <div className="flex-1 h-px bg-[#2e2e45]" />
            </div>
            <Leaderboard />
          </div>

        </div>
      </div>
    </BrandLayout>
  );
}
