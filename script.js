//Pobieranie elementu canvas z pliku index.html i tworzenie kontekstu
// znajduje się w "drawFunctions.js", ponieważ tamtejszy addEventListener potrzebował dostępu do canvas
// const canvas = document.querySelector("canvas");
// const c = canvas.getContext("2d");
const key = {
    q: false
}

let currentMap = 1;
let lastFrame = 0;
let deltaTime = 1;

const obstaclesType = [{
    type: "oil",
    color: "black"
},
{
    type: "traffic cone",
    color: "orange"
},
{
    type: "hole",
    color: "gray"
},
{
    type: "spikes",
    color: "purple"
}
];

// coiny inne takie przeszkody beda zawarte w tej samej tablicy co przeszkody
//jest to wygodniejsze i dziala tak samo tylko inne jest zachowanie
const buffersType = [
    {
        type: "nitro",
        color: "lightblue"
    },
    {
        type: "coin",
        color: "green"
    }
];

let index = 0;

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
const check1 = [4, 5, 13, 14, 3, 6, 12, 15, 16, 7, 11, 8, 9, 10, 2, 17, 1, 0, 18];
const check3 = [32,33,34,43,44,31,35,42,45,30,29,36,28,27,26,46,37,41,38,39,40,25,21,24,22,23,20,47,49,48,6,5,4,50,7,3,55,19,11,51,54,56,52,53,8,9,10,12,2,57,18,1,0,59,58,17,13,16,15,14] // za długo to robiłem lol

//wyswietlanie mapy
const stage = {
    1: {
        arrowRotations: [90, 90, 180, 180, 270, 270, 0, 0, 270, 270, 270, 180, 180, 270, 270, 0, 0, 0, 90],
        imgSrc: "assets/img/tlo1.png",
        collisionsTab: getCollisions(collisions.background1.parse2d(128), this.arrowRotations).collisions,
        checkpointsTab: reorderArray(getCollisions(collisions.background1.parse2d(128)).checkpoints, check1), // checkpoint order
        roadTab: getCollisions(collisions.background1.parse2d(128)).road,
        iceTab: [], // nie ma lodu w 1 mapie
        amountOfObstacles: obstaclesType.length,
        amountOfBuffers: 6,
        playerPos: {x: 550, y: 400},
        botPos: {x: 300, y: 330},
        startTranslation: {x: -canvas.width / 2, y:  -canvas.height},
        scale: 1
    },
    3: {
        arrowRotations: [90,90,180,180,90,90,90,0,0,270,270,270,0,0,90,90,90,90,180,180,180,270,270,270,180,180,90,90,180,270,180,180,270,270,270,0,0,0,270,270,270,180,180,270,270,0,0,0,90,90,0,0,270,270,180,270,0,0,90,90],
        imgSrc: "assets/img/tlo3.png",
        collisionsTab: getCollisions(collisions.background3.parse2d(192), this.arrowRotations).collisions,
        checkpointsTab: reorderArray(getCollisions(collisions.background3.parse2d(192)).checkpoints, check3),
        roadTab: getCollisions(collisions.background3.parse2d(192)).road,
        iceTab: getCollisions(collisions.background3.parse2d(192)).ice,
        amountOfObstacles: obstaclesType.length,
        amountOfBuffers: 6,
        playerPos: {x: 550, y: 400},
        botPos: {x: 300, y: 330},
        startTranslation: {x: -1700, y: -1150},
        scale: 2
    }
}
const background = new Image();
const obstacles = [];
const bots = [];
const botsColor = ['orange', 'darkGreen', 'pink', 'violet'];
const behavior = ['sprinter', 'stabilny', 'agresor', 'taktyk'];
const names = ['NitroNinja', 'TurboTornado', 'CrashCrasher', 'Slipstreamer'];
let snowTab = [];

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
            name: names[i]

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

let rotation = 0;
// Funkcja rekurencyjna gry (odpowiedzialna za animacje)
function animate(currentTime) {
    frame = requestAnimationFrame(animate);
    //if (!checkIfFullScreen() && Date.now() - lastFullScreen > 500) {
    //    cancelAnimationFrame(frame)
    //}
    deltaTime = (currentTime - lastFrame) / 1000; // Konwersja na sekundy
    lastFrame = currentTime;
    if (deltaTime > 1 / 30  || !deltaTime) deltaTime = 1 / 30; // Zapobieganie skokom FPS
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(global.translation.x, global.translation.y);
    c.scale(global.scale.x, global.scale.y);
    c.drawImage(background, 0, 0);
    c.restore();
    if (key.q) {
        //rysowanie scian
        for (let i = 0; i < stage[currentMap].collisionsTab.length; i++) {
            stage[currentMap].collisionsTab[i].draw();
        }

        //rysowanie checkpointow
        for (let i = 0; i < stage[currentMap].checkpointsTab.length; i++) {
            stage[currentMap].checkpointsTab[i].draw();
        }

        //rysowanie drogi
        for (let i = 0; i < stage[currentMap].roadTab.length; i++) {
            stage[currentMap].roadTab[i].draw();
        }

        //rysowanie przeskód
        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].draw();
            obstacles[i].update();
        }
        for (let i = 0; i < stage[currentMap].iceTab.length; i++) {
            stage[currentMap].iceTab[i].draw();
        }
    }
    player.update(deltaTime);
    //tworzenie obiektu z ktorym byla wykonana kolizja
    if (!player.allObstacles) {
        const position = stage[currentMap].roadTab[Math.floor(Math.random() * stage[currentMap].roadTab.length) + 1].position;
        obstacles.push(new Obstacle({
            position,
            width: 8 * global.scale.x,
            height: 8 * global.scale.y,
            type: player.deletedObstacle
        }))
    }

    for (let i = 0; i < bots.length; i++) {
        bots[i].update(deltaTime);
    }

    for (let i = 0; i < stage[currentMap].checkpointsTab.length; i++) {
        if (i == player.lastCheckpoint + 1) stage[currentMap].checkpointsTab[i].drawArrow();
    }

    //wyswietlanie komunikatu aby wrocic na tor
    if (!player.isOnRoad && !player.isOnIce) {
        c.fillStyle = "rgba(255, 165, 0, 0.9)"
        c.fillRect((canvas.width - 500) / 2, 50, 500, 100)
        c.strokeStyle = "black"
        c.strokeRect((canvas.width - 500) / 2, 50, 500, 100)
        c.fillStyle = "red";
        c.font = '30px "Press Start 2P"';
        c.textAlign = "center";
        c.textBaseline = "middle"
        c.fillText(`Wróć na tor!  ${5 - parseInt((Date.now() - player.lastRoadTime) / 1000)}`, canvas.width / 2, 100);
    }

    if (currentMap == 3) addSnow();
    if (player.isPlaying) UI();
    else endOfMatch();
    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`
    c.fillRect(0, 0, canvas.width, canvas.height)
}

let counter = 3;
let lastCounterTime;

function startAnimation(currentTime) {
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
    player.drawHitbox();
    player.changeSpriteProperties();
    player.draw();
    bots.forEach(bot => bot.drawHitbox());
    if (currentMap == 3) addSnow();
    shadowText(counter, {x: canvas.width / 2 - 20, y: 100}, offset, 40);

    if (Date.now() - lastCounterTime >= 1000) {
        counter--;
        lastCounterTime = Date.now();
    }
    if (counter == 0) {
        cancelAnimationFrame(frame);
        animate();
    }
    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`
    c.fillRect(0, 0, canvas.width, canvas.height)
}
