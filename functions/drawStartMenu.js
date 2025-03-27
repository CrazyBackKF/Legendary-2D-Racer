const startMenu = new Image();
startMenu.src = "assets/img/startMenu/startMenu.png"

const startText = {
    image: new Image(),
    translation: {
        x: 0,
        y: -300
    },
    isFirstFrame: true
}
startText.image.src = "assets/img/startMenu/text.png"

startMenuAnimation = {
    isFirstFrame: true,
    alpha: 0 // żeby gsap działał, to animowana wartość musi być w obiekcie
}

function animateStartMenu() {
    frame = requestAnimationFrame(animateStartMenu);
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.drawImage(startMenu, 0, 0);
    c.save();
    c.translate(startText.translation.x, startText.translation.y);
    c.drawImage(startText.image, 0, 0);
    c.restore();

    c.save();
    c.globalAlpha = startMenuAnimation.alpha;
    startButtons.forEach(button => button.draw());
    c.restore();

    c.restore();

    if (startMenuAnimation.isFirstFrame) {
        startMenuAnimation.isFirstFrame = false; // żeby animacje i muzyka się nie nawarstwiały (w sumie to nie trzeba bo tak czy siak się animuje do zera, ale żeby nie zajmowała miejsca)
        music.startMenu.play();
        const tl = gsap.timeline();
        tl.to(startText.translation, {
            y: 0,
            duration: 1.5,
            delay: 1,
        }).to(startMenuAnimation, {
            alpha: 1,
            duration: 0.5,
            onComplete: () => startButtons[0].isClickable = true
        })
    }

    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`;
    c.fillRect(0, 0, canvas.width, canvas.height);
    currentAnimation = "start"
    cursor.draw();
}

animateStartMenu();