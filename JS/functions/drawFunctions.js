let rotation = 0;
// funkcja do rysowania interfejsu
function UI() {
    // Timer i liczba okrążeń
    // c.fillStyle = "rgba(0, 0, 0, 0.7)";
    // c.fillRect(0, 10, 150, 100);
    const time = getTime(Date.now() - player.startTime);

    shadowText(`${player.laps}/3`, {x: 60, y: 70}, offset, 30);
    shadowText(time, {x: 75, y: 100}, offset, 20);
    shadowText("LAPS", {x: 50, y: 40}, offset, 20);

    // Wskaźnik turbo
    c.fillStyle = "black";
    c.fillRect(10, 250, 50, 300);
    c.fillStyle = "blue";
    c.fillRect(15, 545 - (290 * (player.turboAmount / player.maxTurbo)), 40, (290 * (player.turboAmount / player.maxTurbo)));

    // Prędkościomierz
    c.save();
    c.scale(0.6, 0.6);
    c.globalAlpha = 0.7;
    speedometer.draw();
    pointer.rotation = (1.2 * Math.PI * Math.abs(player.speed) / player.maxSpeed) + rotation;
    if (Math.abs(player.maxSpeed - player.speed) < 0.1 && pointer.rotation <= 1.5 * Math.PI) rotation += 0.005;
    else if (rotation > 0) rotation -= 0.025
    pointer.draw();
    c.restore();

    // Sortowanie tablicy po dystansie każdego z samochodu, żeby przypisać im ich miejsca
    allCars.sort((a, b) => (b.distance + b.distanceFromLastCheckpoint) - (a.distance + a.distanceFromLastCheckpoint));
    allCars.forEach((car, i) => {
        car.place = i + 1
        // c.font = "20px Arial";
        // c.fillStyle = "black";
        // c.save();
        // if (car.name != "Player") c.translate(global.translation.x, global.translation.y);
        // c.fillText(parseInt(car.distance + car.distanceFromLastCheckpoint), car.position.x, car.position.y);
        // c.fillText(car.speed, car.position.x + car.width, car.position.y + car.height);
        // c.restore();
    });

    // Wypisywanie pozycji gracza
    // c.fillStyle = "rgba(0, 0, 0, 0.7)";
    // c.fillRect(canvas.width - 150, 10, 150, 100)
    shadowText(`${player.place}/${allCars.length}`, {x: canvas.width - 80, y: 80}, offset, 30);
    shadowText("POS", {x: canvas.width - 100, y: 40}, offset, 20);
}

// funkcja rysująca menu po skończeniu wyścigu
function endOfMatch() {
    endScreenButtons.forEach(button => button.isClickable = true);
    c.save();
    c.translate(0, -30); // Chce to dać troche do góry, a nie chce mi się już przerabiać obrazu i wszystkich pozycji
    endScreen.draw();
    shadowText(`POS ${player.correctPlace}`, {x: canvas.width / 2, y: 140}, offset, 40);
    allCars.forEach((car, i) => {
        // sprawdzam, żeby nie było sytuacji, że ktoś skończy wyścig i się mu zmieni pozycja, bo bot wyjedzie trochę bardziej za metę
        let place = car.correctPlace;
        if (!place) place = car.place;

        shadowText(place, {x: 250, y: 250 + i * 50}, offset, 25);
        shadowText(car.name, {x: 600, y: 250 + i * 50}, offset, 25);
    })
    c.restore();

    shadowText("+", {x: 675, y: 125}, offset, 25);
    coin.draw();
    shadowText(player.moneyToAdd, {x: 740, y: 115}, offset, 25, "start", "top");

    endScreenButtons.forEach(button => button.draw());
}


