const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
// Tworzenie nowej instancji klasy Player dla gracza
const player = new Player({
    position: {
        x: 0,
        y: 0
    },
    color: 'red',
    imageSrc: JSON.parse(localStorage.getItem("playerSprite")) || "assets/img/cars/player1.png"
})
const global = {
    scale: {
        x: 2,
        y: 2
    },
    translation: {
        x: 0,
        y: 0
    },
    alpha: 0,
    firstTime: JSON.parse(localStorage.getItem("firstTime")) !== null ? JSON.parse(localStorage.getItem("firstTime")) : true,
    running: false
}
const offset = 3; // offset do cieni
const key = {
    q: false,
}
let currentAnimation;
let song;
const arrowImages = [];
for (let i = 1; i < 60; i++) {
    const image = new Image();
    image.src = `assets/img/Sprites/arrow/File${i}.png`;
    arrowImages.push(image);
}