const pauseText = ["Resume", "Exit to menu"];

// funkcja rysująca pauze po naciśnięciu "p" lub po wyjściu z full screena
function pause() {
    frame = requestAnimationFrame(pause);
    c.clearRect(200, 150, 600, 300);
    c.save();
    c.beginPath();
    c.rect(200, 150, 600, 300);
    c.closePath();
    c.clip();
    endScreen.draw(); // nie potrzeba drugiego spritea, ponieważ ten sprite dobrze wygląda jako menu pauzy, tylko to trochę przycinam
    let gradient = c.createLinearGradient(200, 150, 800, 450);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.8, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    c.globalCompositeOperation = "destination-in";

    c.fillStyle = gradient;
    c.fillRect(200, 150, 600, 300);

    c.globalCompositeOperation = "source-over";
    c.restore();

    shadowText("PAUSED", {x: canvas.width / 2, y: 180}, offset, 35)
    pauseButtons.forEach((button, i) => {
        button.draw();
        c.save();
        c.translate(button.position.x + button.image.width / 2, button.position.y + button.image.height / 2)
        c.scale(button.scale.x / button.startScale.x, button.scale.y / button.startScale.y);
        shadowText(pauseText[i], {x: 0, y: 0}, offset, 15);
        c.restore();
    })

    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`
    c.fillRect(0, 0, canvas.width, canvas.height);

    currentAnimation = "pause";
}