/*
  Marks page script.
  Handles faculty marks upload, student marks table, and radar visualization.
*/
let marksRadarChart;

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

function renderRadar(labels, values) {
  const canvas = document.getElementById("marksRadarChart");
  if (!canvas || !window.Chart) return;

  if (marksRadarChart) marksRadarChart.destroy();

  marksRadarChart = new Chart(canvas, {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "Total Marks",
          data: values,
          backgroundColor: "rgba(30, 94, 232, 0.2)",
          borderColor: "rgba(30, 94, 232, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}

async function loadStudentsAndSubjects() {
  const users = await fetchJson(`${API_BASE_URL}/users/`, {}, []);
  const studentSelect = document.getElementById("marksStudent");
  const subjectSelect = document.getElementById("marksSubject");

  studentSelect.innerHTML = "";
  subjectSelect.innerHTML = "";

  const students = Array.isArray(users) ? users.filter((u) => u.role === "student") : [];
  students.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = student.full_name || student.username;
    studentSelect.appendChild(option);
  });

  const averageData = await fetchJson(`${API_BASE_URL}/marks/average/`, {}, { subjects: [] });
  if (averageData.subjects?.length) {
    averageData.subjects.forEach((subject) => {
      const option = document.createElement("option");
      option.value = subject.subject_id;
      option.textContent = `${subject.subject_code} - ${subject.subject_name}`;
      subjectSelect.appendChild(option);
    });
  } else {
    subjectSelect.innerHTML = '<option value="1">Subject ID 1</option>';
  }
}

async function uploadMarks(event) {
  event.preventDefault();
  const message = document.getElementById("marksFacultyMessage");

  const payload = {
    student: Number(document.getElementById("marksStudent").value),
    subject: Number(document.getElementById("marksSubject").value),
    internal_marks: Number(document.getElementById("internalMarks").value),
    assignment_marks: Number(document.getElementById("assignmentMarks").value),
    lab_marks: Number(document.getElementById("labMarks").value),
  };

  const result = await fetchJson(
    `${API_BASE_URL}/marks/upload/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    null,
  );

  message.textContent = result ? "Marks uploaded successfully." : "Failed to upload marks.";
}

async function loadStudentMarks(studentId) {
  const tbody = document.getElementById("marksRows");
  const message = document.getElementById("marksStudentMessage");
  const data = await fetchJson(`${API_BASE_URL}/marks/student/${studentId}/`, {}, { records: [] });

  tbody.innerHTML = "";
  if (!data.records?.length) {
    tbody.innerHTML = '<tr><td colspan="5">No marks found.</td></tr>';
    renderRadar(["No Data"], [0]);
    return;
  }

  const labels = [];
  const values = [];

  data.records.forEach((row) => {
    labels.push(row.subject_code || "Subject");
    values.push(Number(row.total_marks || 0));
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.subject_code || "-"}</td>
      <td>${row.internal_marks}</td>
      <td>${row.assignment_marks}</td>
      <td>${row.lab_marks}</td>
      <td>${row.total_marks}</td>
    `;
    tbody.appendChild(tr);
  });

  message.textContent = `Loaded ${data.records.length} subject records.`;
  renderRadar(labels, values);
}

document.addEventListener("DOMContentLoaded", async () => {
  const role = getUserRole();
  const userId = localStorage.getItem("userId");

  const facultyPanel = document.getElementById("facultyMarksPanel");
  if (role === "faculty" || role === "admin") {
    facultyPanel.classList.remove("hidden");
    await loadStudentsAndSubjects();
    document.getElementById("marksUploadForm")?.addEventListener("submit", uploadMarks);
  }

  if (userId) {
    await loadStudentMarks(userId);
  } else {
    renderRadar(["No User"], [0]);
  }
});
