const tuningBackground = new Image();
tuningBackground.src = "assets/img/tuning.png";

function animateTuning() {
    frame = requestAnimationFrame(animateTuning);

    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.drawImage(tuningBackground, 0, 0);

    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`;
    c.fillRect(0, 0, canvas.width, canvas.height);

    tuningButtons.forEach(button => button.draw());
}