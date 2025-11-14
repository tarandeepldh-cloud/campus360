// Simple auth helpers: save, read, show username, and protect pages.

const LS_USER_KEY = "campus360_user";

function getUsername() {
  return localStorage.getItem(LS_USER_KEY);
}

function setUsername(name) {
  localStorage.setItem(LS_USER_KEY, name);
}

function clearUsername() {
  localStorage.removeItem(LS_USER_KEY);
}

function ensureAuth() {
  const user = getUsername();
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  const badge = document.getElementById("usernameBadge");
  if (badge) badge.textContent = user;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearUsername();
      window.location.href = "index.html";
    });
  }
}

// Called only on index.html
function setupLogin() {
  const form = document.getElementById("loginForm");
  const input = document.getElementById("username");
  const demoBtn = document.getElementById("demoBtn");

  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (input.value || "").trim();
    if (!name) {
      alert("Please enter a username.");
      input.focus();
      return;
    }
    setUsername(name);
    window.location.href = "dashboard.html";
  });

  if (demoBtn) {
    demoBtn.addEventListener("click", () => {
      setUsername("Demo User");
      window.location.href = "dashboard.html";
    });
  }
}
