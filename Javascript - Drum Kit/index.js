/**
 * EVENT LISTENER CHALLENGE SOLUTION
 */

let buttons = document.querySelectorAll(".drum");

buttons.forEach(element => {
    element.addEventListener("click" , function() {
        alert("I got clicked!");
    });
});


