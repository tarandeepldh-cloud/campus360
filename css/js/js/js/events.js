// Events page: load sample via fetch, merge with local, add and persist.

const LS_EVENTS_KEY = "campus360_events";

async function fetchSampleEvents() {
  try {
    const res = await fetch("data/events.json");
    if (!res.ok) throw new Error("Network error");
    return await res.json();
  } catch (err) {
    // Fallback sample
    return [
      { title: "Orientation", date: "2025-07-15", club: "Student Council" },
      { title: "Hackathon", date: "2025-08-02", club: "Coding Club" }
    ];
  }
}

function getUserEvents() {
  return JSON.parse(localStorage.getItem(LS_EVENTS_KEY) || "[]");
}

function saveUserEvents(events) {
  localStorage.setItem(LS_EVENTS_KEY, JSON.stringify(events));
}

function renderEvents(list, target) {
  target.innerHTML = "";
  const sorted = list.slice().sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  if (!sorted.length) {
    const li = document.createElement("li");
    li.className = "list-item";
    li.textContent = "No events yet.";
    target.appendChild(li);
    return;
  }
  for (const e of sorted) {
    const li = document.createElement("li");
    li.className = "list-item";
    const left = document.createElement("div");
    left.innerHTML = `<div class="item-title">${e.title}</div><div class="item-meta">${e.date} • ${e.club}</div>`;
    const right = document.createElement("div");
    right.innerHTML = `<span class="badge">Event</span>`;
    li.appendChild(left);
    li.appendChild(right);
    target.appendChild(li);
  }
}

function clearUserEvents() {
  localStorage.removeItem(LS_EVENTS_KEY);
}

window.initEvents = async function initEvents() {
  const listEl = document.getElementById("eventsList");
  const formEl = document.getElementById("eventForm");
  const titleEl = document.getElementById("eventTitle");
  const dateEl = document.getElementById("eventDate");
  const clubEl = document.getElementById("eventClub");
  const clearBtn = document.getElementById("clearEventsBtn");

  const sample = await fetchSampleEvents();
  const user = getUserEvents();
  let all = sample.concat(user);

  renderEvents(all, listEl);

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const newEvent = {
      title: (titleEl.value || "").trim(),
      date: dateEl.value,
      club: (clubEl.value || "").trim()
    };
    if (!newEvent.title || !newEvent.date || !newEvent.club) {
      alert("Please fill all fields.");
      return;
    }
    const currentUser = getUserEvents();
    currentUser.push(newEvent);
    saveUserEvents(currentUser);

    // Update list immediately (sample + user)
    all = sample.concat(currentUser);
    renderEvents(all, listEl);

    formEl.reset();
    titleEl.focus();
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("Clear your added events? This cannot be undone.")) {
      clearUserEvents();
      all = sample.slice();
      renderEvents(all, listEl);
    }
  });
};
