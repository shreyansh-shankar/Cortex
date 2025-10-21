let db;

const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get("taskId");

const taskTitle = document.getElementById("taskTitle");
const taskStatus = document.getElementById("taskStatus");
const taskTags = document.getElementById("taskTags");
const taskMarkdown = document.getElementById("taskMarkdown");

// Open IndexedDB
const request = indexedDB.open("ProjectsDB", 1);
request.onsuccess = (e) => {
    db = e.target.result;
    loadTask(taskId);
};

request.onerror = (e) => console.error("Error opening DB:", e.target.error);

function loadTask(taskId) {
    const tx = db.transaction("projects", "readonly");
    const store = tx.objectStore("projects");
    const req = store.getAll();

    req.onsuccess = () => {
        const projects = req.result;
        let taskFound = null;

        for (const project of projects) {
            if (!project.tasks) continue;
            taskFound = project.tasks.find(t => t.task_id === taskId);
            if (taskFound) break;
        }

        if (taskFound) renderTask(taskFound);
        else taskTitle.textContent = "Task Not Found";
    };

    req.onerror = () => console.error("Failed to load tasks");
}

function renderTask(task) {
    taskTitle.textContent = task.title;
    taskStatus.textContent = task.status || "Not set";
    taskTags.textContent = (task.tags && task.tags.join(", ")) || "None";
    taskMarkdown.value = task.content || "";
}

// Save markdown changes automatically
taskMarkdown.addEventListener("input", () => {
    const tx = db.transaction("projects", "readwrite");
    const store = tx.objectStore("projects");

    const req = store.getAll();
    req.onsuccess = () => {
        const projects = req.result;

        for (const project of projects) {
            if (!project.tasks) continue;
            const task = project.tasks.find(t => t.task_id === taskId);
            if (task) {
                task.content = taskMarkdown.value; // save content
                store.put(project);
                break;
            }
        }
    };
});
