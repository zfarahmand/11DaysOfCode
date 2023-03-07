let headerTitle = document.querySelector(".container h1");
let randomNumber1 = Math.floor(Math.random() * 6) + 1;
let randomNumber2 = Math.floor(Math.random() * 6) + 1;
let diceImage1 = document.getElementsByClassName("img1")[0];
let diceImage2 = document.getElementsByClassName("img2")[0];
let randomImageFolder = "images/";

diceImage1.setAttribute("src" , randomImageFolder + "dice" + randomNumber1 + ".png");
diceImage2.setAttribute("src" , randomImageFolder + "dice" + randomNumber2 + ".png");

if(randomNumber1 === randomNumber2) {
    headerTitle.textContent = "Draw!";
}
else if(randomNumber1 > randomNumber2) {
    headerTitle.textContent = "🚩 Player 1 Wins!";
}
else {
    headerTitle.textContent = "Player 2 Wins! 🚩";
}