let colors = ['Blue', 'Red', 'Orange', 'Yellow'];
let country = [];//מערך מדינות
let players=[];//מערך אובייקטים שחקנים: צבע חייל, מיקום, כסף
let amountPlayers=0;//כמות שחקנים
let currentPlayer=0;//המיקום במערך של החייל שתורו עכשיו
var boardLOck=true;
var finishLock=true;
var butToBuyLock=true;
let sum=0;
let modal;
let buyMusic = new Audio("../music/קניה.mp3");
let cubeMusic = new Audio("../music/קוביה.wav");
let payMusic = new Audio("../music/מיסים.wav");
let changeMoneyMusic = new Audio("../music/בשינוי\ בכסף.wav");


generateBoard();
country = JSON.parse(localStorage.getItem('boardItems'));
    updateBoardWithData();

//פעולה הנעשית מיד עם יצירת הדף
document.addEventListener("DOMContentLoaded", function () {
    // הוספת לחיצה לכל כפתור שחקן
    document.getElementById("Blue-solider").addEventListener("click", placeSolidersOnBoardHandler.bind(null, "Blue"));
    document.getElementById("Red-solider").addEventListener("click", placeSolidersOnBoardHandler.bind(null, "Red"));
    document.getElementById("Orange-solider").addEventListener("click", placeSolidersOnBoardHandler.bind(null, "Orange"));
    document.getElementById("Yellow-solider").addEventListener("click", placeSolidersOnBoardHandler.bind(null, "Yellow"));

    var end=document.querySelector(".endTurn");
    end.disabled=true;
    // var cub=document.querySelector(".cube");
    // cub.disabled=true
    var turn=document.querySelector("#turnFor");
    turn.style.display="none";
    var start=document.querySelector(".startPlay");
    start.disabled=true;
    for (let i = 0; i < colors.length; i++) {
        var detail=document.querySelector(`.details${colors[i]}`);
        detail.style.display="none";
    }
    updateBoardWithData();

});

function updateBoardWithData() {
    for (let i = 2; i <= 32; i++) {
        let part = document.querySelector(`#Part${i}`);
        if(i==9||i==17||i==25)
        {
            part.innerHTML = ` 
            <p>נכנסת לשטח צבאי חסוי! קיבלת קנס 100 שח</p>
            `;
        }
        else if (country!=undefined) 
        {
            if(country[i]){
                part.classList.add(country[i].classColor)
                part.innerHTML = ` 
                <p>${country[i].nameCountry}</p>
                <button class="buy" id="Part${i}" onclick="openDivForPayeOrBuy(event)">
                    <span>לקנייה</span>
                </button>
                `;
            }
        } 
        else 
        {
            part.innerHTML = `<p>יבשת:</p>`;
        }
    }
}

function updateB(){
    window.location.href = "../html/creatGame.html";
}

//בניית לוח משחק
function generateBoard() {
    let board = document.querySelector(".board");
    let part1 = document.createElement('div');
    part1.classList.add('grid-item');
    part1.id = 'Part1';
    part1.style.gridArea="item1";
    part1.classList.add('corner');
    part1.innerHTML = '<h6>התחלה</h6><br><h6>זכית ב300 שח!</h6>';
    board.appendChild(part1);
    let heightValues = [2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23, 24];
    let widthValues = [10, 11, 12, 13, 14, 15, 16, 26, 27, 28, 29, 30, 31, 32];
    for (let i = 2; i <= 32; i++) {
        let part = document.createElement('div');
        if (heightValues.includes(i)) {
            part.style.height = "120px";
        } else if (widthValues.includes(i)) {
            part.style.width = "120px";
        }
        part.classList.add('grid-item');
        part.id = `Part${i}`;
        part.style.gridArea=`item${i}`;
        if(i==9||i==17||i==25){
            part.innerHTML = ` 
            <p>נכנסת לשטח צבאי חסוי! קיבלת קנס 100 שח</p>
            `;
            part.classList.add('corner');
        }
        else if(country[i])
        {
            part.innerHTML = 
            `<p>${country[i].nameCountry}</p>
              <button class="buy" id="Part${i}" onclick="openDivForPayeOrBuy(event)">
                  <span>לקנייה</span>
              </button>`;   
        }
        else{
            part.innerHTML = `<p>יבשת:</p>`;
        }
        board.appendChild(part);
    }
    let part33 = document.createElement('div');
    part33.classList.add('grid-item-cube');
    part33.id = 'Part33';
    part33.style.gridArea="item33";
    part33.style.backgroundImage="url('../image/wallpaperflare-cropped.jpg')";
    part33.style.objectFit="cover";
    part33.innerHTML =`
        <h6>קוביה</h6>
        <button class="cube" id="cube" onclick=" cubeRolling ()"></button>
        `;
    board.appendChild(part33);
    part33.disabled=true;
    updateBoardWithData();
}

//כאשר לוחצים לתחילת משחק
function startPlay(){     
    boardLOck=false;   
    var end=document.querySelector(".endTurn");
    end.disabled=false;
    var cub=document.querySelector(".cube");
    cub.disabled=false;
    let queue=document.querySelector(".queue");
    queue.style.display="block";
    var turn=document.querySelector("#turnFor");
    turn.style.display="block";
    var startPlay=document.querySelector(".startPlay");
    startPlay.style.display="none";
    currentPlayer=amountPlayers;  //לגרום לפעולה endTurn לעבוד כראוי...
    endTurn();
    buyOnClick();  //משנה את הפונקציה של החיילים
    let solider;
    for (let i = 0; i < colors.length; i++) {
        if(!isColorExists(colors[i])){
            solider=document.querySelector(`.${colors[i]}`);
            solider.style.display="none";
        }
    }
}

function buyOnClick() {
    players.forEach(player => {
        let but = document.querySelector(`#${player.color}-solider`);
        let boundHandler = placeSolidersOnBoardHandler.bind(null, player.color);
        but.removeEventListener("click",boundHandler);
        but.addEventListener("click", ShowDetails);
        but.disabled = false;
    });
}

//בודקת האם צבע מסוים משחק
function isColorExists(colorToCheck) {   
    for (let i = 0; i < players.length; i++) {
        if (players[i].color === colorToCheck) {
            return true; // הצבע קיים במערך
        }
    }
    return false; // הצבע לא קיים במערך
}

//כאשר לוחצים על חיילים אחרי תחילת המשחק
function ShowDetails(event){
    var event=event.target.classList;
    var detail=document.querySelector(`.details${event[1]}`);
    detail.style.display="block";
}

//סוגר את חלונית הפרטים האיישים
function closeDetails(event){
    var event=event.target.classList;
    var detail=document.querySelector(`.details${event[0]}`);
    detail.style.display="none";
    let solider=document.querySelector(`.${event[0]}`);
    solider.disabled=false;
}

//כאשר לוחצים להוספת חייל
let placeSolidersOnBoardHandler=(color) =>{
     if(boardLOck){
        var playerDiv = document.createElement("div");
        playerDiv.classList.add(color);
        playerDiv.style.width="20px";
        playerDiv.style.height="20px";
        playerDiv.style.backgroundSize="cover";
        // הוספת החייל למשבצת ההתחלה
        var startCell = document.querySelector("#Part1");
        startCell.appendChild(playerDiv);
        let solider={                                                               
            color: color,
            mikum: 1,
            money: 1000
        };
        players[amountPlayers]=solider;
        amountPlayers++;
        var butFinish=document.querySelector(`.color`);
        switch (color) {
            case "Blue":
                    var butFinish=document.querySelector(".Blue");
                break;
            case "Orange":
                    var butFinish=document.querySelector(".Orange");
                break;
            case "Red":
                    var butFinish=document.querySelector(".Red");
                break;
            case "Yellow":
                    var butFinish=document.querySelector(".Yellow");
                break;
            default:
                break;
        }
        butFinish.disabled=true;
        if(players.length>=2){  //יכול להתחיל לשחק רק עם 2 שחקנים
            var start=document.querySelector(".startPlay");
            start.disabled=false;
        }
    }
}

//פעולה בתחילת תור-זריקת קוביה
function cubeRolling(){
    if(!boardLOck){
        let number=Math.floor(Math.random()*6)+1;
        let cube=document.getElementById("cube");
        switch (number) {
            case 1:
                cube.style.backgroundImage = "url('../image/1.png')";
                break;
            case 2:
                cube.style.backgroundImage = "url('../image/2.png')";
                break;
            case 3:
                cube.style.backgroundImage = "url('../image/3.png')";
                break;
            case 4:
                cube.style.backgroundImage = "url('../image/4.png')";
                break;
            case 5:
                cube.style.backgroundImage = "url('../image/5.png')";
                break;
            case 6:
                cube.style.backgroundImage = "url('../image/6.png')";
                break;
            default:
                break;
        }
        cube.disabled=true;
        for (let i = 0; i < number; i++) //קורא לפעולת עזר להעברת חייל כמספר הפעמים שיצא בקוביה
        {
            moveSoldier(players[currentPlayer].mikum,players[currentPlayer].color);
            cubeMusic.play();
        }
        let mikum=players[currentPlayer].mikum;
        if(country[mikum].color!=null && country[mikum].color!=players[currentPlayer].color)  //הארץ נרכשה ע"י שחקן אחר
        {
            if(country[mikum].hotel){
                sum=country[mikum].hotelTex;
            }
            else if(country[mikum].homes){
                sum=country[mikum].homeTex;
            }
            else{
                sum=country[mikum].landTex;
            }
            
            //הצגת חלונית המידעת את הורדת מס
            createDivForSurprise("עליך לשלם לחברך שקנה ארץ זו מיסים");
            payMusic.play();
            MinusMoney(players[currentPlayer].color,sum);
            PlusMoney(country[mikum].color,sum);
        }
        if(mikum==9||mikum==17||mikum==25){
            MinusMoney(players[currentPlayer].color,100);
        }
        //הפתעהההה
        sum=100;
        let numSurprise=Math.floor(Math.random()*32)+1;
        if(numSurprise==players[currentPlayer].mikum){
            if((numSurprise%2)==1)
            {
                createDivForSurprise("זכית ב-100 שח!!!");
                PlusMoney(players[currentPlayer].color,sum);
            }
            else if((numSurprise%2)==0)
            {
             MinusMoney(players[currentPlayer].color,sum);
             createDivForSurprise("רשות המס: עצבנת אותי! שלם 100 שח");
            }         
        }
    }
    butToBuyLock=false;
}

function createDivForSurprise(text) {
    // יצירת האלמנטים
    var pass = document.createElement("div");
    pass.id = "myModal";
    pass.classList.add("modal");
    modal = pass;
    var modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    var closeModal = document.createElement("span");
    closeModal.id = "closeModal";
    closeModal.addEventListener("click", closeModalClick);
    closeModal.classList.add("close");
    closeModal.innerHTML = "&times;";
    // יצירת אלמנט טקסט
    var text = document.createTextNode(text);
    // יצירת פרסום
    var paragraph = document.createElement("p");
    paragraph.appendChild(text);
    // הוספת הטקסט לדף
    modalContent.appendChild(paragraph);
    // הוספת האלמנטים לדף
    modalContent.appendChild(closeModal);
    pass.appendChild(modalContent);
    // הוספת המודל לגוף המסמך
    document.body.appendChild(pass);
    pass.style.display = "block";
    document.body.style.backgroundColor = "rgba(0,0,0,0.1)"; // קביעת סגנון הרקע
}

//פעולת עזר להעברת חייל
function moveSoldier(mikumSoldier, classSoldier) {
    let currentCell = document.getElementById("Part" + mikumSoldier);
    let nextCell = document.getElementById("Part" + (mikumSoldier + 1));
    if (mikumSoldier>=32) {
        nextCell = document.getElementById("Part1");
        PlusMoney(classSoldier,300);
        players.forEach(p => {
            if(p.color==classSoldier){
                p.mikum=0;
            }
        });
    }
    if (nextCell) {      
        let currentSoldier = currentCell.querySelector(`.${classSoldier}`);
        if (currentSoldier) {
            nextCell.appendChild(currentSoldier);
        }
    }
    players.forEach(player => {
        if (player.color == classSoldier) {
          player.mikum++;
        }
    });
}

//פעולה בסיום תור
function endTurn(){
    if(finishLock){
        boardLOck=false;
        let queue=document.querySelector(".queue")
        if(currentPlayer<amountPlayers){
            currentPlayer++;
        }
        if(currentPlayer==amountPlayers){
            currentPlayer=0;
        }
        switch (players[currentPlayer].color) {
            case "Blue":
                    queue.style.backgroundImage="url('../image/חייל כחול.png')";
                break;
            case "Orange":
                    queue.style.backgroundImage="url('../image/חייל כתום.png')";
                break;
            case "Red":
                queue.style.backgroundImage="url('../image/חייל אדום.png')";
                break;
            case "Yellow":
                queue.style.backgroundImage="url('../image/חייל צהוב.png')";
                break;
            default:
                break;
        }
        let cube=document.getElementById("cube");
        cube.style.backgroundImage="url('../image/10.png')";
        cube.disabled=false;
    }
}

// קניית ארץ בית או מלון
function paymentButtonClick(sum,num){ //מקבל כמה עולה השטח וכן מה קונה
    if((players[currentPlayer].money-sum)>=0){
        if(country[players[currentPlayer].mikum].color==null){  //עכשיו קונה ארץ
            country[players[currentPlayer].mikum].color=players[currentPlayer].color;
        }
        else if(country[players[currentPlayer].mikum].homes==false){  //קונה עכשיו בית
            country[players[currentPlayer].mikum].homes=true;
        }
        else{
            country[players[currentPlayer].mikum].hotel=true;  //עכשיו קונה מלון
        }
        MinusMoney(players[currentPlayer].color,sum);
        let propertyElement = document.querySelector(`.propertys${players[currentPlayer].color}`);
        switch (num) {
            case 1:
                    propertyElement.textContent+=("קרקע ב:"+country[players[currentPlayer].mikum].nameCountry+"\n");
                break;
            case 2:
                    propertyElement.textContent+=("בית ב:"+country[players[currentPlayer].mikum].nameCountry+"  ");
                break;
            case 3:
                    propertyElement.textContent+=("מלון ב:"+country[players[currentPlayer].mikum].nameCountry+"  ");
                break;
            default:
                break;
        }
    }
    else{
        createDivForSurprise("אין לך מספיק כסף על מנת לקנות ארץ זו");
    }
    closeModalClick();
}

//הוספת כסף לשחקן
function PlusMoney(colorSolider, sumMoney){
    changeMoneyMusic.play();
    players.forEach(player => {
        if (player.color == colorSolider) {
            player.money = parseInt(player.money) + parseInt(sumMoney);
        }
    });
    //שינוי תוכן בפרטים אישיים
    let currentPlayerObj = players.find(player => player.color === colorSolider);
    let amountMoneyElement = document.querySelector(`.amountMoney${colorSolider}`);
    amountMoneyElement.textContent=currentPlayerObj.money;
    finishLock=true;
}

//הורדת כסף משחקן
function MinusMoney(colorSolider, sumMoney){
    changeMoneyMusic.play();
    players.forEach(player => {
        if (player.color == colorSolider) {
            player.money = parseInt(player.money) - parseInt(sumMoney);
        }
    });
    //שינוי תוכל בפרטים אישיים
    let currentPlayerObj = players.find(player => player.color === colorSolider);
    let amountMoneyElement = document.querySelector(`.amountMoney${colorSolider}`);
    amountMoneyElement.textContent=currentPlayerObj.money;
}

function createDiv(nameFunc,sumin,textin,num){//num מסמל האם זה קניית מלון/בית/בנין/לא קניה כלל
    //הצגת חלונית לתשלום מיסים
    // יצירת האלמנטים
    var pass = document.createElement("div");
    pass.id = "myModal";
    pass.classList.add("modal");
    modal=pass;
    var modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    var closeModal = document.createElement("span");
    closeModal.id = "closeModal";
    closeModal.addEventListener("click",closeModalClick())
    closeModal.classList.add("close");
    closeModal.innerHTML = "&times;";
    // התוכן של החלונית
    var text = textin;
    // יצירת אלמנט פרסום
    var paragraph = document.createElement("p");
    paragraph.appendChild(text);
    // יצירת כפתור לתשלום
    var paymentButton = document.createElement("button");
    paymentButton.textContent = "לתשלום";
    paymentButton.addEventListener("click", nameFunc.bind(null, sumin, num));//bin-תפקידו לגרום לכך שהפיעולה לא תתבצע מיד באופן אוטומטי
    // הוספת הטקסט והכפתור לדף
    modalContent.appendChild(paragraph);
    modalContent.appendChild(paymentButton);
     // הוספת האלמנטים לדף
    modalContent.appendChild(closeModal);
    modalContent.appendChild(paragraph);
    pass.appendChild(modalContent);
    // הוספת המודל לגוף המסמך
    document.body.appendChild(pass);
     pass.style.display = "block";
    document.body.style.backgroundColor = "rgba(0,0,0,0.1)"; // קביעת סגנון הרקע
    closeModal.addEventListener("click", closeModalClick);
}

function openDivForPayeOrBuy(event){  //כאשר לוחץ לתשלום יפתח חלונית
    //בדיקת תשלום
    if(!butToBuyLock&&event.currentTarget.id==(`Part${players[currentPlayer].mikum}`)){
        buyMusic.play();
        let mikum=players[currentPlayer].mikum;
        sum=0;
        if(country[mikum].color==null)  //הארץ משוחררת
        {
            var textin = document.createTextNode("בידך לקנות את הארץ " + 
            country[mikum].nameCountry + " שביבשת " + country[mikum].nameMainland + 
            " המחיר שיהיה עליך לשלם הוא: " + country[mikum].landPrice + " ש\"ח" + " המחיר שהשחקנים יצטרכו לשלם לך על מעבר על הארץ הוא: " +country[mikum].landTex + " ש\"ח");
            var sumin=country[players[currentPlayer].mikum].landPrice;
            createDiv(paymentButtonClick,sumin,textin,1);
        }
        else if(country[mikum].color==players[currentPlayer].color){  //הארץ נרכשה על ידו אך לו לגמרי
            if(country[mikum].homes==true && country[mikum].hotel==false){
                var textin = document.createTextNode("כבר קנית ארץ ובית של הארץ" + 
                country[mikum].nameCountry + " שביבשת " + country[mikum].nameMainland + "בידך לקנות את המלון של ארץ זו " +
                " המחיר שיהיה עליך לשלם הוא: " + country[mikum].landPrice + " ש\"ח" +" המחיר שהשחקנים יצטרכו לשלם לך על מעבר במלון בארץ זו הוא: " +country[mikum].hotelTex + " ש\"ח");
                var sumin=country[players[currentPlayer].mikum].hotelPrice;
                createDiv(paymentButtonClick,sumin,textin,3);
            }
            else if(country[mikum].homes==false){
                var textin = document.createTextNode("כבר קנית את הארץ " + 
                country[mikum].nameCountry + " שביבשת " + country[mikum].nameMainland + " בידך לקנות את הבית של ארץ זו " +
                " המחיר שיהיה עליך לשלם הוא: " + country[mikum].landPrice + " ש\"ח" +" המחיר שהשחקנים יצטרכו לשלם לך על מעבר בבית בארץ זו הוא: " +country[mikum].homeTex + " ש\"ח");
                var sumin=country[players[currentPlayer].mikum].homePrice;
                createDiv(paymentButtonClick,sumin,textin,2);
            }
        }
        butToBuyLock=true;
    }
}

function closeModalClick() {  //כאשר לוחץ על האיקס בחלונית הנפתחת
    modal.style.display = "none";
    document.body.style.backgroundColor = ""; // שחזור סגנון הרקע המקורי
}