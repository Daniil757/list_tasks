/**
 * @file signin.js
 * @description 
 * @author Daniil Perevozchikov
 * @version 1.0
 * @date 20.12.2024
 */

const signinForm = document.getElementById("signin") 

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
            window.location.replace("../index.html")
        }
    } catch (error) {
        console.log("Не авторизован");
    }
})

// Вход
signinForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    try {
        const nikname = document.getElementById("in_nickname").value;
        const password = document.getElementById("in_psw").value;
        
        let url = 'http://localhost:3500/api/auth/signin';
        let req = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
                nikname: nikname, 
                password: password
            })
        });
        
        let res = await req.json()
        localStorage.setItem("token",JSON.stringify(res.values.token))
        window.location.replace("../index.html")
    } catch (error) {
        console.log("Ошибка отправки запроса");
    }
})