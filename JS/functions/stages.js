let currentMap = 1;
// tablice które służą posortowaniu każdej tablicy z checkpointami
// z ostatnimi tablicami było trochę ciężko, wpisywałem dane do excela, a potem je sortowałem
const check1 = [4, 5, 13, 14, 3, 6, 12, 15, 16, 7, 11, 8, 9, 10, 2, 17, 1, 0, 18];
const check2 = [20,24,40,5,6,19,21,23,25,41,18,22,7,39,4,17,26,8,27,28,29,30,31,38,9,10,16,3,32,42,33,11,12,13,34,37,35,36,15,14,2,1,0,45,43,44];
const check3 = [44,0,1,11,12,13,43,2,10,14,42,3,15,18,17,16,41,9,19,40,4,39,38,37,36,20,21,22,23,8,7,5,35,6,33,34,24,27,26,25,28,32,31,30,29];
const check4 = [32,33,34,43,44,31,35,42,45,30,29,36,28,27,26,46,37,41,38,39,40,25,21,24,22,23,20,47,49,48,6,5,4,50,7,3,55,19,11,51,54,56,52,53,8,9,10,12,2,57,18,1,0,59,58,17,13,16,15,14] // za długo to robiłem lol
const check5 = [3,2,1,0,63,62,61,4,60,59,5,56,57,58,6,7,8,55,43,44,45,42,23,22,9,46,24,21,47,10,41,11,12,13,54,25,20,14,48,19,15,40,18,17,16,53,49,52,51,50,26,29,31,33,35,27,39,28,30,32,34,36,37,38];

// wszystkie przeskody, który spawnują się na mapie podczas gry (olej, słupek, dziura i kolce)
const obstaclesType = [{
    type: "oil",
    color: "black",
    imgSrc:"assets/img/Sprites/przeszkody/plamaOleju.png"
},
{
    type: "traffic cone",
    color: "orange",
    imgSrc:"assets/img/Sprites/przeszkody/pacholekDrogowy.png"
},
{
    type: "hole",
    color: "gray",
    imgSrc:"assets/img/Sprites/przeszkody/dziura.png"
},
{
    type: "spikes",
    color: "purple",
    imgSrc:"assets/img/Sprites/przeszkody/kolce.png"
}
];

// coiny i inne takie przeszkody beda zawarte w tej samej tablicy co przeszkody
//jest to wygodniejsze i dziala tak samo tylko inne jest zachowanie
const buffersType = [
    {
        type: "nitro",
        color: "lightblue",
        imgSrc:"assets/img/Sprites/przeszkody/boosterNitro.png"
    },
    {
        type: "coin",
        color: "green",
        imgSrc: "assets/img/Sprites/Coin/Coin.png"
    }
];

let index = 0;

//wszystkie mapy w grze i ich dane
const stage = {
    1: {
        arrowRotations: [90, 90, 180, 180, 270, 270, 0, 0, 270, 270, 270, 180, 180, 270, 270, 0, 0, 0, 90], // tutaj przechowywane są kąty, o jakie ma zostać obrócona strzałka sygnalizująca następny checkpoint, żeby nie zawsze wskazywała na dół (chyba, albo do góry), gdy ma 0 stopni
        imgSrc: "assets/img/Backgrounds/tlo1.png", // obraz mapy, zrobiony w programie Tiled z gotowych tilesetów (kafelków)
        foregroundSrc: "assets/img/Backgrounds/tlo1Foreground.png", // każda mapa ma foreground, żeby można było stworzyć iluzję auta przejeżdzającego pod np drzewem
        collisionsTab: getCollisions(collisions.background1.parse2d(128), this.arrowRotations).collisions, // kolizje od których gracz powinien się odbić
        checkpointsTab: reorderArray(getCollisions(collisions.background1.parse2d(128)).checkpoints, check1), //zmieniamy pozycje w tablicy checkpointów, ponieważ są w tablicy w kolejności od lewgo górnego rogu
        roadTab: getCollisions(collisions.background1.parse2d(128)).road, //tablica z obiektami drogi, po których samochód może się swobodnie poruszać. Jak wyjedzie z drogi to trudniej się jedzie i po chwili wraca na drogę
        iceTab: [], // nie ma lodu w 1 mapie
        amountOfObstacles: obstaclesType.length, // ilość przeszkód, na większych mapach jest ich więcej
        amountOfBuffers: 6, // ilość bufferów, czyli coinów i nitro na mapie (nie mam pojęcia dlaczego nazywa się to buffer, nie ja to nazywałem), w sumie na każdej mapie jest tyle samo, ale jakbyśmy chcieli dodać większą mapę z większa ilościom coinów, to wystarczy tutaj zmienić
        playerPos: {x: 550, y: 400}, // startowa pozycja playera i bota
        botPos: {x: 300, y: 330},
        startTranslation: {x: -canvas.width / 2, y:  -canvas.height}, // startowa translacja dla mapy (przesunięcie mapy)
        scale: 1, // skala mapy, ostatnie są większe i muszą mieć większą skale
        rotation: 270, // rotacja gracza i botów na początku
        moneyMultiplier: 1, // za każdą mapę dostaje się inną ilość pieniędzy
        bestTime: JSON.parse(localStorage.getItem("bestTime1")) || -1, // najlepszy czas. Na początku ustawiam na -1, ponieważ nie ma jeszcze najlepszego czasu i go po prostu nie wyświetlam
        filter: "rgba(120, 168, 77, 0.3)" //filter stosuje w każdej mapie, żeby lepiej wyglądało, w tej mapie chciałem uchwycić słoneczną pogodę
    },
    
    2: {
        arrowRotations: [90,90,180,180,180,270,270,270,0,0,90,0,270,270,270,180,180,180,270,180,270,0,270,180,270,0,0,90,90,0,270,270,0,90,0,270,270,180,180,180,270,0,0,0,90,90],
        imgSrc: "assets/img/Backgrounds/tlo2.png",
        foregroundSrc: "assets/img/Backgrounds/tlo2Foreground.png",
        collisionsTab: getCollisions(collisions.background2.parse2d(128), this.arrowRotations).collisions,
        checkpointsTab: reorderArray(getCollisions(collisions.background2.parse2d(128)).checkpoints, check2), // checkpoint order
        roadTab: getCollisions(collisions.background2.parse2d(128)).road,
        iceTab: [],
        amountOfObstacles: obstaclesType.length * 2,
        amountOfBuffers: 6,
        playerPos: {x: 550, y: 450},
        botPos: {x: 300, y: 380},
        startTranslation: {x: -canvas.width / 2 - 100, y:  -canvas.height},
        scale: 1,
        rotation: 270,
        moneyMultiplier: 1.5,
        bestTime: JSON.parse(localStorage.getItem("bestTime2")) || -1,
        filter: "rgba(216, 158, 71, 0.5)" // tutaj jak i w następnej mapie chciałem, żeby wyglądało upalnie i sucho
    },

    3: {
        arrowRotations: [270,270,0,0,0,0,270,270,180,180,180,270,270,270,0,0,90,90,90,0,0,270,270,270,0,90,90,90,90,90,90,90,180,270,270,180,90,90,90,180,180,180,180,180,270],
        imgSrc: "assets/img/Backgrounds/tlo3.png",
        foregroundSrc: "assets/img/Backgrounds/tlo3Foreground.png",
        collisionsTab: getCollisions(collisions.background3.parse2d(128), this.arrowRotations).collisions,
        checkpointsTab: reorderArray(getCollisions(collisions.background3.parse2d(128)).checkpoints, check3), // checkpoint order
        roadTab: getCollisions(collisions.background3.parse2d(128)).road,
        iceTab: [],
        amountOfObstacles: obstaclesType.length * 2,
        amountOfBuffers: 6,
        playerPos: {x: 150, y: 100},
        botPos: {x: 250, y: 80},
        startTranslation: {x: 0, y:  0},
        scale: 1,
        rotation: 90, // gracz i boty zaczynają odwrotnie, nie są obrócone o 270 stopni
        moneyMultiplier: 1.5,
        bestTime: JSON.parse(localStorage.getItem("bestTime3")) || -1,
        filter: "rgba(181, 95, 58, 0.3)"
    },

    4: {
        arrowRotations: [90,90,180,180,90,90,90,0,0,270,270,270,0,0,90,90,90,90,180,180,180,270,270,270,180,180,90,90,180,270,180,180,270,270,270,0,0,0,270,270,270,180,180,270,270,0,0,0,90,90,0,0,270,270,180,270,0,0,90,90],
        imgSrc: "assets/img/Backgrounds/tlo4.png",
        foregroundSrc: "assets/img/Backgrounds/tlo4Foreground.png",
        collisionsTab: getCollisions(collisions.background4.parse2d(192), this.arrowRotations).collisions,
        checkpointsTab: reorderArray(getCollisions(collisions.background4.parse2d(192)).checkpoints, check4),
        roadTab: getCollisions(collisions.background4.parse2d(192)).road,
        iceTab: getCollisions(collisions.background4.parse2d(192)).ice,
        amountOfObstacles: obstaclesType.length * 3,
        amountOfBuffers: 6,
        playerPos: {x: 550, y: 400},
        botPos: {x: 300, y: 330},
        startTranslation: {x: -1700, y: -1150},
        scale: 2, // mapa jest większa, więc muszę zmienić skale
        rotation: 270,
        moneyMultiplier: 2,
        bestTime: JSON.parse(localStorage.getItem("bestTime4")) || -1,
        filter: "rgba(224, 247, 250, 0.5)" // tutaj ma wyglądać jakby była zamieć śnieżna
    },
    5: {
        arrowRotations: [90,90,90,90,0,270,270,270,0,0,0,270,270,270,0,0,90,90,90,180,180,180,90,90,0,0,0,0,270,270,270,270,270,270,270,270,270,270,270,180,180,180,180,90,90,90,90,0,0,0,90,90,90,180,180,180,270,270,270,270,180,90,90,90],
        imgSrc: "assets/img/Backgrounds/tlo5.png",
        foregroundSrc: "assets/img/Backgrounds/tlo5Foreground.png",
        collisionsTab: getCollisions(collisions.background5.parse2d(192), this.arrowRotations).collisions,
        checkpointsTab: reorderArray(getCollisions(collisions.background5.parse2d(192)).checkpoints, check5),
        roadTab: getCollisions(collisions.background5.parse2d(192)).road,
        iceTab: getCollisions(collisions.background5.parse2d(192)).ice,
        amountOfObstacles: obstaclesType.length * 3,
        amountOfBuffers: 6,
        playerPos: {x: 550, y: 180},
        botPos: {x: 300, y: 110},
        startTranslation: {x: -1100, y: 0},
        scale: 2,
        rotation: 270,
        moneyMultiplier: 2,
        bestTime: JSON.parse(localStorage.getItem("bestTime5")) || -1,
        filter: "rgba(224, 247, 250, 0.5)"
    }
}