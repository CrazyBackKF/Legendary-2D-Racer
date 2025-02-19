//Pobieranie elementu canvas z pliku index.html i tworzenie kontekstu
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const key = {
    q: false
}

//wyswietlanie mapy
const stage = {
    1: {
        imgSrc: "img/tlo1.png",
        collisions: collisions.background1.parse2d(),
    }
}

//okreslanie parametrow hitboxa
const collisionsTab = [];

for (let i = 0; i < stage[1].collisions.length; i++) {
    for (let j = 0; j < stage[1].collisions[i].length; j++) {
        if (stage[1].collisions[i][j] == 1) {
            collisionsTab.push(new collisionBlock({
                position: {
                    x: j * 8,
                    y: i * 8
                },
                width: 8,
                height: 8
            }))
        }
    }
}


//ustawienie mapy jako tlo
const background = new Image();
background.src = stage[1].imgSrc;

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

// Funkcja rekurencyjna gry (odpowiedzialna za animacje)
function animate() {
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(player.camerabox.translation.x, player.camerabox.translation.y);
    c.scale(2, 2);
    c.drawImage(background, 0, 0);
    c.restore();
    if (key.q) {
        for (let i = 0; i < collisionsTab.length; i++) {
            collisionsTab[i].draw();
            collisionsTab[i].angle += 0.01;
        }
    }
    player.update();
    for (let i = 0; i < 4; i++) {
        bots[i].update();
    }

    requestAnimationFrame(animate);
}

animate();