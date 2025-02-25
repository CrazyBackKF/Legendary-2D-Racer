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

//wyswietlanie mapy
const stage = {
    a: {
        imgSrc: "img/tlo1.png",
        collisionsTab: getCollisions(collisions.background1.parse2d()).collisions,
        checkpointsTab: getCollisions(collisions.background1.parse2d()).checkpoints,
        roadTab: getCollisions(collisions.background1.parse2d()).road,
        checkpointOrder: [4, 5, 13, 14, 3, 6, 12, 15, 16, 7, 11, 8, 9, 10, 2, 17, 1, 0, 18] //kolejnosc checkpointow dla mapy a
    }
}

stage[currentMap].checkpointsTab = reorderArray(stage[currentMap].checkpointsTab, stage[currentMap].checkpointOrder);
for (let i = 0; i < stage[currentMap].checkpointsTab.length; i++) {
    stage[currentMap].checkpointsTab[i].index = i;
}

//ustawienie mapy jako tlo
const background = new Image();
background.src = stage[currentMap].imgSrc;

// Tworzenie nowej instancji klasy Player dla gracza
const player = new Player({
    position: {
        x: 300,
        y: 400
    },
    color: 'red'
})

const bots = [];
const botsColor = ['orange', 'darkGreen', 'pink', 'violet'];
const behavior = ['sprinter', 'stabilny', 'agresor', 'taktyk']
// for (let i = 0; i < 4; i++) {
//    let row = Math.floor(i / 2); // Rząd (0 lub 1)
//    let col = i % 2;             // Kolumna (0 lub 1)

//    bots.push(new Bot(
//        {
//            position: {
//                x: 300 + (col * 75) - global.translation.x,
//                y: 330 + (row * 50) - global.translation.y
//            },
//            color: botsColor[i],
//            behavior: behavior[i]
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
        behavior: "agresor"
    }
));


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
    }
    player.update(deltaTime);
    for (let i = 0; i < bots.length; i++) {
        bots[i].update(deltaTime);
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
}
animate();