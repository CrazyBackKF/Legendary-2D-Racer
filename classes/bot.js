class Bot extends Player {
    constructor({ position, color, behavior }) {
        super({ position, color })
        this.angle = convertToRadians(270);
        this.currentCheckpoint = 0;
        this.maxSpeed = 1.5;
        this.desiredAngle = 0;
        this.brakeValue = 1;
        this.speedValue = 0.2;
        this.previousCheckpoint = 0;
        this.laps = 0;
        this.hasBraked = false;
        this.randomOffset = {
            x: 0,
            y: 0
        }
        this.behavior = behavior;
    }

    //wszystkie metody bota, żeby kod w script.js był czytelniejszy; nie trzeba wywoływać wszystkie metody w script.js, tylko update
    update() {
        this.draw();
        this.changeStatsByBehavior();
        this.move();
        this.accelerate();
        this.turn();
        this.changeAngle();
        this.physics(); //metoda znajduje się w klasie Player, a że Bot dziedziczy z Playera, mogę się do niej odwołać
        this.checkCheckpoints();
        this.checkLaps();
    }

    physics() {
        if (!deltaTime) return;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    //metoda rysuje bota
    draw() {
        c.save();
        c.translate(global.translation.x + (this.position.x + this.width / 2), global.translation.y + (this.position.y + this.height / 4));
        c.rotate(this.angle);
        c.fillStyle = this.color
        c.fillRect(-this.width / 2, -this.height / 4, this.width, this.height)
        c.restore();
    }

    // metoda przyspiesza bota
    move() {
        this.speed += this.speedValue * this.brakeValue;
    }
    // metoda dodaje szybkosc bota
    accelerate() {
        this.velocity.y = -(this.speed * Math.cos(this.angle) * this.speedMultiplier - this.friction) * deltaTime * 120;
        this.velocity.x = this.speed * Math.sin(this.angle) * this.speedMultiplier - this.friction * deltaTime * 120;
    }

    // metoda skręca bota, żeby kierował się na następny checkpoint
    turn() {
        const checkpoint = stage[currentMap].checkpointsTab[this.currentCheckpoint];

        // losuje za każdym chekpointem inną pozycje, żeby boty nie jechały za każdym razem do tego samego miejsca
        if (this.randomOffsetX === 0 && this.randomOffsetY === 0) {
            const randomFactor = 0.6; // Kontroluje zakres losowości (np. 40% szerokości)
            this.randomOffsetX = (Math.random() - 0.5) * checkpoint.width * global.scale.x * randomFactor;
            this.randomOffsetY = (Math.random() - 0.5) * checkpoint.height * global.scale.y * randomFactor;
        }

        const checkpointPosition = {
            x: (checkpoint.position.x * global.scale.x + checkpoint.width / 2 * global.scale.x + global.translation.x + this.randomOffset.x),
            y: (checkpoint.position.y * global.scale.y + checkpoint.height / 2 * global.scale.y + global.translation.y + this.randomOffset.y)
        }
        const direction = {
            x: checkpointPosition.x - (this.position.x + this.width / 2 + global.translation.x),
            y: checkpointPosition.y - (this.position.y + this.height / 4 + global.translation.y)
        }
        /////////////////////////////////////////////////////////////////do debugowania
        c.beginPath();
        c.fillStyle = "black";
        c.arc(checkpointPosition.x, checkpointPosition.y, 5, 0, 2 * Math.PI);
        c.closePath();
        c.fill();
        c.beginPath();

        c.strokeStyle = "black";
        c.moveTo(this.position.x + this.width / 2 + global.translation.x, this.position.y + this.height / 4 + global.translation.y);
        c.lineTo(checkpointPosition.x, checkpointPosition.y);
        c.stroke();
        //////////////////////////////////////////////////////////////

        this.desiredAngle = Math.atan2(direction.y, direction.x) + Math.PI / 2; //obliczanie kąta między botem o checkpointem za pomocą funkcji cyklometrzycnzej arcus tangens
    }

    //metoda zmienia na następny checkpoint, po kolizji bota z checkpointem
    checkCheckpoints() {
        for (let i = 0; i < stage[currentMap].checkpointsTab.length; i++) {
            const rotatedRect = {
                x: this.position.x,
                y: this.position.y,
                width: this.width,
                height: this.height,
                angle: this.angle
            };

            //pozycja checkpointa analogiczna do square z poprzednioego for'a   
            const checkpoint = {
                x: (stage[currentMap].checkpointsTab[i].position.x * global.scale.x),
                y: (stage[currentMap].checkpointsTab[i].position.y * global.scale.y),
                width: stage[currentMap].checkpointsTab[i].width * global.scale.x,
                height: stage[currentMap].checkpointsTab[i].height * global.scale.y,
                index: stage[currentMap].checkpointsTab[i].index
            }

            if (isColliding(rotatedRect, checkpoint) && this.currentCheckpoint - i == 0) {
                if (this.currentCheckpoint < stage[currentMap].checkpointsTab.length - 1) this.currentCheckpoint++;
                else this.currentCheckpoint = 0;
                this.randomOffset.x = 0;
                this.randomOffset.y = 0;
                break;
            }
        }
    }

    changeAngle() {
        let angleDifference = this.desiredAngle - this.angle;

        // Normalizujemy kąt do zakresu (-π, π)
        angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));

        // Ograniczamy maksymalną prędkość skrętu
        const turnSpeed = 0.025; // Możesz dostosować wartość

        if (Math.abs(angleDifference) < turnSpeed) {
            this.angle = this.desiredAngle; // Drobna korekta, jeśli jest już prawie wyrównane
        } else {
            this.angle += Math.sign(angleDifference) * turnSpeed;
        }
    }

    checkLaps() {
        if (this.currentCheckpoint == 1 && this.currentCheckpoint != this.previousCheckpoint) this.laps++;
        if (this.laps == 3) {
            console.log("Bot wygrał")
        }
        this.previousCheckpoint = this.currentCheckpoint;
    }

    // metoda zmienia statystyki w zależności od zachowania bota
    changeStatsByBehavior() {
        // bot jedzie z tą samą szybkością
        if (this.behavior == "stabilny") {
            this.maxSpeed = 2;
            this.speedValue = 0.03;
        }
        // bot jedzie bardzo szybko na prostej i zwalnia na zakręcie
        else if (this.behavior == "sprinter") {
            if (Math.abs(this.desiredAngle - this.angle) > Math.PI / 12) {
                if (!this.hasBraked) this.speed = 1;
                console.log("skręcam");
                this.hasBraked = true;
                this.maxSpeed = 1;
                this.speedValue = 0.02;
                this.brakeValue = 0.01;
            }
            else {
                console.log("prosta");
                this.hasBraked = false;
                this.maxSpeed = 3;
                this.speedValue = 0.03;
                if (this.brakeValue < 1) this.brakeValue += 0.1;
            } 
        }
        else if (this.behavior == "agresor") {
            
        }
    }
}