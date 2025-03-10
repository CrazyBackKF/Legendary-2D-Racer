const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

function UI() {
    // Timer i liczba okrążeń
    // c.fillStyle = "rgba(0, 0, 0, 0.7)";
    // c.fillRect(0, 10, 150, 100);
    const minutes = parseInt((Date.now() - player.startTime) / 60000);
    const seconds = parseInt(((Date.now() - player.startTime) % 60000) / 1000);
    c.font = '30px "Press Start 2P"';
    c.textAlign = "center";
    c.textBaseline = "middle"
    c.fillStyle = "black";
    c.fillText(`${player.laps}/3`, 60 + offset, 70 + offset);
    c.font = '20px "Press Start 2P"';
    c.fillText(`${minutes}:${seconds}`, 75 + offset, 100 + offset);
    c.fillText("LAPS", 50 + offset, 40 + offset);
    c.fillStyle = "white";
    c.font = '30px "Press Start 2P"';
    c.fillText(`${player.laps}/3`, 60, 70);
    c.font = '20px "Press Start 2P"';
    c.fillText(`${minutes}:${seconds}`, 75, 100);
    c.fillText("LAPS", 50, 40);

    // Wskaźnik turbo
    c.fillStyle = "black";
    c.fillRect(714, 515, 300, 25);
    c.fillStyle = "blue";
    c.fillRect(719 + 290 * ((2 - player.turboAmount) / 2), 520, 290 - (290 * ((2 - player.turboAmount) / 2)), 15);

    // Prędkościomierz
    c.save();
    c.globalAlpha = 0.7;
    speedometer.draw();
    pointer.rotation = (1.2 * Math.PI * Math.abs(player.speed) / player.maxSpeed) + rotation;
    if (Math.abs(player.maxSpeed - player.speed) < 0.1 && pointer.rotation <= 1.5 * Math.PI) rotation += 0.005;
    else if (rotation > 0) rotation -= 0.025
    pointer.draw();
    c.restore();
    
    // Sortowanie tablicy po dystansie każdego z samochodu, żeby przypisać im ich miejsca
    allCars.sort((a, b) => (b.distance + b.distanceFromLastCheckpoint) - (a.distance + a.distanceFromLastCheckpoint));
    allCars.forEach((car, i) => car.place = i + 1);

    // Wypisywanie pozycji gracza
    // c.fillStyle = "rgba(0, 0, 0, 0.7)";
    // c.fillRect(canvas.width - 150, 10, 150, 100)
    c.fillStyle = "black";
    c.font = '30px "Press Start 2P"';
    c.fillText(`${player.place}/${allCars.length}`, canvas.width - 80 + offset, 80 + offset);
    c.font = '20px "Press Start 2P"';
    c.fillText("POS", canvas.width - 100 + offset, 40 + offset);
    c.fillStyle = "white"
    c.font = '30px "Press Start 2P"';
    c.textAlign = "center";
    c.textBaseline = "middle"
    c.fillText(`${player.place}/${allCars.length}`, canvas.width - 80, 80);
    c.font = '20px "Press Start 2P"';
    c.fillText("POS", canvas.width - 100, 40);
}

function endOfMatch() {
    c.save();
    c.translate(0, -30); // Chce to dać troche do góry, a nie chce mi się już przerabiać obrazu i wszystkich pozycji
    endScreen.draw();
    c.font = '40px "Press Start 2P"';
    c.fillStyle = "black";
    c.fillText(`POS ${player.currentPlace}`, canvas.width / 2 + offset, 140 + offset);
    c.fillStyle = "white";
    c.fillText(`POS ${player.currentPlace}`, canvas.width / 2, 140);
    allCars.forEach((car, i) => {
        c.font = '25px "Press Start 2P"';
        c.fillStyle = "black";
        // sprawdzam, żeby nie było sytuacji, że ktoś skończy wyścig i się mu zmieni pozycja, bo bot wyjedzie trochę bardziej za metę
        let place = car.correctPlace;
        if (!place) place = car.place;
        c.fillText(place, 250 + offset, 250 + i * 50 + offset);
        c.fillStyle = "white";
        c.fillText(place, 250, 250 + i * 50);
        c.fillStyle = "black";
        c.fillText(car.name, 600 + offset, 250 + i * 50 + offset);
        c.fillStyle = "white";
        c.fillText(car.name, 600, 250 + i * 50);
    })
    c.restore();

    endScreenButtons.forEach(button => button.draw());
}

// event listenery do sprawdzania czy gracz najechał lub kliknął na przycisk gdy jest na "End Screenie". Na razie jest tylko jeden, ale może w przysłości będzie
// trzeba więcej
canvas.addEventListener("mousemove", (e) => {
    if (player.isPlaying) return;
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    let isHovering = false;
    endScreenButtons.forEach(button => {
        if (isCollidingButtons({x: mouseX, y: mouseY}, button)) {
            canvas.style.cursor = "pointer";
            isHovering = true;
            button.isHovering = true;
            gsap.to(button.scale, {
                x: button.hoverScale.x,
                y: button.hoverScale.y,
                duration: 0.5,
                ease: "power2.out"
            })
        }
        else {
            button.isHovering = false;
            gsap.to(button.scale, {
                x: button.startScale.x,
                y: button.startScale.y,
                duration: 0.5,
                ease: "power2.out"
            })
        }
    })
    if (!isHovering) canvas.style.cursor = "default";
})

canvas.addEventListener("click", (e) => {
    if (player.isPlaying) return;
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    endScreenButtons.forEach(button => {
        if (isCollidingButtons({x: mouseX, y: mouseY}, button)) {
            button.click();
        }
    })
})