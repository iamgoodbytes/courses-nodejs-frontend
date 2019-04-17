const base_url = "https://todo-nodejs-goodbytes.herokuapp.com";

var btnLogin = document.querySelector(".login button").addEventListener("click", (e) => {
    let username = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;

    fetch(base_url + '/users/login', {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(response => {
        return response.json();
    }).then(json => {
        if (json.status === "success") {
            let token = json.data.token;
            localStorage.setItem("token", token);
            window.location.href = "index.html";
        } else {
            let feedback = document.querySelector(".alert");
            feedback.textContent = "Login failed buddy.";
            feedback.classList.remove('hidden');
        }
    })
});