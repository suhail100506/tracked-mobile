/*
  Analytics page script.
  Fetches data from analytics endpoints and renders four Chart.js visualizations.
*/
let correlationChart;
let topPerformersChart;
let riskChart;
let departmentChart;

async function fetchJson(url, fallback) {
  try {
    const response = await fetch(url, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error("Request failed");
    return data;
  } catch (error) {
    return fallback;
  }
}

function buildChart(instanceRef, canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return null;
  if (instanceRef) instanceRef.destroy();
  return new Chart(canvas, config);
}

document.addEventListener("DOMContentLoaded", async () => {
  const correlation = await fetchJson(`${API_BASE_URL}/analytics/correlation/`, { correlation_data: [] });
  const toppers = await fetchJson(`${API_BASE_URL}/analytics/top-performers/`, { top_performers: [] });
  const risk = await fetchJson(`${API_BASE_URL}/analytics/at-risk/`, { at_risk_students: [] });
  const dept = await fetchJson(`${API_BASE_URL}/analytics/department-summary/`, { department_summary: [] });

  const points = (correlation.correlation_data || []).map((row) => ({ x: row.attendance_percentage || 0, y: row.total_marks || 0 }));
  correlationChart = buildChart(correlationChart, "correlationChart", {
    type: "scatter",
    data: {
      datasets: [{
        label: "Attendance vs Marks",
        data: points,
        backgroundColor: "rgba(30, 94, 232, 0.6)",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: "Attendance %" } },
        y: { title: { display: true, text: "Total Marks" } },
      },
    },
  });

  topPerformersChart = buildChart(topPerformersChart, "topPerformersChart", {
    type: "bar",
    data: {
      labels: (toppers.top_performers || []).map((row) => row.student_name),
      datasets: [{
        label: "Total Marks",
        data: (toppers.top_performers || []).map((row) => row.total_marks || 0),
        backgroundColor: "rgba(21, 72, 184, 0.75)",
      }],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  const atRiskCount = risk.at_risk_students?.length || 0;
  const safeCount = Math.max((correlation.correlation_data?.length || 0) - atRiskCount, 0);
  riskChart = buildChart(riskChart, "riskChart", {
    type: "doughnut",
    data: {
      labels: ["At-Risk", "Safe"],
      datasets: [{
        data: [atRiskCount, safeCount],
        backgroundColor: ["rgba(203, 45, 79, 0.8)", "rgba(25, 135, 84, 0.8)"],
      }],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  departmentChart = buildChart(departmentChart, "departmentChart", {
    type: "bar",
    data: {
      labels: (dept.department_summary || []).map((row) => row.department || "N/A"),
      datasets: [{
        label: "Average Marks",
        data: (dept.department_summary || []).map((row) => row.average_marks || 0),
        backgroundColor: "rgba(30, 94, 232, 0.55)",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
