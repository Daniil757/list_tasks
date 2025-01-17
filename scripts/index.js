/**
 * @file index.js
 * @description 
 * @author Daniil Perevozchikov
 * @version 1.0
 * @date 20.12.2024
 */

const btnViewAddTask = document.querySelector(".task__add")
const formAddTask = document.querySelector(".popup__task")
const btnCloseAddTask = document.querySelector(".popup__close")

let btnListViewEditTask = document.querySelectorAll(".task__edit")
const btnCloseEditTask = document.querySelector(".edit__close")
const formEditTask = document.querySelector(".task__edit_form")

const ulTaskList = document.querySelector(".tasks__list")
let inpListToggleCheck = document.querySelectorAll(".task__checkbox")

let btnListDeleteTask = document.querySelectorAll(".task__delete")
const btnLogout = document.querySelector(".logout")

let TASKS = [] // все задачи пользователя в локальной переменной
let editTaskData = { // структура редактируемой задачи
    id: 0,
    task: '',
    xCompleted: false
} 

// Получение задач из БД при открытии страницы
document.addEventListener("DOMContentLoaded", async () => {
    await loadTasklList();
    updateEventListener(); // обновляем обработчики
})

// показать форму добавления задачи
btnViewAddTask.addEventListener("click", () => {
    formAddTask.classList.remove("display__none")
    btnViewAddTask.classList.add("display__none")
})

// скрыть форму добавления задачи
btnCloseAddTask.addEventListener("click", () => {
    formAddTask.classList.add("display__none")
    btnViewAddTask.classList.remove("display__none")
})

// отслеживание кликов по документу
document.addEventListener("click", () => {
    updateEventListener();
})

// скрыть форму редактирования задачи
btnCloseEditTask.addEventListener("click", () => {
    formEditTask.classList.add("display__none")
})

// добавление задачи
formAddTask.addEventListener("submit", async (e) => {
    e.preventDefault()
    try {
        let task = document.getElementById("task").value;
        task = task.trim();
        let url = 'http://localhost:3500/api/tasks/create';
        const token = JSON.parse(localStorage.getItem("token"));
        let req = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            body: JSON.stringify({
                task,
                xCompleted: false
            })
        });
        loadTasklList();
        updateEventListener(); // обновляем обработчики
    } catch (error) {
        alert("Ошибка добавления задачи")
    }
})

// обновление текста задачи
formEditTask.addEventListener("submit", async (e) => {
    e.preventDefault();
    await updateTextTask();
})

// проверка на 3 символа
function checkLenght(word) {
    if (word.length < 3)
        alert("Длина слова должна быть больше 3 символов")
    throw new Error;
}

// функция загрузки задач
async function loadTasklList() {
    try {
        let url = 'http://localhost:3500/api/tasks/get';
        const token = JSON.parse(localStorage.getItem("token"))
        let req = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        let res = await req.json()
        ulTaskList.innerHTML = '';
        TASKS = res.values;
        updateTaskList();
    } catch (error) {
        console.log("Не авторизован");
        window.location.replace("./pages/signin.html")
    }
}

// функция обновления текста задачи
async function updateTextTask() {
    try {
        let task = document.getElementById("edit__task_id").value;
        task = task.trim();
        let id = editTaskData.id;
        let url = 'http://localhost:3500/api/tasks/update-text';
        const token = JSON.parse(localStorage.getItem("token"));
        let req = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            body: JSON.stringify({
                id, 
                task
            })
        });
        let res = await req.json()
        // локально обновляем данные
        if (res.status === 200) {
            TASKS.forEach(item => {
                if (item.id === id) {
                    item.task = task;
                    updateTaskList();
                }
            })
        }   
        updateEventListener(); // обновляем обработчики     
    } catch (error) {
        alert("Ошибка обновления задачи")
    }
}

// обновление задач в локальной переменной TASKS - чтобы не обращаться кажыдй раз  к БД
function updateTaskList() {
    ulTaskList.innerHTML = '';
    TASKS.forEach(task => {
        ulTaskList.innerHTML += 
        `<li class="tasks__list_item ${task.xCompleted ? "completed" : ''}">
            <span class="task__id">${task.id}</span>
            <span class="task__text">${task.task}</span>
            <div class="task__control_block">
                <input type="checkbox" class="task__checkbox" ${task.xCompleted ? `checked` : ''}>
                <span class="task__edit">Редак.</span>
                <span class="task__delete">Удалить</span>
            </div>
        </li>`
    })
}

// обработчик - показать форму редактирования задачи
const handleClickEventEdit = (event) => {
    let liTask = event.srcElement.parentElement.parentElement; // элемент li который редактируем
    let id = Number(liTask.childNodes[1].innerHTML);
    let text = liTask.childNodes[3].innerHTML;
    document.getElementById("edit__task_id").value = text;
    
    editTaskData = {
        id,
        task: text,
        xCompleted: false
    }
    
    viewEditPopup();
}

// показать форму редактирования задачи
function viewEditPopup() {
    formEditTask.classList.remove("display__none")
}

// обработчик - изменение статуса задачи
const handleClickStatusTask = async (event) => {
    let liTask = event.srcElement.parentElement.parentElement; // элемент li который редактируем
    let xCompleted = event.srcElement.checked;
    let id = Number(liTask.childNodes[1].innerHTML);
       
    try {
        let url = 'http://localhost:3500/api/tasks/update-status';
        const token = JSON.parse(localStorage.getItem("token"));
        let req = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            body: JSON.stringify({
                id, 
                xCompleted
            })
        });
        let res = await req.json()
        // локально обновляем данные
        if (res.status === 200) {
            TASKS.forEach(item => {
                if (item.id === id) {
                    item.xCompleted = xCompleted;
                    updateTaskList();
                }
            })
        }     
        updateEventListener(); // обновляем обработчики   
    } catch (error) {
        alert("Ошибка обновления задачи")
    }
}

// обработчик - удаление задачи
const handleClickDeleteTask = async (event) => {
    let liTask = event.srcElement.parentElement.parentElement; // элемент li который редактируем
    let id = Number(liTask.childNodes[1].innerHTML);
       
    try {
        let url = 'http://localhost:3500/api/tasks/delete';
        const token = JSON.parse(localStorage.getItem("token"));
        let req = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            body: JSON.stringify({
                id
            })
        });
        let res = await req.json()
        // локально обновляем данные
        if (res.status === 202) {
            TASKS = TASKS.filter(item => item.id != id)
            updateTaskList(); 
        }     
        updateEventListener(); // обновляем обработчики
    } catch (error) {
        alert("Ошибка обновления задачи")
    }
}

// обновление обработчиков событий (для редактирования + обновления статуса + удаление задачи)
function updateEventListener() {
    // обновляем список 
    btnListViewEditTask = document.querySelectorAll(".task__edit") 
    inpListToggleCheck = document.querySelectorAll(".task__checkbox") 
    btnListDeleteTask = document.querySelectorAll(".task__delete")

    // удаляем обработчик каждый раз, иначе на один элемент будет несколько обработчиков
    btnListViewEditTask.forEach(btn => {
        btn.removeEventListener("click", handleClickEventEdit)
    })
    // показать форму редактирования задачи
    btnListViewEditTask.forEach(btn => {        
        btn.addEventListener("click", handleClickEventEdit);
    })

    // чекер - то же самое что и с редактированием
    inpListToggleCheck.forEach(input => {
        input.removeEventListener("click", handleClickStatusTask)
    })
    inpListToggleCheck.forEach(input => {
        input.addEventListener("click", handleClickStatusTask)
    })

    // удаление - то же самое что и с редактированием
    btnListDeleteTask.forEach(btn => {
        btn.removeEventListener("click", handleClickDeleteTask)
    })
    btnListDeleteTask.forEach(btn => {
        btn.addEventListener("click", handleClickDeleteTask)
    })
}

// выход из аккаунта
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.replace('./pages/signin.html')
})
