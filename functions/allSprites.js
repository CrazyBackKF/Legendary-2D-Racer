const speedometer = new Sprite({
    position: {
        x: 1500,
        y: 550
    },
    imageSrc: "assets/img/speedometer/speedometer.png",
    scale: {
        x: 0.5,
        y: 0.5
    },
    alpha: 0.8
})

const pointer = new Sprite({     // Po angielsku to chyba pointer xd (chodzi o wskazówke do prędkościomierza)
    position: {
        x: 1690,
        y: 725
    },
    imageSrc: "assets/img/speedometer/wskaznik.png",
    scale: {
        x: 0.5,
        y: 0.5
    },
    translation: {
        x: 857.5,
        y: 375
    },
    isMovingWithTranslation: true,
    alpha: 0.8
});

const endScreen = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "assets/img/endScreen.png",
    alpha: 0.98
})

const menuButtons = [
    new Button({
        position: {
            x: 225,
            y: 450
        },
        click: () => {
            if (mainMenu.translation.currentLvl == 1) return;
            else mainMenu.translation.currentLvl--;
            changeLvl();
        },
        imageSrc: "img/ArrowLeft/Default.png",
        hoverImageSrc: "img/ArrowLeft/Hover.png"
    }),
    new Button({
        position: {
            x: 700,
            y: 450
        },
        click: () => {
            if (mainMenu.translation.currentLvl == 3) return;
            else mainMenu.translation.currentLvl++;
            changeLvl();
        },
        imageSrc: "img/ArrowRight/Default.png",
        hoverImageSrc: "img/ArrowRight/Hover.png"
    }),
    new Button({
        position: {
            x: 825,
            y: 470
        },
        click: () => {
            console.log("graj") // tu wjebiemy funkcję na przejście do gry
        },
        imageSrc: "img/Play/Default.png",
        hoverImageSrc: "img/Play/Hover.png"
    }),
    new Button({
        position: {
            x: 900,
            y: 5
        },
        click: () => {
            console.log("tuning") // tu przejscie do tuningu
        },
        imageSrc: "img/Tuning/Default.png",
        hoverImageSrc: "img/Tuning/Hover.png",
        scale: {
            x: 0.7,
            y: 0.7
        }
    })
]

const endScreenButtons = [
    new Button({
        position: {
            x: 820,
            y: 480
        },
        click: () => console.log("dalej"),
        imageSrc: "assets/img/endScreenPlayButton/Default.png",
        hoverImageSrc: "assets/img/endScreenPlayButton/Hover.png"
    })
]