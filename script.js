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
        collisions: collisions.background1.parse2d(),
        checkpointOrder:[5,1,4,0,2,3] //kolejnosc checkpointow dla mapy a
    }
}

//okreslanie parametrow hitboxa
const collisionsTab = [];
const checkpointsTab = [];
let witdhMultiplier = 1;
let heightMultipler = 1;

for (let i = 1; i < stage.a.collisions.length; i++) {
    for (let j = 0; j < stage.a.collisions[i].length; j++) {
        //okreslanie rodzaju hitboxa
        if(stage.a.collisions[i - 1][j] == 1)
        {
            witdhMultiplier = 1;
            heightMultipler = 8;
        }
        else if (stage.a.collisions[i][j - 1] == 1){
            witdhMultiplier = 8;
            heightMultipler = 1;
        }

        if (stage.a.collisions[i][j] == 1) {
            collisionsTab.push(new collisionBlock({
                position: {
                    x: j * 8,
                    y: i * 8
                },
                width: 8,
                height: 8,
                color: 'rgba(0, 0, 255, 0.5)',
            }))
        }
        //ustalenie miejsca z checkpointem
        else if (stage.a.collisions[i][j] == 2){
            checkpointsTab.push(new CheckpointBlock({
                position: {
                    x: j * 8,
                    y: i * 8
                },
                width: 8 * witdhMultiplier,
                height: 8 * heightMultipler,    
                color: 'rgba(255,255,00, 0.5)',
                isPassed: false,
            }))
        }
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

// Funkcja rekurencyjna gry (odpowiedzialna za animacje)
function animate() {    
    c.save();
    c.translate(player.camerabox.translation.x, player.camerabox.translation.y);
    c.scale(2, 2);
    c.drawImage(background, 0, 0);
    c.restore();
    for (let i = 0; i < checkpointsTab.length; i++) { 
        checkpointsTab[i].index = desiredOrder[i] //okreslanie indexow checkpointo zgledem mapy nie wzgedem wyrenderowania (,np ostani byl pierwszy)
    }
    if (key.q) {
        //rysowanie scian
        for (let i = 0; i < collisionsTab.length; i++) { 
            collisionsTab[i].draw();
            collisionsTab[i].angle += 0.01;
        }
        //rysowanie checkpointow
        for (let i = 0; i < checkpointsTab.length; i++) { 
            checkpointsTab[i].draw();
        }
    }
    player.update();
    for (let i = 0; i < 4; i++) {
        bots[i].update();
    }

    requestAnimationFrame(animate);
}

animate();