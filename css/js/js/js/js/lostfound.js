// Lost & Found page: load sample via fetch, merge with local, add and persist.

const LS_LOST_KEY = "campus360_lostfound";

async function fetchSampleLost() {
  try {
    const res = await fetch("data/lostfound.json");
    if (!res.ok) throw new Error("Network error");
    return await res.json();
  } catch (err) {
    // Fallback sample
    return [
      { item: "Umbrella", location: "Auditorium" },
      { item: "ID Card", location: "Cafeteria" }
    ];
  }
}

function getUserLost() {
  return JSON.parse(localStorage.getItem(LS_LOST_KEY) || "[]");
}

function saveUserLost(items) {
  localStorage.setItem(LS_LOST_KEY, JSON.stringify(items));
}

function renderLost(list, target) {
  target.innerHTML = "";
  if (!list.length) {
    const li = document.createElement("li");
    li.className = "list-item";
    li.textContent = "No lost items reported.";
    target.appendChild(li);
    return;
  }
  for (const it of list) {
    const li = document.createElement("li");
    li.className = "list-item";
    const left = document.createElement("div");
    left.innerHTML = `<div class="item-title">${it.item}</div><div class="item-meta">${it.location}</div>`;
    const right = document.createElement("div");
    right.innerHTML = `<span class="badge">Lost</span>`;
    li.appendChild(left);
    li.appendChild(right);
    target.appendChild(li);
  }
}

function clearUserLost() {
  localStorage.removeItem(LS_LOST_KEY);
}

window.initLostFound = async function initLostFound() {
  const listEl = document.getElementById("lostList");
  const formEl = document.getElementById("lostForm");
  const itemEl = document.getElementById("lostItem");
  const locEl = document.getElementById("lostLocation");
  const clearBtn = document.getElementById("clearLostBtn");

  const sample = await fetchSampleLost();
  const user = getUserLost();
  let all = sample.concat(user);

  renderLost(all, listEl);

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const newItem = {
      item: (itemEl.value || "").trim(),
      location: (locEl.value || "").trim()
    };
    if (!newItem.item || !newItem.location) {
      alert("Please fill all fields.");
      return;
    }
    const currentUser = getUserLost();
    currentUser.push(newItem);
    saveUserLost(currentUser);

    all = sample.concat(currentUser);
    renderLost(all, listEl);

    formEl.reset();
    itemEl.focus();
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("Clear your added lost items? This cannot be undone.")) {
      clearUserLost();
      all = sample.slice();
      renderLost(all, listEl);
    }
  });
};
