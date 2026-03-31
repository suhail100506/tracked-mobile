/*
  Reports page script.
  Loads report previews and triggers PDF/Excel downloads using format params.
*/
let currentReportType = "student";
let currentReportId = "";

async function fetchJson(url, fallback = null) {
  try {
    const response = await fetch(url, { headers: getAuthHeaders() });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    return data;
  } catch (error) {
    return fallback;
  }
}

function renderPreview(data) {
  const tbody = document.getElementById("reportPreviewRows");
  tbody.innerHTML = "";

  if (!data || typeof data !== "object") {
    tbody.innerHTML = '<tr><td colspan="2">No data found.</td></tr>';
    return;
  }

  // Render flattened top-level preview for readable report metadata.
  Object.entries(data).forEach(([key, value]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${key}</td>
      <td>${typeof value === "object" ? JSON.stringify(value).slice(0, 180) : value}</td>
    `;
    tbody.appendChild(row);
  });
}

function buildBaseEndpoint(type, id) {
  if (type === "student") return `${API_BASE_URL}/reports/student/${id}/`;
  if (type === "faculty") return `${API_BASE_URL}/reports/faculty/${id}/`;
  return `${API_BASE_URL}/reports/department/`;
}

async function loadPreview() {
  const type = document.getElementById("reportType").value;
  const id = document.getElementById("reportSearch").value.trim();
  const message = document.getElementById("reportMessage");

  currentReportType = type;
  currentReportId = id;

  if ((type === "student" || type === "faculty") && !id) {
    message.textContent = "Please enter a valid numeric ID for selected report type.";
    return;
  }

  const endpoint = buildBaseEndpoint(type, id);
  const data = await fetchJson(endpoint, null);

  if (!data) {
    message.textContent = "Unable to load report preview.";
    renderPreview(null);
    return;
  }

  message.textContent = "Preview loaded successfully.";
  renderPreview(data);
}

function downloadReport(format) {
  const message = document.getElementById("reportMessage");

  if ((currentReportType === "student" || currentReportType === "faculty") && !currentReportId) {
    message.textContent = "Load a report preview with a valid ID first.";
    return;
  }

  // For student reports, backend supports format param. Faculty/department preview is JSON.
  if (currentReportType !== "student") {
    message.textContent = "PDF/Excel export is currently available for student reports in backend endpoints.";
    return;
  }

  const endpoint = `${API_BASE_URL}/reports/student/${currentReportId}/?format=${format}`;
  window.open(endpoint, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loadReportBtn")?.addEventListener("click", loadPreview);
  document.getElementById("pdfReportBtn")?.addEventListener("click", () => downloadReport("pdf"));
  document.getElementById("excelReportBtn")?.addEventListener("click", () => downloadReport("excel"));
});
