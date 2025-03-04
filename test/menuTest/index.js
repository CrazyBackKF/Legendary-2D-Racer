const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const background = new Image();
background.src = "img/tlo.png";

const menu = new Image();
menu.src = "img/menu.png"

const mainMenu = {
    translation: {
        x: 0,
        y: 0,
        isTranslating: false,
        currentLvl: 1
    }
}

class Button {
    constructor({ position, click, imageSrc, hoverImageSrc, scale = {x: 1, y: 1} }) {
        this.position = position;
        this.click = click;
        this.image = new Image();
        this.hoverImage = new Image();
        this.image.src = imageSrc;
        this.hoverImage.src = hoverImageSrc;
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        }
        this.isHovering = false;
        this.scale = scale;
        this.startScale = {
            x: scale.x,
            y: scale.y
        }
        this.hoverScale = {
            x: scale.x * 1.2,
            y: scale.y * 1.2
        }
    }

    draw() {
        c.save();
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        c.scale(this.scale.x, this.scale.y);
        if (!this.isHovering) {
            c.drawImage(this.image, -this.width / 2, -this.height / 2);
        }
        else {
            c.drawImage(this.hoverImage, -this.width / 2, -this.height / 2);
        }
        c.restore();
    }
}

const buttonTab = [
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

function animateMainMenu() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(mainMenu.translation.x, mainMenu.translation.y)
    c.drawImage(background, 0, 0);
    c.restore();
    c.drawImage(menu, 0, 0);

    buttonTab.forEach((button) => {
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
    
    requestAnimationFrame(animateMainMenu);
}
animateMainMenu();

function isCollidingButtons(mouse, button) {
    const scaledWidth = button.width * button.scale.x;
    const scaledHeight = button.height * button.scale.y;

    const offsetX = (scaledWidth - button.width) / 2;
    const offsetY = (scaledHeight - button.height) / 2;

    const scaledX = button.position.x - offsetX;
    const scaledY = button.position.y - offsetY;

    return (
        mouse.x > scaledX &&
        mouse.x < scaledX + scaledWidth &&
        mouse.y > scaledY &&
        mouse.y < scaledY + scaledHeight
    );
}


canvas.addEventListener("mousemove", (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    let isHovering = false;
    buttonTab.forEach(button => {
        if (isCollidingButtons({x: mouseX, y: mouseY}, button)) {
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
            console.log(button.startScale)
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
    buttonTab.forEach(button => {
        if (isCollidingButtons({x: mouseX, y: mouseY}, button)) {
            button.click();
        }
    })
})

