//Pobieranie elementu canvas z pliku index.html i tworzenie kontekstu
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const key = {
    q: false
}

//wyswietlanie mapy
const stage = {
    a: {
        imgSrc: "img/tlo1.png",
        collisionsTab: getCheckpointsAndCollisions(collisions.background1.parse2d()).collisions,
        checkpointsTab: getCheckpointsAndCollisions(collisions.background1.parse2d()).checkpoints,
        checkpointOrder:[4, 5, 13, 14, 3, 6, 12, 15, 16, 7, 11, 8, 9, 10, 2, 17, 1, 0, 18] //kolejnosc checkpointow dla mapy a
    }
}

const desiredOrder = stage.a.checkpointOrder; //okreslenie kolejnosci checkpointow

//ustawienie mapy jako tlo
const background = new Image();
background.src = stage.a.imgSrc;

// Tworzenie nowej instancji klasy Player dla gracza
const player = new Player({
    position: {
        x: 300,
        y: 400
    }
})

const bots = [];
for (let i = 0; i < 4; i++) {
    bots.push(new Bot(
        {
            position: {
                x: 200 + (i * 100) - player.camerabox.translation.x,
                y: 300 - player.camerabox.translation.y
            }
        }
    ))
}
for (let i = 0; i < stage.a.checkpointsTab.length; i++) { 
    stage.a.checkpointsTab[i].index = desiredOrder[i] //okreslanie indexow checkpointo zgledem mapy nie wzgedem wyrenderowania (,np ostani byl pierwszy)
}

// Funkcja rekurencyjna gry (odpowiedzialna za animacje)
function animate() {    
    c.save();
    c.translate(player.camerabox.translation.x, player.camerabox.translation.y);
    c.scale(2, 2);
    c.drawImage(background, 0, 0);
    c.restore();
    if (key.q) {
        //rysowanie scian
        for (let i = 0; i < stage.a.collisionsTab.length; i++) { 
            stage.a.collisionsTab[i].draw();
            stage.a.collisionsTab[i].angle += 0.01;
        }
        //rysowanie checkpointow
        for (let i = 0; i < stage.a.checkpointsTab.length; i++) { 
            stage.a.checkpointsTab[i].draw();
        }
    }
    player.update();
    for (let i = 0; i < 4; i++) {
        bots[i].update();
    }

    requestAnimationFrame(animate);
}

animate();