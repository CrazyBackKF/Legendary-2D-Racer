//Pobieranie elementu canvas z pliku index.html i tworzenie kontekstu
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const key = {
    q: false
}
let currentMap = 'a';
let lastFrame = 0;
let deltaTime = 1;
const global = {
    scale: {
        x: 2,
        y: 2
    },
    translation: {
        x: -canvas.width / 2,
        y: -canvas.height
    }
}
let frame;
let lastFullScreen;
let time = Date.now();

//wyswietlanie mapy
const stage = {
    a: {
        arrowRotations: [90, 90, 180, 180, 270, 270, 0, 0, 270, 270, 270, 180, 180, 270, 270, 0, 0, 0, 90],
        imgSrc: "img/tlo1.png",
        collisionsTab: getCollisions(collisions.background1.parse2d(), this.arrowRotations).collisions,
        checkpointsTab: getCollisions(collisions.background1.parse2d()).checkpoints,
        roadTab: getCollisions(collisions.background1.parse2d()).road,
        checkpointOrder: [4, 5, 13, 14, 3, 6, 12, 15, 16, 7, 11, 8, 9, 10, 2, 17, 1, 0, 18], //kolejnosc checkpointow dla mapy a
        amountOfObstacles: 12

    }
}

stage[currentMap].checkpointsTab = reorderArray(stage[currentMap].checkpointsTab, stage[currentMap].checkpointOrder);
for (let i = 0; i < stage[currentMap].checkpointsTab.length; i++) {
    stage[currentMap].checkpointsTab[i].index = i;
    stage[currentMap].checkpointsTab[i].rotation = convertToRadians(stage[currentMap].arrowRotations[i]);
}

//ustawienie mapy jako tlo
const background = new Image();
background.src = stage[currentMap].imgSrc;

// Tworzenie nowej instancji klasy Player dla gracza
const player = new Player({
    position: {
        x: 550,
        y: 400
    },
    color: 'red',
    imageSrc: "assets/img/player1.png"
})

const obstacles = [];
const bots = [];
const botsColor = ['orange', 'darkGreen', 'pink', 'violet'];
const behavior = ['sprinter', 'stabilny', 'agresor', 'taktyk'];

//  for (let i = 0; i < 4; i++) {
//     let row = Math.floor(i / 2); // Rząd (0 lub 1)
//     let col = i % 2;             // Kolumna (0 lub 1)

//    bots.push(new Bot(
//        {
//            position: {
//                x: 300 + (col * 150) - global.translation.x,
//                y: 330 + (row * 75) - global.translation.y
//            },
//            color: botsColor[i],
//            behavior: behavior[i],
//            index: i

//        }
//    ));
// }

// bot do debugowania
bots.push(new Bot(
    {
        position: {
            x: 300 - global.translation.x,
            y: 315 - global.translation.y
        },
        color: "orange",
        behavior: "agresor",
        index: 0
    }
));

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
];

for (let i = 0; i < 12; i++) {
    const position = stage[currentMap].roadTab[Math.floor(Math.random() * stage[currentMap].roadTab.length) + 1].position;
    obstacles.push(new Obstacle({
        position,
        width: 8 * global.scale.x,
        height: 8 * global.scale.y,
        type: obstaclesType[Math.floor(i / 4)]
    }))
}

// Funkcja rekurencyjna gry (odpowiedzialna za animacje)
function animate(currentTime) {
    frame = requestAnimationFrame(animate);
    //if (!checkIfFullScreen() && Date.now() - lastFullScreen > 500) {
    //    cancelAnimationFrame(frame)
    //}
    deltaTime = (currentTime - lastFrame) / 1000; // Konwersja na sekundy
    lastFrame = currentTime;
    if (deltaTime > 1 / 30) deltaTime = 1 / 30; // Zapobieganie skokom FPS
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.save();
    c.translate(global.translation.x, global.translation.y);
    c.scale(global.scale.x, global.scale.y);
    c.drawImage(background, 0, 0);
    c.restore();
    if (key.q) {
        //rysowanie scian
        for (let i = 0; i < stage[currentMap].collisionsTab.length; i++) {
            stage[currentMap].collisionsTab[i].draw();
            stage[currentMap].collisionsTab[i].angle += 0.01;
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
    if (!player.isOnRoad) {
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

    c.fillStyle = "rgba(0, 0, 0, 0.7)";
    c.fillRect(0, 10, 150, 100);
    
    
    c.fillStyle = "white";
    c.font = '30px "Press Start 2P"';
    c.textAlign = "center";
    c.textBaseline = "middle"
    c.fillText(`${player.laps}/3`, 50, 50);
    const minutes = parseInt((Date.now() - player.startTime) / 60000);
    const seconds = parseInt(((Date.now() - player.startTime) % 60000) / 1000);
    c.font = '20px "Press Start 2P"';
    c.fillText(`${minutes}:${seconds}`, 80, 80);

    c.fillStyle = "black";
    c.fillRect(10, 500, 300, 50);
    c.fillStyle = "blue";
    c.fillRect(15, 505, 290 * (player.turboAmount / 2), 40)
}
animate();
