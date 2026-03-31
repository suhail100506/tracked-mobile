/*
  Activities page script.
  Supports student submissions, activity listing, and admin/faculty approval actions.
*/
async function fetchJson(url, options = {}, fallback = null) {
  try {
    const headers = options.isFormData ? getAuthHeaders({ "Content-Type": undefined }) : getAuthHeaders(options.headers || {});
    const response = await fetch(url, {
      headers,
      ...options,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    return data;
  } catch (error) {
    return fallback;
  }
}

function statusBadge(status) {
  if (status === "approved") return '<span class="badge badge-success">Approved</span>';
  if (status === "rejected") return '<span class="badge badge-danger">Rejected</span>';
  return '<span class="badge badge-warning">Pending</span>';
}

async function loadStudentActivities(studentId) {
  const tbody = document.getElementById("activityRows");
  const data = await fetchJson(`${API_BASE_URL}/activities/student/${studentId}/`, {}, { activities: [] });

  tbody.innerHTML = "";
  if (!data.activities?.length) {
    tbody.innerHTML = '<tr><td colspan="5">No activities available.</td></tr>';
    return;
  }

  data.activities.forEach((activity) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${activity.title}</td>
      <td>${activity.activity_type}</td>
      <td>${activity.date_of_activity}</td>
      <td>${statusBadge(activity.status)}</td>
      <td>${activity.points ?? 0}</td>
    `;
    tbody.appendChild(row);
  });
}

async function submitActivity(event) {
  event.preventDefault();
  const message = document.getElementById("activityStudentMessage");

  const formData = new FormData();
  formData.append("activity_type", document.getElementById("activityType").value);
  formData.append("title", document.getElementById("activityTitle").value);
  formData.append("description", document.getElementById("activityDescription").value);
  formData.append("date_of_activity", document.getElementById("activityDate").value);

  const file = document.getElementById("activityCertificate").files[0];
  if (file) formData.append("certificate", file);

  try {
    const response = await fetch(`${API_BASE_URL}/activities/add/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Submit failed.");
    }

    message.textContent = "Activity submitted successfully.";
    await loadStudentActivities(localStorage.getItem("userId"));
  } catch (error) {
    message.textContent = error.message || "Unable to submit activity.";
  }
}

async function loadPendingActivities() {
  const tbody = document.getElementById("pendingActivityRows");
  const data = await fetchJson(`${API_BASE_URL}/activities/pending/`, {}, { activities: [] });

  tbody.innerHTML = "";
  if (!data.activities?.length) {
    tbody.innerHTML = '<tr><td colspan="5">No pending activities.</td></tr>';
    return;
  }

  data.activities.forEach((activity) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${activity.student_name || activity.student}</td>
      <td>${activity.title}</td>
      <td>${activity.activity_type}</td>
      <td><input type="number" min="0" max="100" value="${activity.points ?? 0}" id="points-${activity.id}" /></td>
      <td class="btn-inline-group">
        <button class="btn btn-primary" type="button" data-action="approved" data-id="${activity.id}">Approve</button>
        <button class="btn btn-danger" type="button" data-action="rejected" data-id="${activity.id}">Reject</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  tbody.querySelectorAll("button[data-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const activityId = button.dataset.id;
      const action = button.dataset.action;
      const points = Number(document.getElementById(`points-${activityId}`).value || 0);
      const message = document.getElementById("activityAdminMessage");

      const result = await fetchJson(
        `${API_BASE_URL}/activities/approve/${activityId}/`,
        {
          method: "PUT",
          body: JSON.stringify({ status: action, points }),
        },
        null,
      );

      message.textContent = result ? `Activity ${action} successfully.` : "Failed to update activity.";
      await loadPendingActivities();
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const role = getUserRole();
  const userId = localStorage.getItem("userId");

  const studentPanel = document.getElementById("studentActivityPanel");
  const approvalPanel = document.getElementById("approvalPanel");

  if (role === "student") {
    studentPanel.classList.remove("hidden");
    document.getElementById("activityForm")?.addEventListener("submit", submitActivity);
  }

  if (role === "faculty" || role === "admin") {
    approvalPanel.classList.remove("hidden");
    await loadPendingActivities();
  }

  if (userId) {
    await loadStudentActivities(userId);
  }
});
