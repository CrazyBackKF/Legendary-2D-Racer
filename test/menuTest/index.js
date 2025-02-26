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
    constructor({position, radius, color, strokeColor, text, textColor = "black" , textOffset = {x: 0, y: 0}, click, hoverScale = 10}) {
        this.position = position;
        this.radius = radius;
        this.startRadius = radius;
        this.hoverRadius = radius + hoverScale;
        this.color = color;
        this.strokeColor = strokeColor;
        this.text = text;
        this.click = click;
        this.textColor = textColor;
        this.textOffset = textOffset;
    }

    draw() {
        c.fillStyle = this.color;
        c.strokeStyle = this.strokeColor;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        c.closePath();
        c.fill();
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        c.closePath();
        c.stroke();
        c.fillStyle = this.textColor
        c.font = `${this.radius}px Arial`;
        c.textBaseline = "middle";
        c.textAlign = "center";
        c.fillText(this.text, this.position.x + this.textOffset.x, this.position.y + this.textOffset.y);
    }
}

const buttonTab = [
    new Button({
        position: {
            x: 325,
            y: 530
        },
        radius: 25,
        color: "purple",
        strokeColor: "black",
        text: "←",
        click: () => {
            if (mainMenu.translation.currentLvl == 1) return;
            else mainMenu.translation.currentLvl--;
            changeLvl();
        }
    }),
    new Button({
        position: {
            x: 725,
            y: 530
        },
        radius: 25,
        color: "purple",
        strokeColor: "black",
        text: "→",
        click: () => {
            if (mainMenu.translation.currentLvl == 3) return;
            else mainMenu.translation.currentLvl++;
            changeLvl();
        }
    }),
    new Button({
        position: {
            x: 900,
            y: 500
        },
        radius: 50,
        color: "purple",
        strokeColor: "black",
        text: "▶",
        textColor: "white",
        textOffset: {
            x: 5,
            y: 5
        },
        click: () => {
            console.log("graj") // tu wjebiemy funkcję na przejście do gry
        }
    })
]

const circles = [];
for (let i = 0; i < 3; i++) {
    circles.push({position: {x: 375 + i * 150 , y: 530}})
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

    buttonTab.forEach(button => {
        button.draw();
    })

    circles.forEach((circle, i) => {
        c.strokeStyle = "white";
        c.beginPath();
        c.arc(circle.position.x, circle.position.y, 5, 0, 2 * Math.PI);
        c.closePath();
        c.stroke();

        if (mainMenu.translation.currentLvl == i + 1) {
            c.fillStyle = "white";
            c.beginPath();
            c.arc(circle.position.x, circle.position.y, 5, 0, 2 * Math.PI);
            c.closePath();
            c.fill();
        }
    })
    
    requestAnimationFrame(animateMainMenu);
}
animateMainMenu();

canvas.addEventListener("mousemove", (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    let isHovering = false;
    buttonTab.forEach(button => {
        if (Math.hypot(button.position.x - mouseX, button.position.y - mouseY) <= button.radius) {
            canvas.style.cursor = "pointer";
            gsap.to(button, {
                radius: button.hoverRadius,
                duration: 0.3
            })
            isHovering = true;
        }
        else {
            button.radius = button.startRadius;
            gsap.to(button, {
                radius: button.startRadius,
                duration: 0.3
            })
        }
    })
    if (!isHovering) canvas.style.cursor = "default";
})

canvas.addEventListener("click", (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    buttonTab.forEach(button => {
        if (Math.hypot(button.position.x - mouseX, button.position.y - mouseY) <= button.radius) {
            button.click();
        }
    })
})

