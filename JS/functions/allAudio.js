// audio do samochodu
const carAudios = {
    idle: new Howl({
        src: ["assets/audio/car/idle.wav"],
        volume: 0.05,
        autoplay: false,
        loop: true
    }),
    startup: new Howl({
        src: ["assets/audio/car/startup.wav"],
        volume: 0.05,
        autoplay: false,
        loop: true
    }),
    lowOn: new Howl({
        src: ["assets/audio/car/low_on.wav"],
        volume: 0.05,
        autoplay: false,
        loop: true
    }),
    medOn: new Howl({
        src: ["assets/audio/car/med_on.wav"],
        volume: 0.05,
        autoplay: false,
        loop: true
    }),
    highOn: new Howl({
        src: ["assets/audio/car/high_on.wav"],
        volume: 0.05,
        autoplay: false,
        loop: true
    }),
    max: new Howl({
        src: ["assets/audio/car/maxRPM.wav"],
        volume: 0.05,
        autoplay: false,
        loop: true
    }),
    lowOff: new Howl({
        src: ["assets/audio/car/low_off.wav"],
        volume: 0.05,
        autoplay: false,
        loop: true
    }),
    medOff: new Howl({
        src: ["assets/audio/car/med_off.wav"],
        volume: 0.05,
        autoplay: false,
        loop: true
    }),
    highOff: new Howl({
        src: ["assets/audio/car/high_off.wav"],
        volume: 0.05,
        autoplay: false,
        loop: true
    }),
}

// muzyka w tle, w grze, menu i na przyciski, po ich kliknięciu
const music = {
    game: [],
    startMenu: new Howl({
        src: ["assets/audio/music/startMenu.wav"],
        loop: true,
        volume: 0.5,
        autoplay: false
    }),
    mainMenu: new Howl({
        src: ["assets/audio/music/mainMenu.ogg"],
        loop: true,
        volume: 0.5,
        autoplay: false
    }),
    button: new Howl({
        src: ["assets/audio/music/button.wav"],
        loop: false,
        volume: 0.7,
        autoplay: false
    })
}

// w grze znajduje się 7 piosenek, które odtwarzają się losowo
for (let i = 1; i <= 7; i++) {
    music.game.push(`assets/audio/music/game/${i}.ogg`)
}