/**
 * @file index.js
 * @description 
 * @author Daniil Perevozchikov
 * @version 1.0
 * @date 22.11.2024
 */

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
    } catch (error) {
        console.log("Не авторизован");
        window.location.replace("/pages/signin.html")
    }
})
