function loginn() {
    let phone = document.querySelector("#phone").value;
    let password = document.querySelector("#password").value;

    if (phone === "" || password === "") {
        alert("נא למלא את כל השדות לפני לחיצה על התחברות.");
        return false;
    }

    let user = JSON.parse(localStorage.getItem(password));

    if (user != null && user.password === password) {
        alert("התחברת בהצלחה!");
        window.location.href = "../html/board.html";
    } 
    else 
    {
        alert("משתמש לא קיים, אנא הירשם למערכת");
         window.location.href = "../html/register.html";
    }
}

function registerr() {
    window.location.href = "../html/register.html";
}