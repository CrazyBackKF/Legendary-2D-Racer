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

//deklaracja przyciskow, każde w innej tablicy, żeby łatwiej je było chować i rysować, w zależności od potrzeb
const tuningButtons = [
    // Hamulce
    new Button({
        position: {
            x: 420,
            y: 215
        },
        imageSrc: "assets/img/Buttons/tuningButton/Default.png",
        hoverImageSrc: "assets/img/Buttons/tuningButton/Hover.png",
        name: "brakes",
        click: tuningOnClick
    }),

    // Silnik
    new Button({
        position: {
            x: 420,
            y: 335
        },
        imageSrc: "assets/img/Buttons/tuningButton/Default.png",
        hoverImageSrc: "assets/img/Buttons/tuningButton/Hover.png",
        name: "engine",
        click: tuningOnClick
    }),

    // Koła
    new Button({
        position: {
            x: 420,
            y: 455
        },
        imageSrc: "assets/img/Buttons/tuningButton/Default.png",
        hoverImageSrc: "assets/img/Buttons/tuningButton/Hover.png",
        name: "wheels",
        click: tuningOnClick
    }),

    // Spojler
    new Button({
        position: {
            x: 925,
            y: 215
        },
        imageSrc: "assets/img/Buttons/tuningButton/Default.png",
        hoverImageSrc: "assets/img/Buttons/tuningButton/Hover.png",
        name: "spoiler",
        click: tuningOnClick
    }),

    // Turbo
    new Button({
        position: {
            x: 925,
            y: 335
        },
        imageSrc: "assets/img/Buttons/tuningButton/Default.png",
        hoverImageSrc: "assets/img/Buttons/tuningButton/Hover.png",
        name: "turbo",
        click: tuningOnClick
    }),

    // Powrót
    new Button({
        position: {
            x: 900,
            y: 30
        },
        imageSrc: "assets/img/Buttons/Home/Default.png",
        hoverImageSrc: "assets/img/Buttons/Home/Hover.png",
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
        imageSrc: "assets/img/Buttons/ArrowLeft/Default.png",
        hoverImageSrc: "assets/img/Buttons/ArrowLeft/Hover.png",
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
        imageSrc: "assets/img/Buttons/ArrowRight/Default.png",
        hoverImageSrc: "assets/img/Buttons/ArrowRight/Hover.png",
    }),

    // Powrót
    new Button({
        position: {
            x: 900,
            y: 30
        },
        imageSrc: "assets/img/Buttons/Home/Default.png",
        hoverImageSrc: "assets/img/Buttons/Home/Hover.png",
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

// prędkościomierz w UI gry
const speedometer = new Sprite({
    position: {
        x: 2800,
        y: 1350
    },
    imageSrc: "assets/img/Sprites/speedometer/speedometer.png",
    scale: {
        x: 0.5,
        y: 0.5
    },
    alpha: 0.8,
})

const pointer = new Sprite({     // Po angielsku to chyba pointer xd (chodzi o wskazówke do prędkościomierza)
    position: {
        x: 2990,
        y: 1525
    },
    imageSrc: "assets/img/Sprites/speedometer/wskaznik.png",
    scale: {
        x: 0.5,
        y: 0.5
    },
    translation: {
        x: 1507.5,
        y: 775
    },
    isMovingWithTranslation: true,
    alpha: 0.8
});

// obraz wyświetla się po skończeniu wyścigu
const endScreen = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "assets/img/menus/endScreen.png",
    alpha: 0.98
})

// moneta w menu i w grze
const coin = new Sprite({
    position: {
        x: 1150,
        y: 170
    },
    imageSrc: "assets/img/Sprites/Coin/Coin.png",
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
        imageSrc: "assets/img/Buttons/ArrowLeft/Default.png",
        hoverImageSrc: "assets/img/Buttons/ArrowLeft/Hover.png"
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
        imageSrc: "assets/img/Buttons/ArrowRight/Default.png",
        hoverImageSrc: "assets/img/Buttons/ArrowRight/Hover.png"
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
                    music.mainMenu.stop();
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
        imageSrc: "assets/img/Buttons/Play/Default.png",
        hoverImageSrc: "assets/img/Buttons/Play/Hover.png"
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
        imageSrc: "assets/img/Buttons/Tuning/Default.png",
        hoverImageSrc: "assets/img/Buttons/Tuning/Hover.png",
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
        imageSrc: "assets/img/Buttons/CarButton/Default.png",
        hoverImageSrc: "assets/img/Buttons/CarButton/Hover.png",
        scale: {
            x: 0.7,
            y: 0.7
        }
    }),
    new Button({
        position: {
            x: 700,
            y: 5
        },
        imageSrc: "assets/img/Buttons/Help/Default.png",
        hoverImageSrc: "assets/img/Buttons/Help/Hover.png",
        scale: {
            x: 0.7,
            y: 0.7
        },
        click: function() {
            // przejscie do help screen
            const tl = gsap.timeline();
            tl.to(global, {
                alpha: 1,
                duration: 1,
                onComplete: () => {
                    cancelAnimationFrame(frame);
                    menuButtons.forEach(button => button.isClickable = false);
                    helpButtons.forEach(button => button.isClickable = true);
                    animateHelpScreen();
                }
            })
            tl.to(global, {
                alpha: 0, 
                duration: 1,
            })
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
                    if (!music.mainMenu.playing()) music.mainMenu.play()
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
        imageSrc: "assets/img/Buttons/endScreenPlayButton/Default.png",
        hoverImageSrc: "assets/img/Buttons/endScreenPlayButton/Hover.png",
    })
]

//for z przyciskami do zmiany samochodu
for (let i = 0; i < 4; i++) {
    carButtons.push(new Button({
        position: {
            x: 470 + 1024 * i,
            y: 400
        },
        imageSrc: "assets/img/Buttons/tuningButton/Default.png",
        hoverImageSrc: "assets/img/Buttons/tuningButton/Hover.png",
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

const helpButtons = [
    new Button({
        position: {
            x: 900,
            y: 450
        },
        click: function() {
            const tl = gsap.timeline();
            tl.to(global, {
                alpha: 1,
                duration: 1,
                onComplete: () => {
                    cancelAnimationFrame(frame);
                    helpButtons.forEach(button => button.isClickable = false);
                    menuButtons.forEach(button => button.isClickable = true);
                    animateMainMenu();
                }
            })
            tl.to(global, {
                alpha: 0,
                duration: 1.5,
            })
        },
        imageSrc: "assets/img/Buttons/ArrowRight/Default.png",
        hoverImageSrc: "assets/img/Buttons/ArrowRight/Hover.png"
    })
]

const pauseButtons = [
    new Button({
        position: {
            x: canvas.width / 2 - 50,
            y: 250
        },
        scale: {
            x: 3,
            y: 1.5
        },
        click: function () {
            cancelAnimationFrame(frame);
            counter = 3;
            pauseButtons.forEach(button => button.isClickable = false);
            startAnimation();
        },
        imageSrc: "assets/img/Buttons/tuningButton/Default.png", // nie potrzeba nowego przycisku, bo ten świetnie się sprawdza
        hoverImageSrc: "assets/img/Buttons/tuningButton/Hover.png",
    }),
    new Button({
        position: {
            x: canvas.width / 2 - 50,
            y: 350
        },
        scale: {
            x: 3,
            y: 1.5
        },
        click: function() {
            const tl = gsap.timeline();
            tl.to(global, {
                alpha: 1,
                duration: 1,
                onComplete: () => {
                    cancelAnimationFrame(frame);
                    pauseButtons.forEach(button => button.isClickable = false);
                    menuButtons.forEach(button => button.isClickable = true);
                    player.isPlaying = false;
                    bots.forEach(bot => bot.botPlaying = false)
                    animateMainMenu();
                }
            })
            tl.to(global, {
                alpha: 0,
                duration: 1.5,
            })
        },
        imageSrc: "assets/img/Buttons/tuningButton/Default.png",
        hoverImageSrc: "assets/img/Buttons/tuningButton/Hover.png",
    })
]

const startButtons = [
    new Button({
        position: {
            x: 465,
            y: 400
        },
        scale: {
            x: 2,
            y: 2
        },
        click: function() {
            const tl = gsap.timeline();
            tl.to(global, {
                alpha: 1,
                duration: 1,
                onComplete: () => {
                    music.startMenu.stop();
                    if (!music.mainMenu.playing()) music.mainMenu.play();
                    cancelAnimationFrame(frame);
                    startButtons.forEach(button => button.isClickable = false);
                    menuButtons.forEach(button => button.isClickable = true);
                    if (global.firstTime) {
                        global.firstTime = false;
                        localStorage.setItem("firstTime", JSON.stringify(false));
                        menuButtons.forEach(button => button.isClickable = false);
                        helpButtons.forEach(button => button.isClickable = true);
                        animateHelpScreen();
                    }
                    else {
                        helpButtons.forEach(button => button.isClickable = false);
                        menuButtons.forEach(button => button.isClickable = true);
                        animateMainMenu();
                    }
                }
            })
            tl.to(global, {
                alpha: 0,
                duration: 1.5,
            })
        },
        imageSrc: "assets/img/Buttons/ArrowRight/Default.png", // wygląda na znak "play" lol
        hoverImageSrc: "assets/img/Buttons/ArrowRight/Hover.png"
    })
]

//określanie typow przyciskow
menuButtons.forEach(button => button.type = "menu");
endScreenButtons.forEach(button => button.type = "endScreen");
tuningButtons.forEach(button => button.type = "tuning");
helpButtons.forEach(button => button.type = "help");
pauseButtons.forEach(button => button.type = "pause");
startButtons.forEach(button => button.type = "start");