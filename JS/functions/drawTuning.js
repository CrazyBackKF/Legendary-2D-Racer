const tuningBackground = new Image();
tuningBackground.src = "assets/img/menus/tuning.png";

const tuning = {
    brakes: {
        cost: [100, 200, 500, "max"],
        level: JSON.parse(localStorage.getItem("brakesLevel")) || 0,
        width: JSON.parse(localStorage.getItem("brakesWidth")) || 10,
        drawOffset: 0,
        widthOffset: 98,
        stats: {
            0: 0.01,
            1: 0.02,
            2: 0.03,
            3: 0.05
        }
    },
    engine: {
        cost: [100, 200, 500, "max"],
        level: JSON.parse(localStorage.getItem("engineLevel")) || 0,
        width: JSON.parse(localStorage.getItem("engineWidth")) || 10,
        drawOffset: 0,
        widthOffset: 98,
        stats: {
            0: 3,
            1: 3.5,
            2: 4,
            3: 4.2
        }
    },
    wheels: {
        cost: [100, 200, 500, "max"],
        level: JSON.parse(localStorage.getItem("wheelsLevel")) || 0,
        width: JSON.parse(localStorage.getItem("wheelsWidth")) || 10,
        drawOffset: 0,
        widthOffset: 98,
        stats: {
            0: 0.02,
            1: 0.015,
            2: 0.01,
            3: 0
        }

    },
    spoiler: {
        cost: [100, 200, 500, "max"],
        level: JSON.parse(localStorage.getItem("spoilerLevel")) || 0,
        width: JSON.parse(localStorage.getItem("spoilerWidth")) || 10,
        drawOffset: 23.2,
        widthOffset: 91.3,
        stats: {
            0: 0.02,
            1: 0.025,
            2: 0.028,
            3: 0.03
        }
    },
    turbo: {
        cost: [100, 200, 500, "max"],
        level: JSON.parse(localStorage.getItem("turboLevel")) || 0,
        width: JSON.parse(localStorage.getItem("turboWidth")) || 10,
        drawOffset: 25,
        widthOffset: 91,
        stats: {
            0: 1.5,
            1: 2,
            2: 2.5,
            3: 3
        }
    }
}

function animateTuning() {
    frame = requestAnimationFrame(animateTuning);

    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
    tuningButtons.forEach(button => {
        if (button.name != "return") {
            const upgrade = tuning[button.name]
            if (upgrade.level == 3) button.isClickable = false;
            c.fillStyle = "#C01740";
            c.fillRect(button.position.x - 319 + upgrade.drawOffset, button.position.y - 10, upgrade.width, 70);
        }
        
    })
    c.drawImage(tuningBackground, 0, 0);
    shadowText(player.money, {x: 100, y: 65}, offset, 30, "start", "bottom");

    tuningButtons.forEach(button => {
        button.draw();
        // powiększam cene wraz z przyciskiem, po najechaniu na niego
        if (button.name != "return") {
            c.save();
            c.translate(button.position.x + button.width / 2, button.position.y + button.height / 2);
            c.scale(button.scale.x, button.scale.y);
            shadowText(tuning[button.name].cost[tuning[button.name].level], {x: 0, y: 0}, 3, 15);
            c.restore();
        }
    });
    c.fillStyle = `rgba(0, 0, 0, ${global.alpha})`;
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (let key in tuning) {
        const upgrade = tuning[key];
        localStorage.setItem(`${key}Level`, JSON.stringify(upgrade.level));
        localStorage.setItem(`${key}Width`, JSON.stringify(upgrade.width));
    }
    localStorage.setItem("money", JSON.stringify(player.money));
    currentAnimation = "tuning";
}