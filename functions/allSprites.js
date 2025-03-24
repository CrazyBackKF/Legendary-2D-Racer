//funkcja do przycisku tuning
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

//deklaracja przyciskow
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

const carButtons = [
    new Button({
        position: {
            x: 235,
            y: 450
        },
        click: function() {
            if (carMenu.translation.currentCar == 1) return;
            else carMenu.translation.currentCar--;
            changeCar();
        },
        imageSrc: "assets/img/ArrowLeft/Default.png",
        hoverImageSrc: "assets/img/ArrowLeft/Hover.png",
        isClickable: false
    }),

    new Button({
        position: {
            x: 710,
            y: 450
        },
        click: function() {
            if (carMenu.translation.currentCar == 4) return;
            else carMenu.translation.currentCar++;
            changeCar();
        },
        imageSrc: "assets/img/ArrowRight/Default.png",
        hoverImageSrc: "assets/img/ArrowRight/Hover.png",
        isClickable: false
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
        click: function() {
            const tl = gsap.timeline();
            tl.to(global, {
                alpha: 1,
                duration: 1,
                onComplete: () => {
                    cancelAnimationFrame(frame);
                    carButtons.forEach(button => button.isClickable = false);
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

const coin = new Sprite({
    position: {
        x: 1150,
        y: 170
    },
    imageSrc: "assets/img/Icons/Coin.png",
    scale: {
        x: 0.6,
        y: 0.6
    }
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
            if (mainMenu.translation.currentLvl == 5) return;
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
            // tu przejscie do tuningu
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
    }),
    new Button({
        position: {
            x: 800,
            y: 5
        },
        click: function() {
            // przejscie do wyboru samochodu
            const tl = gsap.timeline();
            tl.to(global, {
                alpha: 1,
                duration: 1,
                onComplete: () => {
                    cancelAnimationFrame(frame);
                    menuButtons.forEach(button => button.isClickable = false);
                    carButtons.forEach(button => button.isClickable = true);
                    animateCarMenu();
                }
            })
            tl.to(global, {
                alpha: 0,
                duration: 1.5,
            })
        },
        imageSrc: "assets/img/CarButton/Default.png",
        hoverImageSrc: "assets/img/CarButton/Hover.png",
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

//for z przyciskami do zmiany samochodu
for (let i = 0; i < 4; i++) {
    carButtons.push(new Button({
        position: {
            x: 470 + 1024 * i,
            y: 400
        },
        imageSrc: "assets/img/tuningButton/Default.png",
        hoverImageSrc: "assets/img/tuningButton/Hover.png",
        isClickable: false,
        name: "buy",
        translation: {
            x: -1024 * i,
            y: 0
        },
        click: function() {
            if (carMenu.translation.currentCar == i + 1) {
                if (!cars[i + 1].isOwned && player.money >= cars[i + 1].cost) {
                    player.money -= cars[i + 1].cost;
                    localStorage.setItem(`money`, JSON.stringify(player.money));
                    cars[i + 1].isOwned = true;
                    localStorage.setItem(`isOwned${i + 1}`, JSON.stringify(true));
                }
                else if (!cars[i + 1].isSelected) {
                    for (let j = 0; j < 4; j++) {
                        if (i != j) {
                            cars[j + 1].isSelected = false;
                            localStorage.setItem(`isSelected${j + 1}`, JSON.stringify(false));
                        }
                    }
                    cars[i + 1].isSelected = true;
                    localStorage.setItem(`isSelected${i + 1}`, JSON.stringify(true));
                    player.imageSrc = cars[i + 1].imageSrc;
                    localStorage.setItem(`playerSprite`, JSON.stringify(player.imageSrc));
                }
            }
        }
    }))
}

//wywalywanie przyciskow
menuButtons.forEach(button => button.type = "menu");
endScreenButtons.forEach(button => button.type = "endScreen");
tuningButtons.forEach(button => button.type = "tuning");