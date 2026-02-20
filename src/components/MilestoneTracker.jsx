import React, { useEffect, useState } from 'react';

const DEFAULT_MILESTONES = [
  { project: 'AI Research', milestones: [
    { name: 'Proposal', done: true },
    { name: 'Experiment', done: false },
    { name: 'Paper', done: false },
  ]},
  { project: 'Quantum Computing', milestones: [
    { name: 'Literature Review', done: true },
    { name: 'Simulation', done: false },
  ]},
];

function getMilestones() {
  const raw = localStorage.getItem('milestones');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('milestones', JSON.stringify(DEFAULT_MILESTONES));
  return DEFAULT_MILESTONES;
}
function setMilestonesLS(ms) {
  localStorage.setItem('milestones', JSON.stringify(ms));
}

const MilestoneTracker = () => {
  const [milestones, setMilestones] = useState(getMilestones());

  useEffect(() => {
    const interval = setInterval(() => {
      setMilestones(getMilestones());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMilestone = (projIdx, msIdx) => {
    const updated = milestones.map((proj, pIdx) =>
      pIdx === projIdx ? {
        ...proj,
        milestones: proj.milestones.map((ms, mIdx) =>
          mIdx === msIdx ? { ...ms, done: !ms.done } : ms
        )
      } : proj
    );
    setMilestonesLS(updated);
    setMilestones(updated);
  };

  return (
    <div className="milestone-tracker">
      <h3>Milestones</h3>
      {milestones.map((proj, projIdx) => (
        <div key={proj.project}>
          <strong>{proj.project}</strong>
          <ul>
            {proj.milestones.map((ms, msIdx) => (
              <li key={ms.name}>
                <label>
                  <input
                    type="checkbox"
                    checked={ms.done}
                    onChange={() => toggleMilestone(projIdx, msIdx)}
                  />
                  {ms.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MilestoneTracker;
