(function () {
  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    const appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const buttonWrapper = document.createElement("div");
    const button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить задачу";
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  // кнопки с доп функционалом 
  function createButtons(windowList, arr, key) {
    const buttonWrapper = document.createElement("div");
    buttonWrapper.classList = "mt-3";

    const evenBtn = document.createElement("button");
    evenBtn.classList.add("btn", "btn-outline-primary", "mr-2");
    evenBtn.textContent = "Чётные элементы";

    const ovenBtn = document.createElement("button");
    ovenBtn.classList.add("btn", "btn-outline-primary", "mr-2");
    ovenBtn.textContent = "Нечётные элементы";

    const delFirst = document.createElement("button");
    delFirst.classList.add("btn", "btn-outline-primary", "mr-2");
    delFirst.textContent = "Удалить первый";

    const delLast = document.createElement("button");
    delLast.classList.add("btn", "btn-outline-primary");
    delLast.textContent = "Удалить последний";

    

    // обработчики событий
    // четные
    evenBtn.addEventListener('click', () =>{
        const elements = windowList.childNodes;
        console.log(arr)
        for (let i = 1; i < elements.length; i+=2){
            elements[i].classList.toggle('list-group-item-warning')
        }
    });

    // нечетные
    ovenBtn.addEventListener('click', () =>{
        const elements = windowList.childNodes;
        console.log(arr)
        for (let i = 0; i < elements.length; i+=2){
            elements[i].classList.toggle('list-group-item-info')
        }
    });

    // удалить первый
    delFirst.addEventListener('click', () =>{
        const elements = windowList.childNodes;
        console.log(arr);
        elements[0].remove();
        arr.splice(0, 1);
        writeTasks(key, arr);
    });

    // удалить последний 
    delLast.addEventListener('click', () =>{
        const elements = windowList.childNodes;
        elements[elements.length - 1].remove();
        arr.splice(arr.length - 1, 1);
        writeTasks(key, arr);
    });

    buttonWrapper.append(evenBtn);
    buttonWrapper.append(ovenBtn);
    buttonWrapper.append(delFirst);
    buttonWrapper.append(delLast);

    return buttonWrapper;

  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    const list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  // создаем и возвращаем элемент списка (элемент + кнопки)
  function createTodoItem(task, key, arr) {
    const item = document.createElement("li");
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    const buttonGroup = document.createElement("div");
    const doneButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с поомщью flex
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = task.name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // добавляем обработчики на кнопки
    doneButton.addEventListener("click", function () {
      const parent = item.parentElement;
      item.classList.toggle("list-group-item-success");
      const index = arr.findIndex((el) => el.name === task.name);

      if (item.classList.contains("list-group-item-success")) {
        //помещаем в конец списка
        parent.append(item);
        if (index !== -1) {
          arr[index].done = true;
          const removed = arr.splice(index, 1);
          arr.push(removed[0]);
        }
      } else {
        //помещаем в начало списка
        parent.prepend(item);
        if (index !== -1) {
          arr[index].done = false;
          const removed = arr.splice(index, 1);
          arr.unshift(removed[0]);
        }
      }

      writeTasks(key, arr);
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        item.remove();

        const index = arr.findIndex((el) => el.name === task.name);

        if (index !== -1) {
          arr.splice(index, 1);
        }

        writeTasks(key, arr);
      }
    });

    return item;
  }

  // вспомогательная функция. возвращает максимальный индекс для нового элемента массива
  function setMaxId(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return 0; // обработка пустого массива или неправильного входного значения
    }

    const maxId = arr.reduce(function (prev, current) {
      return current.id > prev ? current.id : prev;
    }, arr[0].id);

    return maxId + 1;
  }

  // ------------------------ работа с localstorage --------------------
  function readTasks(key) {
    const storage = localStorage.getItem(key);
    return storage ? JSON.parse(storage) : [];
  }

  function writeTasks(key, data) {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
  }

  // восстановление данных из localstorage в виде DOM-элементов списка
  function readAppendStorage(key, arr, windowList) {
    const storageData = readTasks(key);
    if (storageData.length !== 0) {
      arr = storageData.slice();

      for (ind in storageData) {
        let newItem = createTodoItem(storageData[ind], key, arr);
        if (storageData[ind].done) {
          newItem.classList.add("list-group-item-success");
        }

        windowList.append(newItem);
      }
    }
    return arr;
  }

  // ---------------- ГЛАВНАЯ ФУНКЦИЯ -------------------

  function createTodoApp(container, title = "Список дел", listName) {
    const todoAppTitle = createAppTitle(title);    
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();
    let tasks = [];
    
    //чтение и восстановление хранилища
    tasks = readAppendStorage(listName, tasks, todoList);

    const buttons = createButtons(todoList, tasks, listName);

    container.append(todoAppTitle);    
    container.append(todoItemForm.form);
    container.append(todoList);
    container.append(buttons);
    
    

    // добавляем обработик, который активирует кнопку при вводе
    todoItemForm.input.addEventListener("input", function () {
      todoItemForm.button.disabled = false;
    });

    

    // браузер создает событие submit на форме по нажатию на enter или на кнопку создания дела
    todoItemForm.form.addEventListener("submit", function (e) {
      // эта строчка необходима чтобы предотвратить стандартное действие браузер
      // в данном случае мы не хотим, чтобы страница перезагружалась при отпарвке формы
      e.preventDefault();

      // создаем и добавляем в список нвоое дело с названием из поля для ввода
      if (todoItemForm.input.value.trim() === "") {
        return;
      }
      const task = {
        id: setMaxId(tasks),
        name: todoItemForm.input.value.trim(),
        done: false,
      };
      const todoItem = createTodoItem(task, listName, tasks);

      // создаем и добавлям в список новое дело с названием из поля для ввода
      todoList.append(todoItem);
      // добавляем в локальный массив
      tasks.push(task);
      // добавляем в хранилище
      writeTasks(listName, tasks);

      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = "";

      // устанавливаем заново disabled
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
