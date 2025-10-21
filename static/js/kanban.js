// Make sure SortableJS is included in your HTML
// <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>

function renderKanbanBoard(project) {
  const main = document.getElementById("mainContent");
  main.innerHTML = ""; // clear previous content

  const board = document.createElement("div");
  board.className = "kanban-board";

  project.status_types.forEach((status) => {
    // Column container
    const column = document.createElement("div");
    column.className = "kanban-column";
    column.dataset.status = status;

    // Column header
    const header = document.createElement("div");
    header.className = "kanban-column-header";
    header.textContent = status;

    // Tasks container
    const taskContainer = document.createElement("div");
    taskContainer.className = "kanban-tasks";

    // Add existing tasks for this status
    (project.tasks || [])
      .filter((t) => t.status === status)
      .forEach((task) => {
        const taskCard = createTaskCard(task);
        taskContainer.appendChild(taskCard);
      });

    // Add new task button
    const addBtn = document.createElement("button");
    addBtn.className = "kanban-add-task";
    addBtn.textContent = "+ Add Task";
    addBtn.onclick = () => openTaskModal(project, status); // use modal instead of prompt

    // Append header, tasks, add button to column
    column.append(header, taskContainer, addBtn);
    board.appendChild(column);

    // Enable drag-and-drop using SortableJS
    Sortable.create(taskContainer, {
      group: "kanban",           // allow moving tasks between columns
      animation: 200,            // smooth animation
      ghostClass: "kanban-ghost",
      onAdd: (evt) => updateTaskStatus(evt, project),
      onEnd: (evt) => updateTaskStatus(evt, project)
    });
  });

  main.appendChild(board);
}

// --- Create a task card with priority and tags ---
function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "kanban-task";
  card.dataset.id = task.task_id;

  // Task title
  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.title;

  // Priority indicator
  const priority = document.createElement("div");
  priority.className = `task-priority priority-${task.priority || 0}`;

  // Tags container
  const tagsContainer = document.createElement("div");
  tagsContainer.className = "task-tags";
  if (task.tags && task.tags.length) {
    task.tags.forEach(tag => {
      const t = document.createElement("span");
      t.className = "task-tag";
      t.textContent = tag;
      tagsContainer.appendChild(t);
    });
  }

  // Make the task card clickable
  card.addEventListener("click", (e) => {
    window.open(`/task?taskId=${task.task_id}`, "_blank");
  });

  card.append(title, priority, tagsContainer);
  return card;
}

// --- Update task status after drag & drop ---
function updateTaskStatus(evt, project) {
  const taskId = evt.item.dataset.id;
  const newColumn = evt.to.closest(".kanban-column");
  if (!newColumn) return;
  const newStatus = newColumn.dataset.status;

  const task = project.tasks.find(t => t.task_id === taskId);
  if (task) {
    task.status = newStatus;
    saveProject(project);
  }
}

// --- Save project changes to IndexedDB ---
function saveProject(project) {
  const tx = db.transaction("projects", "readwrite");
  const store = tx.objectStore("projects");
  store.put(project);
  tx.oncomplete = () => console.log("Project saved");
}
