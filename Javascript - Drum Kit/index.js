/**
 * EVENT LISTENER CHALLENGE SOLUTION
 */

let buttons = document.querySelectorAll(".drum");
let audioFolder = "sounds/";
let audio;

// Detecting button press
buttons.forEach(element => {
    element.addEventListener("click", function () {
        let buttonInnerHTML = this.innerHTML;
        switchSounds(buttonInnerHTML);
    });
});

// Detecting key press
document.addEventListener("keydown" , function(event) {
    let tappedKey = event.key;
    switchSounds(tappedKey);
}); 

function switchSounds(key) {
    switch(key) {
        case 'w':
            audio = new Audio(audioFolder + "tom-1.mp3");
            audio.play();
            break;
        case 'a':
            audio = new Audio(audioFolder + "tom-2.mp3");
            audio.play();
            break;
        case 's':
            audio = new Audio(audioFolder + "tom-3.mp3");
            audio.play();
            break;
        case 'd':
            audio = new Audio(audioFolder + "tom-4.mp3");
            audio.play();
            break;
        case 'j':
            audio = new Audio(audioFolder + "snare.mp3");
            audio.play();
            break;
        case 'k':
            audio = new Audio(audioFolder + "crash.mp3");
            audio.play();
            break;
        case 'l':
            audio = new Audio(audioFolder + "kick-bass.mp3");
            audio.play();
            break;
        default:
            audio = new Audio(audioFolder + "tom-1.mp3");
            audio.play();
    }
}


