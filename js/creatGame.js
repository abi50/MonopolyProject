let boardItems = [];
 
boardItems = JSON.parse(localStorage.getItem('boardItems'));
let tableBody = document.querySelector("#gameTable tbody");
let mikumArr=2;
if(boardItems!=null){
    for (let i = 0; i < boardItems.length; i++) {
        if (boardItems[i]!=null) {
            addRowToTable(i,boardItems[i].nameCountry,boardItems[i].nameMainland,boardItems[i].landPrice,boardItems[i].homePrice,boardItems[i].hotelPrice
                ,boardItems[i].landTex,boardItems[i].homeTex,boardItems[i].hotelTex);
                mikumArr=i+1;
        } 
    }
}
else{
    boardItems = [];
}

// for (let i = 1; i <= 50; i++) {
//     boardItems[i] = null;
// }
localStorage.setItem('boardItems', JSON.stringify(boardItems));


function updateDiv() {
    if(mikumArr<33){
        newItem={
            color: null,
            nameCountry: document.getElementById('countryName').value,
            nameMainland:document.getElementById('continent').value,
            landPrice:document.getElementById('landPrice').value,
            homePrice:document.getElementById('homePrice').value,
            hotelPrice:document.getElementById('hotelPrice').value,
            landTex:document.getElementById('landTex').value,
            homeTex:document.getElementById('homeTex').value,
            hotelTex:document.getElementById('hotelTex').value,
            homes:false,
            hotel:false,
            classColor: document.getElementById("colorInput").value
            
        };
    
        boardItems[mikumArr]=newItem;
        localStorage.removeItem('boardItems');
        localStorage.setItem('boardItems', JSON.stringify(boardItems));
        addRowToTable(mikumArr,newItem.nameCountry,newItem.nameMainland,newItem.landPrice,newItem.homePrice,newItem.hotelPrice
            ,newItem.landTex,newItem.homeTex,newItem.hotelTex,newItem.classColor);
         mikumArr++;
    }
}
function addRowToTable(mikumArr,nameCountry,nameMainland,landPrice,homePrice,hotelPrice,landTex,homeTex,hotelTex,classColor){
// הוסף שורה חדשה לטבלה
let newRow = tableBody.insertRow();
newRow.insertCell(0).innerText = mikumArr; // מיקום
newRow.insertCell(1).innerText = nameCountry; // יבשת
newRow.insertCell(2).innerText = nameMainland; // מדינה
newRow.insertCell(3).innerText = landPrice; // מחיר ראשון
newRow.insertCell(4).innerText = homePrice; // מחיר שני
newRow.insertCell(5).innerText = hotelPrice; // מחיר שלישי
newRow.insertCell(6).innerText = landTex; // מס ראשון
newRow.insertCell(7).innerText = homeTex; // מס שני
newRow.insertCell(8).innerText = hotelTex; // מס שלישי
newRow.insertCell(9).innerText = classColor; // מס שלישי
}
function deleteData(){
    for (let i = 1; i <= 50; i++) {
    boardItems[i] = null;
}
localStorage.setItem('boardItems', JSON.stringify(boardItems))
let table = document.getElementById("gameTable");
let rowCount = table.rows.length;
for (let i = rowCount - 1; i > 0; i--) {
    table.deleteRow(i);
}
mikumArr=2;
}