/*
  Dashboard script.
  Loads summary stats and renders role-aware widgets.
*/
async function fetchJson(url, fallback = null) {
  try {
    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("API unavailable");
    return await response.json();
  } catch (error) {
    return fallback;
  }
}

function applyRoleNav(role) {
  const links = document.querySelectorAll("#dashboardNav .nav-link");
  links.forEach((link) => {
    const allowedRoles = (link.dataset.role || "").split(",");
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      link.classList.add("hidden");
    }
  });
}

function renderWidgets(role, data) {
  const widgetContainer = document.getElementById("dashboardWidgets");
  if (!widgetContainer) return;

  if (role === "student") {
    widgetContainer.innerHTML = `
      <article class="card"><h3 class="mt-0">My Attendance</h3><p class="muted">${data.myAttendance}% overall attendance</p></article>
      <article class="card"><h3 class="mt-0">My Performance</h3><p class="muted">${data.myMarks} total marks score</p></article>
    `;
    return;
  }

  widgetContainer.innerHTML = `
    <article class="card"><h3 class="mt-0">Department Summary</h3><p class="muted">${data.departments} departments tracked</p></article>
    <article class="card"><h3 class="mt-0">Monitoring Note</h3><p class="muted">${data.note}</p></article>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  const role = getUserRole() || "student";
  const userName = localStorage.getItem("userName") || "User";
  const userId = localStorage.getItem("userId");

  document.getElementById("roleInfo").textContent = `Signed in as ${role}`;
  document.getElementById("topUserName").textContent = userName;
  document.getElementById("sidebarUserName").textContent = userName;
  document.getElementById("sidebarRole").textContent = role;

  applyRoleNav(role);

  const shortage = await fetchJson(`${API_BASE_URL}/attendance/shortage/`, { count: 0, students: [] });
  const pendingActivities = await fetchJson(`${API_BASE_URL}/activities/pending/`, { count: 0, activities: [] });
  const riskData = await fetchJson(`${API_BASE_URL}/analytics/at-risk/`, { at_risk_students: [] });
  const deptSummary = await fetchJson(`${API_BASE_URL}/analytics/department-summary/`, { department_summary: [] });
  const userList = await fetchJson(`${API_BASE_URL}/users/`, []);

  let totalStudents = Array.isArray(userList) ? userList.filter((u) => u.role === "student").length : 0;
  if (!totalStudents) {
    totalStudents = deptSummary.department_summary?.reduce((sum, row) => sum + (row.student_count || 0), 0) || 0;
  }

  const atRiskCount = riskData.at_risk_students?.length || 0;
  const attendancePercent = totalStudents
    ? Math.max(0, (1 - atRiskCount / totalStudents) * 100).toFixed(1)
    : "0.0";

  document.getElementById("statStudents").textContent = String(totalStudents || "0");
  document.getElementById("statAttendance").textContent = `${attendancePercent}%`;
  document.getElementById("statPendingActivities").textContent = String(pendingActivities.count || 0);
  document.getElementById("statAtRisk").textContent = String(atRiskCount);

  // Student-specific lightweight insight.
  let myAttendance = 0;
  let myMarks = 0;
  if (role === "student" && userId) {
    const myPercentages = await fetchJson(`${API_BASE_URL}/attendance/percentage/${userId}/`, { percentages: [] });
    const myMarksRows = await fetchJson(`${API_BASE_URL}/marks/student/${userId}/`, { records: [] });

    if (myPercentages.percentages?.length) {
      const total = myPercentages.percentages.reduce((sum, item) => sum + (item.attendance_percentage || 0), 0);
      myAttendance = (total / myPercentages.percentages.length).toFixed(1);
    }

    myMarks = myMarksRows.records?.reduce((sum, row) => sum + Number(row.total_marks || 0), 0).toFixed(2) || "0.00";
  }

  renderWidgets(role, {
    myAttendance,
    myMarks,
    departments: deptSummary.department_summary?.length || 0,
    note: shortage.count ? `${shortage.count} students are below attendance threshold.` : "No active shortage alerts.",
  });
});
