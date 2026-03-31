/*
  Global authentication and session utility module.
  Exposes login/logout/token helpers and page-level redirect guards.
*/
const API_BASE_URL = "http://127.0.0.1:8000/api";

function getToken() {
  return localStorage.getItem("accessToken");
}

function getUserRole() {
  return localStorage.getItem("userRole") || "";
}

function getAuthHeaders(extraHeaders = {}) {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

async function login(payload) {
  const response = await fetch(`${API_BASE_URL}/users/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.detail || "Login failed.");
  }

  // Persist token and user metadata for session-aware rendering.
  localStorage.setItem("accessToken", data.access || "");
  localStorage.setItem("refreshToken", data.refresh || "");

  const normalizedRole = (payload.role || data?.user?.role || "student").toLowerCase();
  localStorage.setItem("userRole", normalizedRole);
  localStorage.setItem("userName", data?.user?.full_name || data?.user?.username || "User");
  localStorage.setItem("userId", String(data?.user?.id || ""));

  return data;
}

async function logout() {
  const refresh = localStorage.getItem("refreshToken");
  try {
    if (refresh) {
      await fetch(`${API_BASE_URL}/users/logout/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ refresh }),
      });
    }
  } catch (error) {
    // Clear local session even when API logout call fails.
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  localStorage.removeItem("userId");
  window.location.href = "index.html";
}

function redirectByRole(role) {
  // You can customize role-specific landing pages here.
  if (role === "faculty") {
    window.location.href = "dashboard.html";
    return;
  }
  if (role === "admin") {
    window.location.href = "dashboard.html";
    return;
  }
  window.location.href = "dashboard.html";
}

function applyRouteGuard() {
  const path = window.location.pathname.toLowerCase();
  const onLoginPage = path.endsWith("/index.html") || path.endsWith("/") || path.endsWith("frontend");
  const token = getToken();

  // Guard protected pages and auto-forward authenticated users away from login.
  if (!token && !onLoginPage) {
    window.location.href = "index.html";
    return;
  }

  if (token && onLoginPage) {
    redirectByRole(getUserRole());
  }
}

function bindAuthUi() {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const logoutBtn = document.getElementById("logoutBtn");

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const role = document.getElementById("role")?.value;
    const username = document.getElementById("username")?.value;
    const password = document.getElementById("password")?.value;

    loginMessage.textContent = "Signing in...";

    try {
      await login({ role, username, password });
      loginMessage.textContent = "Login successful. Redirecting...";
      redirectByRole((role || "student").toLowerCase());
    } catch (error) {
      loginMessage.textContent = error.message || "Login failed.";
    }
  });

  logoutBtn?.addEventListener("click", async () => {
    await logout();
  });
}

// Expose helpers globally for module scripts.
window.API_BASE_URL = API_BASE_URL;
window.getToken = getToken;
window.getUserRole = getUserRole;
window.getAuthHeaders = getAuthHeaders;
window.login = login;
window.logout = logout;

document.addEventListener("DOMContentLoaded", () => {
  applyRouteGuard();
  bindAuthUi();
});
