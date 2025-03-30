const helpScreen = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "assets/img/menus/helpScreen.png"
});

// animacja do rysowania menu pomocy
function animateHelpScreen() {
    frame = requestAnimationFrame(animateHelpScreen);
    helpScreen.draw();

    helpButtons.forEach(button => {
        button.draw();
    })

    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`;
    c.fillRect(0, 0, canvas.width, canvas.height);
    currentAnimation = "helpScreen";
}