const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
// Tworzenie nowej instancji klasy Player dla gracza
const player = new Player({
    position: {
        x: 0,
        y: 0
    },
    color: 'red',
    imageSrc: "assets/img/player1.png"
})
const offset = 3; // offset do cieni