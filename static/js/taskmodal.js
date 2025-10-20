// Get modal elements
const taskModal = document.createElement("div");
taskModal.className = "task-modal hidden";
taskModal.innerHTML = `
  <div class="task-modal-content">
    <h2>Create New Task</h2>
    <form id="taskForm">
      <label>
        Task Name
        <input type="text" id="taskName" placeholder="Enter task name" required>
      </label>

      <label>
        Status
        <select id="taskStatus"></select>
      </label>

      <label>
        Priority (0-5)
        <div class="priority-label">
          <div class="priority-dot priority-0" data-priority="0"></div>
          <div class="priority-dot priority-1" data-priority="1"></div>
          <div class="priority-dot priority-2" data-priority="2"></div>
          <div class="priority-dot priority-3" data-priority="3"></div>
          <div class="priority-dot priority-4" data-priority="4"></div>
          <div class="priority-dot priority-5" data-priority="5"></div>
        </div>
      </label>

      <label>
        Tags (comma separated)
        <input type="text" id="taskTags" placeholder="e.g. bug, frontend, urgent">
      </label>

      <div class="modal-actions">
        <button type="submit" class="btn-primary">Create</button>
        <button type="button" id="cancelTaskModal" class="btn-secondary">Cancel</button>
      </div>
    </form>
  </div>
`;
document.body.appendChild(taskModal);

let currentProject = null;
let selectedPriority = 0;

// Open task modal for a project
function openTaskModal(project, defaultStatus) {
  currentProject = project;
  selectedPriority = 0;
  taskModal.classList.remove("hidden");

  // Populate status dropdown
  const statusSelect = document.getElementById("taskStatus");
  statusSelect.innerHTML = "";
  project.status_types.forEach((s) => {
    const option = document.createElement("option");
    option.value = s;
    option.textContent = s;
    if (s === defaultStatus) option.selected = true;
    statusSelect.appendChild(option);
  });

  // Reset form fields
  document.getElementById("taskName").value = "";
  document.getElementById("taskTags").value = "";

  // Reset priority selection
  document.querySelectorAll(".priority-dot").forEach(dot => dot.classList.remove("selected"));
}

// Priority click handling
document.querySelectorAll(".priority-dot").forEach(dot => {
  dot.addEventListener("click", () => {
    selectedPriority = parseInt(dot.dataset.priority);
    document.querySelectorAll(".priority-dot").forEach(d => d.classList.remove("selected"));
    dot.classList.add("selected");
  });
});

// Cancel button
document.getElementById("cancelTaskModal").addEventListener("click", () => {
  taskModal.classList.add("hidden");
});

// Form submission
document.getElementById("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentProject) return;

  const title = document.getElementById("taskName").value.trim();
  if (!title) return;

  const status = document.getElementById("taskStatus").value;
  const tags = document.getElementById("taskTags").value.split(",").map(t => t.trim()).filter(t => t);
  
  const newTask = {
    task_id: crypto.randomUUID(),
    title,
    status,
    tags,
    priority: selectedPriority,
    subtasks: []
  };

  currentProject.tasks = currentProject.tasks || [];
  currentProject.tasks.push(newTask);

  // Save and re-render
  const tx = db.transaction("projects", "readwrite");
  const store = tx.objectStore("projects");
  store.put(currentProject);
  tx.oncomplete = () => {
    renderKanbanBoard(currentProject);
    taskModal.classList.add("hidden");
  };
});
