let db;
const projectList = document.getElementById("projectList");
const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const newProjectBtn = document.getElementById("newProjectBtn");

// Modal elements
const renameModal = document.getElementById("renameProjectModal");
const deleteModal = document.getElementById("deleteProjectModal");
const renameInput = document.getElementById("renameInput");
const renameConfirmBtn = document.getElementById("renameConfirmBtn");
const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");
const cancelRenameBtn = document.getElementById("cancelRenameBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

let projectToModify = null;

// Initialize IndexedDB
const request = indexedDB.open("ProjectsDB", 1);
request.onupgradeneeded = (e) => {
  db = e.target.result;
  if (!db.objectStoreNames.contains("projects")) {
    db.createObjectStore("projects", { keyPath: "project_id" });
  }
};

request.onsuccess = (e) => {
  db = e.target.result;
  loadProjects();
};

request.onerror = (e) => {
  console.error("Error opening IndexedDB:", e.target.error);
};

// Load projects
function loadProjects() {
  const tx = db.transaction("projects", "readonly");
  const store = tx.objectStore("projects");
  const req = store.getAll();
  req.onsuccess = () => displayProjects(req.result);
  req.onerror = () => console.error("Failed to load projects");
}

// Display sidebar list
function displayProjects(projects) {
  projectList.innerHTML = "";

  projects.forEach((proj) => {
    const container = document.createElement("div");
    container.className = "project-item";

    const btn = document.createElement("button");
    btn.className = "project-btn";
    btn.textContent = proj.project_name;
    btn.addEventListener("click", () => renderKanbanBoard(proj));

    // ⋮ menu button
    const menuBtn = document.createElement("button");
    menuBtn.className = "project-menu-btn";
    menuBtn.innerHTML = `<i class="fas fa-ellipsis-v"></i>`; // Font Awesome icon

    const menu = document.createElement("div");
    menu.className = "project-menu hidden";
    menu.innerHTML = `
      <button class="rename-btn">Rename</button>
      <button class="delete-btn">Delete</button>
    `;

    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllMenus();
      menu.classList.toggle("hidden");
    });

    // Rename
    menu.querySelector(".rename-btn").addEventListener("click", () => {
      projectToModify = proj;
      renameInput.value = proj.project_name;
      renameModal.classList.remove("hidden");
      menu.classList.add("hidden");
    });

    // Delete
    menu.querySelector(".delete-btn").addEventListener("click", () => {
      projectToModify = proj;
      deleteModal.classList.remove("hidden");
      menu.classList.add("hidden");
    });

    container.append(btn, menuBtn, menu);
    projectList.appendChild(container);
  });
}

function saveProject(project) {
  const tx = db.transaction("projects", "readwrite");
  const store = tx.objectStore("projects");
  store.put(project);
  tx.oncomplete = () => loadProjects();
}

function deleteProject(projectId) {
  const tx = db.transaction("projects", "readwrite");
  const store = tx.objectStore("projects");
  store.delete(projectId);
  tx.oncomplete = () => {
    loadProjects();
    document.getElementById("mainContent").innerHTML = `
      <h1>Your Projects</h1>
      <p>Select a project or create a new one to get started.</p>
    `;
  };
}

// Modal actions

// Rename confirm
renameConfirmBtn.addEventListener("click", () => {
  if (projectToModify && renameInput.value.trim()) {
    const newName = renameInput.value.trim();

    // 1️⃣ Instantly update sidebar button text
    const btn = [...document.querySelectorAll(".project-btn")]
      .find(b => b.textContent === projectToModify.project_name);
    if (btn) btn.textContent = newName;

    // 2️⃣ Update DB
    projectToModify.project_name = newName;
    saveProject(projectToModify);

    // 3️⃣ Close modal immediately
    renameModal.classList.add("hidden");
  }
});


cancelRenameBtn.addEventListener("click", () => renameModal.classList.add("hidden"));

deleteConfirmBtn.addEventListener("click", () => {
  if (projectToModify) {
    deleteProject(projectToModify.project_id);
    deleteModal.classList.add("hidden");
  }
});

cancelDeleteBtn.addEventListener("click", () => deleteModal.classList.add("hidden"));

document.addEventListener("click", () => closeAllMenus());
function closeAllMenus() {
  document.querySelectorAll(".project-menu").forEach((m) => m.classList.add("hidden"));
}

// Sidebar toggle
toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});
