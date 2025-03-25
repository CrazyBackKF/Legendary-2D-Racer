const helpScreen = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "assets/img/helpScreen.png"
});

function animateHelpScreen() {
    frame = requestAnimationFrame(animateHelpScreen);
    helpScreen.draw();

    helpButtons.forEach(button => {
        button.draw();
    })

    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`;
    c.fillRect(0, 0, canvas.width, canvas.height);
}

if (global.firstTime) {
    global.firstTime = false;
    localStorage.setItem("firstTime", JSON.stringify(false));
    menuButtons.forEach(button => button.isClickable = false);
    helpButtons.forEach(button => button.isClickable = true);
    animateHelpScreen();
}
else {
    helpButtons.forEach(button => button.isClickable = false);
    menuButtons.forEach(button => button.isClickable = true);
    animateMainMenu();
}