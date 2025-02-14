//Pobieranie elementu canvas z pliku index.html i tworzenie kontekstu
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const mapTranslation = {
    x: 0,
    y: -canvas.height
}

const stage = {
    1: {
        imgSrc: "img/tlo1.png",
        collisions: collisions.background1.parse2d(),
    }
}

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


const background = new Image();
background.src = stage[1].imgSrc;

// Tworzenie nowej instancji klasy Player dla gracza
const player = new Player({
    position: {
        x: 300,
        y: 200
    }
})


// Funkcja rekurencyjna gry (odpowiedzialna za animacje)
function animate() {
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(mapTranslation.x, mapTranslation.y);
    c.scale(2, 2);
    c.drawImage(background, 0, 0);
    c.restore();
    for (let i = 0; i < collisionsTab.length; i++)
    {
        collisionsTab[i].draw();
        collisionsTab[i].angle += 0.01;
    }
    player.update();

    requestAnimationFrame(animate);
}

animate();