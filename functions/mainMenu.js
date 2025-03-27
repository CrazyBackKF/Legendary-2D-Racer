// const canvas = document.querySelector("canvas");
// const c = canvas.getContext("2d");

const mainMenuBackground = new Image();
mainMenuBackground.src = "assets/img/mainMenuTlo.png";

const menu = new Image();
menu.src = "assets/img/menu.png"

const mainMenu = {
    translation: {
        x: 0,
        y: 0,
        isTranslating: false,
        currentLvl: 1
    }
}

const circles = [];
for (let i = 0; i < 5; i++) {
    circles.push({position: {x: 350 + i * 75 , y: 500}})
}

function changeLvl() {
    gsap.to(mainMenu.translation, {
        x: -1024 * (mainMenu.translation.currentLvl - 1),
        duration: 0.5,
        ease: "power4.out"
    })
}

let frame;

function animateMainMenu() {
    if (currentAnimation == "game" || currentAnimation == "pause") {
        song.stop();
        for (let key in carAudios) {
            const audio = carAudios[key];
            audio.stop();
        }
    }
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(mainMenu.translation.x, mainMenu.translation.y)
    c.drawImage(mainMenuBackground, 0, 0);
    for (let i = 0; i < Object.keys(stage).length; i++) {
        c.fillStyle = "rgba(173, 216, 230, 0.8)";
        c.fillRect(50 + 1024 * i, 150, 150, 70);
        shadowText("BEST TIME", {x: 60 + 1024 * i, y: 160}, 2.2, 15, "start", "top");
        if (stage[i + 1].bestTime >= 0) { // ustawiam bestTime za pierwszym razem na -1
            shadowText(getTime(stage[i + 1].bestTime), {x: 80 + 1024 * i, y: 190}, 2.2, 20, "start", "top")
        }
    }
    c.restore();
    c.drawImage(menu, 0, 0);

    menuButtons.forEach((button) => {
        button.draw();
    })

    circles.forEach((circle, i) => {
        c.strokeStyle = "#C01740";
        c.beginPath();
        c.arc(circle.position.x, circle.position.y, 5.5, 0, 2 * Math.PI);
        c.closePath();
        c.stroke();

        if (mainMenu.translation.currentLvl == i + 1) {
            c.fillStyle = "#E52554";
            c.beginPath();
            c.arc(circle.position.x, circle.position.y, 5, 0, 2 * Math.PI);
            c.closePath();
            c.fill();
        }
    })

    shadowText(player.money, {x: 100, y: 65}, offset, 30, "start", "bottom");

    
    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`;
    c.fillRect(0, 0, canvas.width, canvas.height);

    frame = requestAnimationFrame(animateMainMenu);
    currentAnimation = "mainMenu";
    cursor.draw();
}


