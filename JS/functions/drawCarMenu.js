const carsForeground = new Sprite({
    position: {x: 0, y: 0},
    imageSrc: "assets/img/menus/cars.png"
})

const carsBackground = new Sprite({
    position: {x: 0, y: 0},
    imageSrc: "assets/img/menus/carsBackground.png"
})

const carMenu = {
    translation: {
        x: 0,
        y: 0,
        isTranslating: false,
        currentCar: 1
    }
}

const cars = {
    1: {
        imageSrc: "assets/img/cars/player1.png",
        isOwned: JSON.parse(localStorage.getItem("isOwned1")) || true,
        isSelected: JSON.parse(localStorage.getItem("isSelected1")) !== null ? JSON.parse(localStorage.getItem("isSelected1")) : true
    },
    2: {
        imageSrc: "assets/img/cars/player2.png",
        isOwned: JSON.parse(localStorage.getItem("isOwned2")) || false,
        cost: 100,
        isSelected: JSON.parse(localStorage.getItem("isSelected2")) !== null ? JSON.parse(localStorage.getItem("isSelected2")) : false
    },
    3: {
        imageSrc: "assets/img/cars/player3.png",
        isOwned: JSON.parse(localStorage.getItem("isOwned3")) || false,
        cost: 200,
        isSelected: JSON.parse(localStorage.getItem("isSelected3")) !== null ? JSON.parse(localStorage.getItem("isSelected3")) : false
    },
    4: {
        imageSrc: "assets/img/cars/player4.png",
        isOwned: JSON.parse(localStorage.getItem("isOwned4")) || false,
        cost: 500,
        isSelected: JSON.parse(localStorage.getItem("isSelected4")) !== null ? JSON.parse(localStorage.getItem("isSelected4")) : false
    }
}

function changeCar() {
    for (let i = 0; i < 4; i++) {
        carButtons[3 + i].isClickable = false;
    }
    carButtons[3 + carMenu.translation.currentCar - 1].isClickable = true;
    gsap.to(carMenu.translation, {
        x: -1024 * (carMenu.translation.currentCar - 1),
        duration: 0.5,
        ease: "power4.out"
    })
}

const circlesCar = [];
for (let i = 0; i < 4; i++) {
    circlesCar.push({position: {x: 370 + i * 90 , y: 500}})
}

function animateCarMenu() {
    frame = requestAnimationFrame(animateCarMenu);
    carsBackground.draw();
    c.save();
    c.translate(carMenu.translation.x, carMenu.translation.y)
    carsForeground.draw();
    carButtons.forEach((button) => {
        if (button.name == "buy") {button.draw();}
    })
    for (let i = 0; i < 4; i++) {
        let text;
        let size = 15;
        if (!cars[i + 1].isOwned) text = cars[i + 1].cost;
        else if (!cars[i + 1].isSelected) {
            text = "SELECT";
            size = 12;
            carButtons[3 + i].isClickable = true;
        }
        else {
            text = "SELECTED";
            size = 8;
            carButtons[3 + i].isClickable = false;
        }
        c.save();
        c.translate(470 + 1024 * i + 40, 420)
        c.scale(carButtons[3 + i].scale.x, carButtons[3 + i].scale.y);
        shadowText(text, {x: 0, y: 0}, offset, size);
        c.restore();
    }
    c.restore();

    carButtons.forEach(button => {
        if (button.name != "buy") {
            button.draw();
        }
    });

    circlesCar.forEach((circle, i) => {
        c.strokeStyle = "#C01740";
        c.beginPath();
        c.arc(circle.position.x, circle.position.y, 5.5, 0, 2 * Math.PI);
        c.closePath();
        c.stroke();

        if (carMenu.translation.currentCar == i + 1) {
            c.fillStyle = "#E52554";
            c.beginPath();
            c.arc(circle.position.x, circle.position.y, 5, 0, 2 * Math.PI);
            c.closePath();
            c.fill();
        }
    })

    shadowText(player.money, {x: 90, y: 75}, offset, 30, "start", "bottom");

    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`;
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    currentAnimation = "carMenu";
}