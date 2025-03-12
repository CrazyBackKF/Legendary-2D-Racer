// const canvas = document.querySelector("canvas");
// const c = canvas.getContext("2d");

const mainMenuBackground = new Image();
mainMenuBackground.src = "assets/img/mainMenuTlo.png";

const menu = new Image();
menu.src = "assets/img/menu.png"

const global = {
    scale: {
        x: 2,
        y: 2
    },
    translation: {
        x: -canvas.width / 2,
        y: -canvas.height
    },
    alpha: 0
}

const mainMenu = {
    translation: {
        x: 0,
        y: 0,
        isTranslating: false,
        currentLvl: 1
    }
}

const circles = [];
for (let i = 0; i < 3; i++) {
    circles.push({position: {x: 350 + i * 150 , y: 500}})
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
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(mainMenu.translation.x, mainMenu.translation.y)
    c.drawImage(mainMenuBackground, 0, 0);
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

    c.font = '30px "Press Start 2P"';
    c.fillStyle = "white";
    c.fillText("123456789", 100, 65);
    
    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`;
    c.fillRect(0, 0, canvas.width, canvas.height);

    frame = requestAnimationFrame(animateMainMenu);
}
animateMainMenu();


canvas.addEventListener("mousemove", (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    let isHovering = false;
    menuButtons.forEach(button => {
        if (isCollidingButtons({x: mouseX, y: mouseY}, button) && button.isClickable) {
            canvas.style.cursor = "pointer";
            isHovering = true;
            button.isHovering = true;
            gsap.to(button.scale, {
                x: button.hoverScale.x,
                y: button.hoverScale.y,
                duration: 0.5,
                ease: "power2.out"
            })
        }
        else {
            button.isHovering = false;
            gsap.to(button.scale, {
                x: button.startScale.x,
                y: button.startScale.y,
                duration: 0.5,
                ease: "power2.out"
            })
        }
    })
    if (!isHovering) canvas.style.cursor = "default";
})

canvas.addEventListener("click", (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    menuButtons.forEach(button => {
        if (isCollidingButtons({x: mouseX, y: mouseY}, button) && button.isClickable) {
            button.click();
        }
    })
})

