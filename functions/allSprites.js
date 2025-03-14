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
        click: function() {
            if (mainMenu.translation.currentLvl == 1) return;
            else mainMenu.translation.currentLvl--;
            changeLvl();
        },
        imageSrc: "assets/img/ArrowLeft/Default.png",
        hoverImageSrc: "assets/img/ArrowLeft/Hover.png"
    }),
    new Button({
        position: {
            x: 700,
            y: 450
        },
        click: function() {
            if (mainMenu.translation.currentLvl == 3) return;
            else mainMenu.translation.currentLvl++;
            changeLvl();
        },
        imageSrc: "assets/img/ArrowRight/Default.png",
        hoverImageSrc: "assets/img/ArrowRight/Hover.png"
    }),
    new Button({
        position: {
            x: 825,
            y: 470
        },
        click: function() {
            for (let button of menuButtons) {button.isClickable = false;}
            const tl = gsap.timeline();
            tl.to(global, {
                alpha: 1,
                duration: 1,
                onComplete: () => {
                    cancelAnimationFrame(frame);
                    currentMap = mainMenu.translation.currentLvl;
                    for (let button of endScreenButtons) {button.isClickable = false;}
                    lastCounterTime = Date.now();
                    player.isPlaying = true;
                    changeLevelProperties();
                    startAnimation();
                }
            })
            tl.to(global, {
                alpha: 0,
                duration: 1.5,
                
            })
        },
        imageSrc: "assets/img/Play/Default.png",
        hoverImageSrc: "assets/img/Play/Hover.png"
    }),
    new Button({
        position: {
            x: 900,
            y: 5
        },
        click: function() {
            console.log("tuning") // tu przejscie do tuningu
            const tl = gsap.timeline();
            tl.to(global, {
                alpha: 1,
                duration: 1,
                onComplete: () => {
                    cancelAnimationFrame(frame);
                    menuButtons.forEach(button => button.isClickable = false);
                    tuningButtons.forEach(button => button.isClickable = true);
                    animateTuning();
                }
            })
            tl.to(global, {
                alpha: 0,
                duration: 1.5,
            })
        },
        imageSrc: "assets/img/Tuning/Default.png",
        hoverImageSrc: "assets/img/Tuning/Hover.png",
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
        click: function() {
            const tl = gsap.timeline();
            tl.to(global, {
                alpha: 1,
                duration: 1,
                onComplete: () => {
                    cancelAnimationFrame(frame);
                    endScreenButtons.forEach(button => button.isClickable = false);
                    menuButtons.forEach(button => button.isClickable = true);
                    animateMainMenu();
                }
            })
            tl.to(global, {
                alpha: 0,
                duration: 1.5,
            })
        },
        imageSrc: "assets/img/endScreenPlayButton/Default.png",
        hoverImageSrc: "assets/img/endScreenPlayButton/Hover.png",
        isClickable: false
    })
]

function tuningOnClick() {
    const upgrade = tuning[this.name];
    if (upgrade.cost[upgrade.level] > player.money) return;
    player.money -= upgrade.cost[upgrade.level]
    if (upgrade.level < 3) {
        upgrade.level++;
    }
    if (upgrade.level == 3) {
        this.isClickable = false;
    }
    gsap.to(tuning[this.name], {
        width: upgrade.level * upgrade.widthOffset + 10
    })
}

const tuningButtons = [
    // Hamulce
    new Button({
        position: {
            x: 420,
            y: 215
        },
        imageSrc: "assets/img/tuningButton/Default.png",
        hoverImageSrc: "assets/img/tuningButton/Hover.png",
        isClickable: false,
        name: "brakes",
        click: tuningOnClick
    }),

    // Silnik
    new Button({
        position: {
            x: 420,
            y: 335
        },
        imageSrc: "assets/img/tuningButton/Default.png",
        hoverImageSrc: "assets/img/tuningButton/Hover.png",
        isClickable: false,
        name: "engine",
        click: tuningOnClick
    }),

    // Koła
    new Button({
        position: {
            x: 420,
            y: 455
        },
        imageSrc: "assets/img/tuningButton/Default.png",
        hoverImageSrc: "assets/img/tuningButton/Hover.png",
        isClickable: false,
        name: "wheels",
        click: tuningOnClick
    }),

    // Spojler
    new Button({
        position: {
            x: 925,
            y: 215
        },
        imageSrc: "assets/img/tuningButton/Default.png",
        hoverImageSrc: "assets/img/tuningButton/Hover.png",
        isClickable: false,
        name: "spoiler",
        click: tuningOnClick
    }),

    // Turbo
    new Button({
        position: {
            x: 925,
            y: 335
        },
        imageSrc: "assets/img/tuningButton/Default.png",
        hoverImageSrc: "assets/img/tuningButton/Hover.png",
        isClickable: false,
        name: "turbo",
        click: tuningOnClick
    }),

    // Powrót
    new Button({
        position: {
            x: 900,
            y: 30
        },
        imageSrc: "assets/img/Home/Default.png",
        hoverImageSrc: "assets/img/Home/Hover.png",
        isClickable: false,
        name: "return",
        click: function() {
            const tl = gsap.timeline();
            tl.to(global, {
                alpha: 1,
                duration: 1,
                onComplete: () => {
                    cancelAnimationFrame(frame);
                    tuningButtons.forEach(button => button.isClickable = false);
                    menuButtons.forEach(button => button.isClickable = true);
                    animateMainMenu();
                }
            })
            tl.to(global, {
                alpha: 0,
                duration: 1.5,
            })
        }
    })
]

menuButtons.forEach(button => button.type = "menu");
endScreenButtons.forEach(button => button.type = "endScreen");
tuningButtons.forEach(button => button.type = "tuning");