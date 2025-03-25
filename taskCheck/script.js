const inputTask = document.querySelector(`.input-task`);
const addButton = document.querySelector(`.add-button`);
const taskContainer = document.querySelector(`.tasks-container`);

function removeTask(event) {
    const target = event.target;
    if(target.className == "remove-button") {
        const currentTask = target.closest(`.task`);
        currentTask.classList.add(`removed`);
        taskContainer.appendChild(currentTask);
    }
}

function addTask() {
    if(!inputTask.value) {
        alert(`Please input some text to add!`)
    } else {
        const newTask = document.createElement(`div`);
        newTask.className = `task`;
        newTask.innerText = inputTask.value;
        newTask.addEventListener(`click`, removeTask)

        const removeBtn = document.createElement(`div`);
        removeBtn.className = `remove-button`;
        removeBtn.addEventListener(`click`, removeTask);
        newTask.appendChild(removeBtn);

        inputTask.value = ``;
        taskContainer.insertBefore(newTask, taskContainer.firstChild);
    }
}

addButton.addEventListener(`click`, addTask);