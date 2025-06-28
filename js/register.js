function registerr() {
    let firstName = document.getElementById("name").value;
    let lastName = document.getElementById("lastName").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;

    let user = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        password: password
    }
    
    if (firstName == "" || lastName == "" || phone == "" || password == "") {
        alert("נא מלא את כל השדות לפני לחיצה על התחברות.");
        return false;
    }
    if (localStorage.getItem(password) != undefined ) {
        alert("משתמש קיים, התחבר למערכת");
        
    }
    else {
        localStorage.setItem(password, JSON.stringify(user));
        alert("ברוך הבא!")
        window.location.href = "../html/board.html";
    }
}
function logIn(){
    window.location.href = "../html/login.html";
}
