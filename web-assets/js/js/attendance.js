/*
  Attendance page script.
  Supports faculty bulk marking, student percentage view, and chart rendering.
*/
let attendanceChart;

function statusBadge(percentage) {
  if (percentage < 75) return '<span class="badge badge-danger">Shortage</span>';
  if (percentage < 85) return '<span class="badge badge-warning">Monitor</span>';
  return '<span class="badge badge-success">Good</span>';
}

async function fetchJson(url, options = {}, fallback = null) {
  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(options.headers || {}),
      ...options,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    return data;
  } catch (error) {
    return fallback;
  }
}

function renderAttendanceChart(labels, values) {
  const ctx = document.getElementById("attendanceChart");
  if (!ctx || !window.Chart) return;

  if (attendanceChart) attendanceChart.destroy();

  attendanceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Attendance %",
          data: values,
          backgroundColor: "rgba(30, 94, 232, 0.45)",
          borderColor: "rgba(30, 94, 232, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

async function loadSubjects() {
  const subjectSelect = document.getElementById("attendanceSubject");
  const classAverage = await fetchJson(`${API_BASE_URL}/marks/average/`, {}, { subjects: [] });

  subjectSelect.innerHTML = "";
  if (!classAverage.subjects?.length) {
    subjectSelect.innerHTML = '<option value="1">Subject ID 1</option>';
    return;
  }

  classAverage.subjects.forEach((subject) => {
    const option = document.createElement("option");
    option.value = subject.subject_id;
    option.textContent = `${subject.subject_code} - ${subject.subject_name}`;
    subjectSelect.appendChild(option);
  });
}

async function loadStudentsForFaculty() {
  const tbody = document.getElementById("facultyAttendanceRows");
  const users = await fetchJson(`${API_BASE_URL}/users/`, {}, []);
  const students = Array.isArray(users) ? users.filter((u) => u.role === "student") : [];

  tbody.innerHTML = "";
  if (!students.length) {
    tbody.innerHTML = '<tr><td colspan="3">No students found.</td></tr>';
    return;
  }

  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.full_name || student.username}</td>
      <td>${student.department || "-"}</td>
      <td>
        <select data-student-id="${student.id}" class="attendance-status-select">
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
        </select>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function submitFacultyAttendance() {
  const subjectId = document.getElementById("attendanceSubject").value;
  const date = document.getElementById("attendanceDate").value;
  const message = document.getElementById("attendanceFacultyMessage");
  const selections = document.querySelectorAll(".attendance-status-select");

  if (!subjectId || !date || !selections.length) {
    message.textContent = "Please load students and choose date/subject.";
    return;
  }

  const records = Array.from(selections).map((select) => ({
    student: Number(select.dataset.studentId),
    subject: Number(subjectId),
    date,
    status: select.value,
  }));

  const result = await fetchJson(
    `${API_BASE_URL}/attendance/mark/`,
    {
      method: "POST",
      body: JSON.stringify({ records }),
    },
    null,
  );

  message.textContent = result ? `Attendance submitted for ${result.count || records.length} students.` : "Failed to submit attendance.";
}

async function loadStudentAttendance(studentId) {
  const data = await fetchJson(`${API_BASE_URL}/attendance/percentage/${studentId}/`, {}, { percentages: [] });
  const tbody = document.getElementById("studentAttendanceRows");
  const message = document.getElementById("attendanceStudentMessage");

  tbody.innerHTML = "";

  if (!data.percentages?.length) {
    message.textContent = "No attendance percentage data available.";
    renderAttendanceChart(["No Data"], [0]);
    return;
  }

  const labels = [];
  const values = [];

  data.percentages.forEach((row) => {
    labels.push(row.subject_code || row.subject_name);
    values.push(Number(row.attendance_percentage || 0));
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.subject_name || row.subject_code}</td>
      <td>${row.attendance_percentage}%</td>
      <td>${statusBadge(Number(row.attendance_percentage || 0))}</td>
    `;
    tbody.appendChild(tr);
  });

  message.textContent = "";
  renderAttendanceChart(labels, values);
}

document.addEventListener("DOMContentLoaded", async () => {
  const role = getUserRole();
  const userId = localStorage.getItem("userId");

  const facultyPanel = document.getElementById("facultyAttendancePanel");
  const studentPanel = document.getElementById("studentAttendancePanel");

  // Default date is today for faster faculty marking workflow.
  document.getElementById("attendanceDate").valueAsDate = new Date();

  if (role === "faculty" || role === "admin") {
    facultyPanel.classList.remove("hidden");
    await loadSubjects();
    await loadStudentsForFaculty();
    renderAttendanceChart(["Pending"], [0]);
  }

  if (role === "student" && userId) {
    studentPanel.classList.remove("hidden");
    await loadStudentAttendance(userId);
  }

  document.getElementById("loadStudentsBtn")?.addEventListener("click", loadStudentsForFaculty);
  document.getElementById("submitAttendanceBtn")?.addEventListener("click", submitFacultyAttendance);
});
