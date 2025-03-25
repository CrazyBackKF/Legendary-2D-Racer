let currentMap = 1;
const check1 = [4, 5, 13, 14, 3, 6, 12, 15, 16, 7, 11, 8, 9, 10, 2, 17, 1, 0, 18];
const check2 = [20,24,40,5,6,19,21,23,25,41,18,22,7,39,4,17,26,8,27,28,29,30,31,38,9,10,16,3,32,42,33,11,12,13,34,37,35,36,15,14,2,1,0,45,43,44];
const check3 = [44,0,1,11,12,13,43,2,10,14,42,3,15,18,17,16,41,9,19,40,4,39,38,37,36,20,21,22,23,8,7,5,35,6,33,34,24,27,26,25,28,32,31,30,29];
const check4 = [32,33,34,43,44,31,35,42,45,30,29,36,28,27,26,46,37,41,38,39,40,25,21,24,22,23,20,47,49,48,6,5,4,50,7,3,55,19,11,51,54,56,52,53,8,9,10,12,2,57,18,1,0,59,58,17,13,16,15,14] // za długo to robiłem lol
const check5 = [3,2,1,0,63,62,61,4,60,59,5,56,57,58,6,7,8,55,43,44,45,42,23,22,9,46,24,21,47,10,41,11,12,13,54,25,20,14,48,19,15,40,18,17,16,53,49,52,51,50,26,29,31,33,35,27,39,28,30,32,34,36,37,38];

const obstaclesType = [{
    type: "oil",
    color: "black",
    imgSrc:"assets/przeszkody/plamaOleju.png"
},
{
    type: "traffic cone",
    color: "orange",
    imgSrc:"assets/przeszkody/pacholekDrogowy.png"
},
{
    type: "hole",
    color: "gray",
    imgSrc:"assets/przeszkody/dziura.png"
},
{
    type: "spikes",
    color: "purple",
    imgSrc:"assets/przeszkody/kolce.png"
}
];

// coiny i inne takie przeszkody beda zawarte w tej samej tablicy co przeszkody
//jest to wygodniejsze i dziala tak samo tylko inne jest zachowanie
const buffersType = [
    {
        type: "nitro",
        color: "lightblue",
        imgSrc:"assets/przeszkody/boosterNitro.png"
    },
    {
        type: "coin",
        color: "green",
        imgSrc:"assets/img/Icons/coin.png"
    }
];

let index = 0;

//wyswietlanie mapy
const stage = {
    1: {
        arrowRotations: [90, 90, 180, 180, 270, 270, 0, 0, 270, 270, 270, 180, 180, 270, 270, 0, 0, 0, 90],
        imgSrc: "assets/img/tlo1.png",
        foregroundSrc: "assets/img/tlo1Foreground.png",
        collisionsTab: getCollisions(collisions.background1.parse2d(128), this.arrowRotations).collisions,
        checkpointsTab: reorderArray(getCollisions(collisions.background1.parse2d(128)).checkpoints, check1), // checkpoint order
        roadTab: getCollisions(collisions.background1.parse2d(128)).road,
        iceTab: [], // nie ma lodu w 1 mapie
        amountOfObstacles: obstaclesType.length,
        amountOfBuffers: 6,
        playerPos: {x: 550, y: 400},
        botPos: {x: 300, y: 330},
        startTranslation: {x: -canvas.width / 2, y:  -canvas.height},
        scale: 1,
        rotation: 270,
        moneyMultiplier: 1,
        bestTime: JSON.parse(localStorage.getItem("bestTime1")) || -1
    },
    
    2: {
        arrowRotations: [90,90,180,180,180,270,270,270,0,0,90,0,270,270,270,180,180,180,270,180,270,0,270,180,270,0,0,90,90,0,270,270,0,90,0,270,270,180,180,180,270,0,0,0,90,90],
        imgSrc: "assets/img/tlo2.png",
        foregroundSrc: "assets/img/tlo2Foreground.png",
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
        bestTime: JSON.parse(localStorage.getItem("bestTime2")) || -1
    },

    3: {
        arrowRotations: [270,270,0,0,0,0,270,270,180,180,180,270,270,270,0,0,90,90,90,0,0,270,270,270,0,90,90,90,90,90,90,90,180,270,270,180,90,90,90,180,180,180,180,180,270],
        imgSrc: "assets/img/tlo3.png",
        foregroundSrc: "assets/img/tlo3Foreground.png",
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
        rotation: 90,
        moneyMultiplier: 1.5,
        bestTime: JSON.parse(localStorage.getItem("bestTime3")) || -1
    },

    4: {
        arrowRotations: [90,90,180,180,90,90,90,0,0,270,270,270,0,0,90,90,90,90,180,180,180,270,270,270,180,180,90,90,180,270,180,180,270,270,270,0,0,0,270,270,270,180,180,270,270,0,0,0,90,90,0,0,270,270,180,270,0,0,90,90],
        imgSrc: "assets/img/tlo4.png",
        foregroundSrc: "assets/img/tlo4Foreground.png",
        collisionsTab: getCollisions(collisions.background4.parse2d(192), this.arrowRotations).collisions,
        checkpointsTab: reorderArray(getCollisions(collisions.background4.parse2d(192)).checkpoints, check4),
        roadTab: getCollisions(collisions.background4.parse2d(192)).road,
        iceTab: getCollisions(collisions.background4.parse2d(192)).ice,
        amountOfObstacles: obstaclesType.length * 3,
        amountOfBuffers: 6,
        playerPos: {x: 550, y: 400},
        botPos: {x: 300, y: 330},
        startTranslation: {x: -1700, y: -1150},
        scale: 2,
        rotation: 270,
        moneyMultiplier: 2,
        bestTime: JSON.parse(localStorage.getItem("bestTime4")) || -1
    },
    5: {
        arrowRotations: [90,90,90,90,0,270,270,270,0,0,0,270,270,270,0,0,90,90,90,180,180,180,90,90,0,0,0,0,270,270,270,270,270,270,270,270,270,270,270,180,180,180,180,90,90,90,90,0,0,0,90,90,90,180,180,180,270,270,270,270,180,90,90,90],
        imgSrc: "assets/img/tlo5.png",
        foregroundSrc: "assets/img/tlo5Foreground.png",
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
        bestTime: JSON.parse(localStorage.getItem("bestTime5")) || -1
    }
}