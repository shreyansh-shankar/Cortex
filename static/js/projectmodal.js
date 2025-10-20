// --- Modal Logic ---
const modal = document.getElementById("projectModal");
const cancelModal = document.getElementById("cancelModal");
const projectForm = document.getElementById("projectForm");
const addStatusBtn = document.getElementById("addStatusBtn");
const statusContainer = document.getElementById("statusContainer");

// Show modal
newProjectBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Hide modal
cancelModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  projectForm.reset();
});

// Add new status field
addStatusBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "New status";
  statusContainer.appendChild(input);
});

// Handle form submission
projectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("projectName").value.trim();
  const category = document.getElementById("projectCategory").value.trim();
  const tags = document.getElementById("projectTags").value
    .split(",")
    .map(t => t.trim())
    .filter(t => t);
  const status_types = Array.from(statusContainer.querySelectorAll("input"))
    .map(i => i.value.trim())
    .filter(i => i);

  if (!name) return alert("Project name is required!");

  const newProj = {
    project_id: crypto.randomUUID(),
    project_name: name,
    status_types,
    category: category || "General",
    tags,
    tasks: []
  };

  const tx = db.transaction("projects", "readwrite");
  const store = tx.objectStore("projects");
  store.add(newProj);

  tx.oncomplete = () => {
    loadProjects();
    modal.classList.add("hidden");
    projectForm.reset();
  };
});
