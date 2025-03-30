//Pobieranie elementu canvas z pliku index.html i tworzenie kontekstu
// znajduje się w "drawFunctions.js", ponieważ tamtejszy addEventListener potrzebował dostępu do canvas
// const canvas = document.querySelector("canvas");
// const c = canvas.getContext("2d");

let lastFrame = 0;
let deltaTime = 1;



// const global = {
//     scale: {
//         x: 2,
//         y: 2
//     },
//     translation: {
//         x: -canvas.width / 2,
//         y: -canvas.height
//     },
//     alpha: 0
// }

frame;
let lastFullScreen;
let time = Date.now();

const background = new Image();
const foreground = new Image(); // żeby była iluza, że samochód wjeżdża za np drzewa
const obstacles = [];
const bots = [];
// zmienne dla botów (mogliśmy to w sumie dać w obiekt, byłoby wygodniej)
const botsColor = ['orange', 'darkGreen', 'pink', 'violet'];
const behavior = ['sprinter', 'stabilny', 'agresor', 'taktyk'];
const names = ['NitroNinja', 'TurboTornado', 'CrashCrasher', 'Slipstreamer'];
let snowTab = [];

// tworzymy 4 boty
for (let i = 0; i < 4; i++) {
    bots.push(new Bot(
        {
            position: {
                x: 0,
                y: 0
            },
            color: botsColor[i],
            behavior: behavior[i],
            index: i,
            name: names[i],
            imageSrc: `assets/img/cars/Bots/${i + 1}.png`
        }
    ));
}

// bot do debugowania
// bots.push(new Bot(
//     {
//         position: {
//             x: 300 - global.translation.x,
//             y: 315 - global.translation.y
//         },
//         color: "orange",
//         behavior: "stabilny",
//         index: 0,
//         name: names[i]
//     }
// ));

const allCars = [player, ...bots];

// Funkcja rekurencyjna gry (odpowiedzialna za animacje)
function animate(currentTime) {
    frame = requestAnimationFrame(animate);
    deltaTime = (currentTime - lastFrame) / 1000; // Konwersja na sekundy
    lastFrame = currentTime;

    if (deltaTime > 1 / 30  || !deltaTime) deltaTime = 1 / 30; // Zapobieganie skokom FPS
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(global.cameraShake.x, global.cameraShake.y) // łatwiej było zrobić camera shake, niż mi się wydawało
    c.save();
    c.translate(global.translation.x, global.translation.y);
    c.scale(global.scale.x, global.scale.y);
    c.drawImage(background, 0, 0);
    c.restore();
    if (key.q) {
        //rysowanie checkpointow
        for (let i = 0; i < stage[currentMap].checkpointsTab.length; i++) {
            stage[currentMap].checkpointsTab[i].draw();
        }

        //rysowanie drogi
        for (let i = 0; i < stage[currentMap].roadTab.length; i++) {
            stage[currentMap].roadTab[i].draw();
        }

        for (let i = 0; i < stage[currentMap].iceTab.length; i++) {
            stage[currentMap].iceTab[i].draw();
        }
    }
    //rysowanie przeskód
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
    }
    player.update(deltaTime);
    //tworzenie obiektu z ktorym byla wykonana kolizja
    if (!player.allObstacles) {
        const position = stage[currentMap].roadTab[Math.floor(Math.random() * stage[currentMap].roadTab.length) + 1].position;
        obstacles.push(new Obstacle({
            position,
            width: 8 * global.scale.x,
            height: 8 * global.scale.y,
            type: player.deletedObstacle,
            imageSrc: player.deletedObstacleImg
        }))
    }

    for (let i = 0; i < bots.length; i++) {
        bots[i].update(deltaTime);
    }

    for (let i = 0; i < stage[currentMap].checkpointsTab.length; i++) {
        if (i == player.lastCheckpoint + 1 && i != 0) stage[currentMap].checkpointsTab[i].drawArrow();
    }
    
    if (foreground.src != "") { // jeżeli tło ma foreground
        c.save();
        c.translate(global.translation.x, global.translation.y);
        c.scale(global.scale.x, global.scale.y);
        c.drawImage(foreground, 0, 0);
        c.restore();
    }

    if (key.q) {
        //rysowanie scian
        for (let i = 0; i < stage[currentMap].collisionsTab.length; i++) {
            stage[currentMap].collisionsTab[i].draw();
        }
    }
    //wyswietlanie komunikatu aby wrocic na tor
    if (!player.isOnRoad && !player.isOnIce && !(Date.now() - player.lastMoney <= 2000)) {
        c.fillStyle = "rgba(255, 165, 0, 0.9)"
        c.fillRect((canvas.width - 650) / 2, 50, 650, 100)
        c.strokeStyle = "black"
        c.strokeRect((canvas.width - 650) / 2, 50, 650, 100)
        c.fillStyle = "red";
        c.font = '30px "Press Start 2P"';
        c.textAlign = "center";
        c.textBaseline = "middle"
        c.fillText(`Get back on track!  ${5 - parseInt((Date.now() - player.lastRoadTime) / 1000)}`, canvas.width / 2, 100);
    }

    if (Date.now() - player.lastMoney <= 2000) {
        c.fillStyle = "rgba(255, 165, 0, 0.9)";
        c.fillRect((canvas.width - 200) / 2, 50, 200, 90);
        shadowText("+", {x: 510, y: 95}, offset, 25);
        c.save();
        c.translate(-250, -30);
        coin.draw();
        c.restore();
        shadowText(20, {x: 530, y: 95}, offset, 25, "start");
    }

    c.fillStyle = stage[currentMap].filter;
    c.fillRect(0, 0, canvas.width, canvas.height);

    if (currentMap == 4 || currentMap == 5) addSnow();
    if (player.isPlaying) UI();
    else {
        canvas.style.cursor = `url("assets/img/Sprites/Cursor/cursor.png"), auto`;
        endOfMatch();
    }
    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`
    c.fillRect(0, 0, canvas.width, canvas.height)
    currentAnimation = "game";
    if (!checkIfFullScreen()) {
        cancelAnimationFrame(frame);
        pauseButtons.forEach(button => button.isClickable = true);
        canvas.style.cursor = `url("assets/img/Sprites/Cursor/cursor.png"), auto`;
        pause();   
    }
    c.restore();
}

let counter = 3;
let lastCounterTime;

// przed grą jest counter 3 sekundowy i po to jest ta funkcja
function startAnimation(currentTime) {
    canvas.style.cursor = "none";
    frame = requestAnimationFrame(startAnimation);
    deltaTime = (currentTime - lastFrame) / 1000; // Konwersja na sekundy
    lastFrame = currentTime;
    if (deltaTime > 1 / 30 || !deltaTime) deltaTime = 1 / 30; // Zapobieganie skokom FPS
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(global.translation.x, global.translation.y);
    c.scale(global.scale.x, global.scale.y);
    c.drawImage(background, 0, 0);
    c.restore();
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
    }
    player.drawHitbox();
    player.changeSpriteProperties();
    player.draw();
    bots.forEach(bot => {bot.draw()});
    if (foreground.src != "") {
        c.save();
        c.translate(global.translation.x, global.translation.y);
        c.scale(global.scale.x, global.scale.y);
        c.drawImage(foreground, 0, 0);
        c.restore();
    }
    
    c.fillStyle = stage[currentMap].filter;
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    if (currentMap == 4 || currentMap == 5) addSnow();
    shadowText(counter, {x: canvas.width / 2 - 20, y: 100}, offset, 40);

    if (Date.now() - lastCounterTime >= 1000) {
        counter--;
        lastCounterTime = Date.now();
    }
    if (counter == 0) {
        player.startTime = Date.now();
        cancelAnimationFrame(frame);
        animate();
    }
    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`
    c.fillRect(0, 0, canvas.width, canvas.height)
    currentAnimation = "counting";
}
