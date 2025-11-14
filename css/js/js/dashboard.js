// Dashboard logic: stats and marks chart via fetch with fallback.

const LS_EVENTS_KEY = "campus360_events";
const LS_LOST_KEY = "campus360_lostfound";

async function fetchMarks() {
  try {
    const res = await fetch("data/marks.json");
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    return data;
  } catch (err) {
    // Fallback sample
    return {
      attendance: 88,
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      marks: [72, 78, 81, 85, 88, 90]
    };
  }
}

function getCounts() {
  // Count events: sample loaded separately on events page, but here we count user-added + sample approximation
  const addedEvents = JSON.parse(localStorage.getItem(LS_EVENTS_KEY) || "[]");
  const addedLost = JSON.parse(localStorage.getItem(LS_LOST_KEY) || "[]");
  return {
    events: addedEvents.length, // shows your added count (simple and deterministic)
    lost: addedLost.length
  };
}

function renderStats(attendance, counts) {
  const attendanceEl = document.getElementById("attendanceStat");
  const eventsEl = document.getElementById("eventsCount");
  const lostEl = document.getElementById("lostCount");

  if (attendanceEl) attendanceEl.textContent = `${attendance}%`;
  if (eventsEl) eventsEl.textContent = counts.events;
  if (lostEl) lostEl.textContent = counts.lost;
}

function renderChart(labels, dataPoints) {
  const ctx = document.getElementById("marksChart");
  if (!ctx || !window.Chart) return;

  // Destroy existing chart if any
  if (ctx._chartInstance) {
    ctx._chartInstance.destroy();
  }

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Marks",
        data: dataPoints,
        borderColor: "#6c8cff",
        backgroundColor: "rgba(108, 140, 255, 0.15)",
        tension: 0.25,
        fill: true,
        pointBackgroundColor: "#22d3ee",
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true, suggestedMax: 100, grid: { color: "#252a4d" } },
        x: { grid: { color: "#252a4d" } }
      }
    }
  });

  // attach reference to allow cleanup
  ctx._chartInstance = chart;
}

export function initDashboard() {
  // No export in plain HTML environments, but function name is global
}

window.initDashboard = async function initDashboard() {
  const marksData = await fetchMarks();
  const counts = getCounts();

  renderStats(marksData.attendance ?? 85, counts);
  renderChart(marksData.months ?? [], marksData.marks ?? []);
};
