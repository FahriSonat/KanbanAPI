const draggables = document.querySelectorAll(".task");
const droppables = document.querySelectorAll(".swim-lane");

window.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();

  console.log();
  
});

draggables.forEach((task) => {
  task.addEventListener("dragstart", () => {
    task.classList.add("is-dragging");
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("is-dragging");
    saveTasksToLocalStorage();
  });
});

droppables.forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();

    const bottomTask = insertAboveTask(zone, e.clientY);
    const curTask = document.querySelector(".is-dragging");

    if (!bottomTask) {
      zone.appendChild(curTask);
    } else {
      zone.insertBefore(curTask, bottomTask);
    }

    if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      saveTasksToLocalStorage();
    }
  });
});

const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll(".task:not(.is-dragging)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();

    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};

const saveTasksToLocalStorage = () => {
  const tasksData = [];

  droppables.forEach((zone) => {
    const tasks = zone.querySelectorAll(".task");
    const zoneId = zone.id;

    tasks.forEach((task) => {
      tasksData.push({
        id: task.id,
        zoneId: zoneId,
      });
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasksData));
};

const loadTasksFromLocalStorage = () => {
  const tasksData = JSON.parse(localStorage.getItem("tasks"));

  if (tasksData) {
    tasksData.forEach(({ id, zoneId }) => {
      const task = document.getElementById(id);
      const zone = document.getElementById(zoneId);

      if (task && zone) {
        zone.appendChild(task);
      }
    });
  }
};
