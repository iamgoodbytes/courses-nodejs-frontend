/* redirect if not logged in */
if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
}

/* fetch all todos on load */
fetch("http://localhost:3000/api/v1/todos", {
    'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
}).then(result => {
    return result.json();
}).then(json => {
    json.data.todos.forEach(todo => {
        if (todo.completed) {
            var newTodo = `<div class="todo todo--completed">
            <input data-id="${todo._id}" type="checkbox" class="todo__state">  
            <div class="todo__text">${todo.text}</div>
            <a class="todo__delete" href="#" data-id="${todo._id}">delete</a>
        </div>`;
        } else {
            var newTodo = `<div class="todo">
            <input data-id="${todo._id}" type="checkbox" class="todo__state">  
            <div class="todo__text">${todo.text}</div>
            <a class="todo__delete" href="#" data-id="${todo._id}">delete</a>
        </div>`;
        }
        document.querySelector(".todo__new ").insertAdjacentHTML('afterend', newTodo);
    });


}).catch(err => {
    console.log(err);
    console.log("😭😭😭")
});

/* add a todo on enter */
let input = document.querySelector(".todo__input");
input.addEventListener("keyup", e => {
    if (e.keyCode === 13) {
        // on enter
        let text = input.value;
        fetch('http://localhost:3000/api/v1/todos', {
                method: "post",
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    "text": text
                })
            })
            .then(result => {
                return result.json();
            }).then(json => {
                let todo = `<div class="todo">
                    <input data-id="${json.data.todo._id}" type="checkbox" class="todo__state">  
                    <div class="todo__text">${json.data.todo.text}</div>
                    <a class="todo__delete" href="#" data-id="${json.data.todo._id}">delete</a>
                </div>`;
                input.value = "";
                input.focus();
                document.querySelector(".todo__new ").insertAdjacentHTML('afterend', todo);
            }).catch(err => {
                console.log(err)
            })
    }

    e.preventDefault();
});

/* mark one as completed */
document.querySelector(".app").addEventListener("change", e => {
    if (e.target.classList.contains("todo__state")) {
        let todoId = e.target.getAttribute("data-id");

        fetch('http://localhost:3000/api/v1/todos/' + todoId, {
                method: "put",
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    "todoId": todoId
                })
            })
            .then(result => {

                return result.json();
            }).then(json => {
                if (json.status === "success") {
                    e.target.parentElement.classList.add("todo--completed");
                }
                console.log(json);
            }).catch(err => {
                console.log(err)
            })

    }
});

/* delete a todo item */
document.querySelector(".app").addEventListener("click", e => {
    if (e.target.classList.contains("todo__delete")) {
        let todoId = e.target.getAttribute("data-id");

        fetch('http://localhost:3000/api/v1/todos/' + todoId, {
                method: "delete",
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    "todoId": todoId
                })
            })
            .then(result => {
                return result.json();
            }).then(json => {
                if (json.status === "success") {
                    e.target.parentElement.remove();
                }
                console.log(json);
            }).catch(err => {
                console.log(err)
            })

    }
});


// simple logout functionality
document.querySelector(".option__logout").addEventListener("click", e => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
    e.preventDefault();
});