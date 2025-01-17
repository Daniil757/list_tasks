/**
 * @file signin.js
 * @description 
 * @author Daniil Perevozchikov
 * @version 1.0
 * @date 19.12.2024
 */

const signupForm = document.getElementById("signup") 

// при открытии страницы проверяем токен, если норм то авторизируем сразу
document.addEventListener("DOMContentLoaded", async () => {
    try {
        let url = 'http://localhost:3500/api/tasks/get';
        const token = JSON.parse(localStorage.getItem("token"))
        let req = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        let res = await req.json();        
        if (res.status === 200) {
            window.location.replace("/index.html")
        }
    } catch (error) {
        console.log("Не авторизован");
    }
})

// Регистрация
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    try {
        const nikname = document.getElementById("up_nickname").value;
        const firstName = document.getElementById("up_name").value;
        const password = document.getElementById("up_psw").value;
        checkLenght(nikname)
        checkLenght(firstName)
        checkLenght(password)
        
        let url = 'http://localhost:3500/api/auth/signup';
        let req = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
                nikname: nikname, 
                firstName: firstName, 
                password: password
            })
        });
        
        let res = await req.json()
        console.log(res);
    } catch (error) {
        console.log("Ошибка отправки запроса");
    }
})

// проверка на 6 символов - для всех полей для упрощения
function checkLenght(word) {
    word.trim();
    if (word.length < 6)
        alert("Длина слова должна быть больше 6 символов")
}