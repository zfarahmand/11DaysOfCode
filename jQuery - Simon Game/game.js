let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let soundsURL = "sounds/";
let gameIsStarted = false;
let level = 0;


function nextSequence() {
    userClickedPattern = [];

    let randomNumber = Math.floor(Math.random() * 4);
    let randomChosenColor = buttonColors[randomNumber];
    let chosenButton = $('#' + randomChosenColor);

    gamePattern.push(randomChosenColor);
    chosenButton.fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
    level++;
    $("#level-title").text("Level " + level);
}

function playSound(name) {
    let audio = new Audio(soundsURL + name + ".mp3");
    audio.play();
}

function animatePress(currentColor) {
    $('#' + currentColor).addClass("pressed");
    setTimeout(function() {
        $('#' + currentColor).removeClass("pressed");
    } , 100);
}

function checkAnswer(currentLevel) {
    if(userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        console.log("success");
        if(userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            } , 1000);
        }
    }
    else {
        let failAudio = new Audio(soundsURL + "wrong.mp3");
        failAudio.play();
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        } , 200);
        $("h1").text("Game Over, Press Any Key to Restart");
        startOver();
    }
}

function startOver() {
    gameIsStarted = false;
    level = 0;
    gamePattern = [];
}


$(".btn").click(function() {
    if(gameIsStarted) {
        let userChosenColor = $(this).attr("id");
        userClickedPattern.push(userChosenColor);
        playSound(userChosenColor);
        animatePress(userChosenColor);


        checkAnswer(userClickedPattern.length - 1);
    }
});

$(document).keypress(function() {
    if(!gameIsStarted) {
        gameIsStarted = true;
        $("#level-title").text("Level 0");
        nextSequence();
    }
});

