let db;
const projectList = document.getElementById("projectList");
const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");
const newProjectBtn = document.getElementById("newProjectBtn");

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

// Load projects from DB
function loadProjects() {
  const tx = db.transaction("projects", "readonly");
  const store = tx.objectStore("projects");
  const req = store.getAll();
  req.onsuccess = () => {
    displayProjects(req.result);
  };
  req.onerror = () => console.error("Failed to load projects");
}

// Display projects in sidebar
function displayProjects(projects) {
  projectList.innerHTML = "";
  projects.forEach((proj) => {
    const btn = document.createElement("button");
    btn.className = "project-btn";
    btn.textContent = proj.project_name;
    btn.addEventListener("click", () => renderKanbanBoard(proj));
    projectList.appendChild(btn);
  });
}

// Handle sidebar toggle
toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

