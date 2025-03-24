class Bot extends Player {
    constructor({ position, color, behavior, index, name, imageSrc }) {
        super({ position, color })
        this.angle = convertToRadians(270);
        //zmienne okreslajace bota m. in. szybkosc, kat obrotu, checkpointy
        this.currentCheckpoint = 0;
        this.maxSpeed = 2;
        this.expectedAngle = 0;
        this.brakeValue = 1;
        this.isColliding1 = false;
        this.isColliding2 = false;
        this.speedValue = 0.03;
        this.previousCheckpoint = 0;
        this.laps = -1;
        //zmienne do zachowan botow w zaleznosci od jego typu
        this.shouldAttack = false;
        this.hasBraked = false;
        this.randomOffset = {
            x: 0,
            y: 0
        }
        this.behavior = behavior;
        this.index = index;
        this.lastCheckpointTime = Date.now();
        this.distance = 0;
        this.distanceFromLastCheckpoint = 0;
        this.botPlaying = true;
        this.name = name;
        this.correctPlace;
        //zmienne doassetubota
        this.image = new Image();
        this.image.src = imageSrc;
    }


    //wszystkie metody bota, żeby kod w script.js był czytelniejszy; nie trzeba wywoływać wszystkie metody w script.js, tylko update
    update() {
        this.draw();

        if (key.q) this.drawHitbox();

        this.turn();
        this.changeStatsByBehavior();
        this.accelerate();
        this.changeAngle();
        this.checkObstacles();
        this.move();
        this.checkCheckpoints();
        //this.checkRoad();
        this.checkCollisionWithBots();
        this.checkLaps();
        this.updateDistance();
        //this.deaccelerate();

        if (!this.botPlaying) return;

        this.checkCollisionsWithPlayer();
        this.physics(); //metoda znajduje się w klasie Player, a że Bot dziedziczy z Playera, mogę się do niej odwołać
    }

    //metoda rysuje bota
    drawHitbox() {
        c.save();

        c.translate(global.translation.x + (this.position.x + this.width / 2), global.translation.y + (this.position.y + this.height / 4));
        c.rotate(this.angle);

        c.globalAlpha = 0.5;
        c.fillStyle = this.color;
        c.fillRect(-this.width / 2, -this.height / 4, this.width, this.height);

        c.restore();
    }

    draw() {
        c.save();

        c.translate(global.translation.x + (this.position.x + this.width / 2), global.translation.y + (this.position.y + this.height / 4));
        c.rotate(this.angle);

        c.globalAlpha = this.alpha;
        c.drawImage(this.image, -15, -20);

        c.restore();
    }

    // metoda przyspiesza bota
    move() {
        if (this.speed < this.maxSpeed) this.speed += this.speedValue * this.brakeValue;
    }

    // metoda dodaje szybkosc bota
    accelerate() {
        this.velocity.y = -(this.speed * Math.cos(this.angle) * this.speedMultiplier - this.friction + this.knockback.x) * deltaTime * 120;
        this.velocity.x = (this.speed * Math.sin(this.angle) * this.speedMultiplier - this.friction + this.knockback.y) * deltaTime * 120;
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

        let direction;

        if (!this.shouldAttack) {
            direction = {
                x: checkpointPosition.x - (this.position.x + this.width / 2 + global.translation.x),
                y: checkpointPosition.y - (this.position.y + this.height / 4 + global.translation.y)
            }
        }
        else {
            direction = {
                x: player.position.x + player.width / 2 - (this.position.x + this.width / 2 + global.translation.x),
                y: player.position.y + player.height / 4 - (this.position.y + this.height / 4 + global.translation.y)
            }
        }
        /////////////////////////////////////////////////////////////////do debugowania
        // c.beginPath();
        // c.fillStyle = "black";
        // c.arc(checkpointPosition.x, checkpointPosition.y, 5, 0, 2 * Math.PI);
        // c.closePath();
        // c.fill();
        // c.beginPath();

        // c.strokeStyle = "black";
        // c.moveTo(this.position.x + this.width / 2 + global.translation.x, this.position.y + this.height / 4 + global.translation.y);
        // c.lineTo(checkpointPosition.x, checkpointPosition.y);
        // c.stroke();
        //////////////////////////////////////////////////////////////

        this.expectedAngle = Math.atan2(direction.y, direction.x) + Math.PI / 2; //obliczanie kąta między botem o checkpointem za pomocą funkcji cyklometrzycnzej arcus tangens
    }

    //metoda zmienia na następny checkpoint, po kolizji bota z checkpointem
    checkCheckpoints() {
        for (let i = 0; i < stage[currentMap].checkpointsTab.length; i++) {
            const rotatedRect = getObjectsToCollisions(this, false, this.angle, true)

            //pozycja checkpointa analogiczna do square z poprzednioego for'a   
            const checkpoint = getObjectsToCollisions(stage[currentMap].checkpointsTab[i], false, 0, false, global.scale)
            checkpoint.index = stage[currentMap].checkpointsTab[i].index;

            if (isColliding(rotatedRect, checkpoint) && this.currentCheckpoint - i == 0) {
                if (this.currentCheckpoint < stage[currentMap].checkpointsTab.length - 1) this.currentCheckpoint++;
                else this.currentCheckpoint = 0;
                this.lastCheckpointTime = Date.now();
                this.randomOffset.x = 0;
                this.randomOffset.y = 0;
                this.distance += this.distanceFromLastCheckpoint;
                break;
            }
        }
    }

    //zmianakatu obrotu
    changeAngle() {
        let angleDifference = this.expectedAngle - this.angle;

        // Normalizujemy kąt do zakresu (-π, π)
        angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));

        // Ograniczamy maksymalną prędkość skrętu
        const turnSpeed = 0.05; // Możesz dostosować wartość

        if (Math.abs(angleDifference) < turnSpeed) {
            this.angle = this.expectedAngle; // Drobna korekta, jeśli jest już prawie wyrównane
        } else {
            this.angle += Math.sign(angleDifference) * turnSpeed;
        }
    }

    // sprawdzamy ilosc okrazen
    checkLaps() {
        if (this.currentCheckpoint == 1 && this.currentCheckpoint != this.previousCheckpoint) {
            this.laps++
        }

        if (this.laps == 3) {
            this.distance += 10000000 * (allCars.length - this.place)
            this.correctPlace = this.place;
            this.botPlaying = false;
        }

        this.previousCheckpoint = this.currentCheckpoint;
    }

    // metoda zmienia statystyki w zależności od zachowania bota
    changeStatsByBehavior() {
        // bot jedzie z tą samą szybkością
        if (this.behavior == "stabilny") {
            this.maxSpeed = 2;
            this.speedValue = 0.01;
        }
        // bot jedzie bardzo szybko na prostej i zwalnia na zakręcie
        else if (this.behavior == "sprinter") {
            if (Math.abs(this.expectedAngle - this.angle) > Math.PI / 12) {
                if (!this.hasBraked) this.speed = 1;
                this.hasBraked = true;
                this.maxSpeed = 1;
                this.speedValue = 0.02;
                this.brakeValue = 0.01;
            }
            else {
                this.hasBraked = false;
                this.maxSpeed = 4;
                this.speedValue = 0.05;
                if (this.brakeValue < 1) this.brakeValue += 0.1;
            }
        }
        else if (this.behavior == "agresor") {
            const rotatedRect = getObjectsToCollisions(this, false, this.angle, true, { x: 1, y: 1 }, global.translation);

            const playerRotatedRect = getObjectsToCollisions(player, false, player.angle, false);

            const corners = getPoints(rotatedRect, rotatedRect.angle, global.translation.x + (this.position.x + this.width / 2), global.translation.y + (this.position.y + this.height / 4), true);
            const playerCorners = getPoints(playerRotatedRect, playerRotatedRect.angle, player.position.x + player.width / 2, player.position.y + player.height / 4)

            // for (let key in corners) {
            //     const corner = corners[key];
            //     c.fillStyle = "black"
            //     c.beginPath();
            //     c.arc(corner.x, corner.y, 5, 0, 2 * Math.PI);
            //     c.closePath();
            //     c.fill();
            // }

            // for (let key in playerCorners) {
            //     const corner = playerCorners[key];
            //     c.fillStyle = "black"
            //     c.beginPath();
            //     c.arc(corner.x, corner.y, 5, 0, 2 * Math.PI);
            //     c.closePath();
            //     c.fill();
            // }
            if (Math.abs(this.expectedAngle - this.angle) > Math.PI / 12) {
                if (!this.hasBraked) this.speed = 1;
                this.hasBraked = true;
                this.maxSpeed = 1;
                this.speedValue = 0.02;
                this.brakeValue = 0.01;
            }
            else {
                this.hasBraked = false;
                this.maxSpeed = 3;
                this.speedValue = 0.05;
                if (this.brakeValue < 1) this.brakeValue += 0.1;
            }

            const distance = Math.hypot(corners.mid.x - playerCorners.mid.x, corners.mid.y - playerCorners.mid.y);

            if (distance < 70) this.shouldAttack = true;
            else this.shouldAttack = false;
        }
        else if (this.behavior == "taktyk") {
            this.maxSpeed = 3;
            this.speedValue = 0.03;

        }
    }

    //metoda do sprawdzenia kolizji z przeszkodami
    checkObstacles() {
        let currentlyColliding = false; // Flaga do sprawdzenia, czy nadal jesteśmy w kolizji
        let collisionIndex = -1; //zmienna ktora opisuje index przeszkody z kolizja

        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = getObjectsToCollisions(this, false, this.angle, true, { x: 1, y: 1 }, global.translation);

            const square = getObjectsToCollisions(obstacles[i], false, 0, true, global.scale, global.translation);

            if (isColliding(obstacle, square)) {
                currentlyColliding = true;
                let angleTypeTab = [convertToRadians(110), convertToRadians(-110)]

                // Wykrycie wejścia w kolizję po raz pierwszy
                if (!this.isColliding1) {
                    this.isColliding1 = true;
                    //reakcja na aprzeszkode 'oil'
                    if (obstacles[i].type.type == "oil") {
                        gsap.to(this, {
                            angle: this.angle + angleTypeTab[(Math.floor(Math.random() * 2 + 1)) - 1],
                            duration: 0.5,
                            speed: this.speed - (0.35 * this.speed),
                            ease: "power2.out"
                        })
                        this.oliedMultiplier = 2.5;
                    }
                    //reakcja na przezszkode 'hole'
                    else if (obstacles[i].type.type == "hole") {
                        gsap.to(this, {
                            angle: this.angle + (angleTypeTab[(Math.floor(Math.random() * 2 + 1)) - 1]) / 2,
                            duration: 0.4,
                            speed: this.speed - (0.2 * this.speed),
                            ease: "power2.out"
                        })
                        this.oliedMultiplier = 1.5
                    }
                    //reakcja na 'kolce'
                    else if (obstacles[i].type.type == "spikes") {
                        gsap.to(this, {
                            duration: 0.7,
                            speed: this.speed - this.speed,
                        })
                    }
                    //reakcja na 'traffic cone'
                    else {
                        gsap.to(this, {
                            duration: 0.7,
                            speed: this.speed - (0.4 * this.speed),
                            ease: "power2.out"
                        })

                    }

                    //usuniecie 'oiledMultiplayer' nie ma juz reakcji na to
                    setTimeout(() => {
                        this.oliedMultiplier = 1
                    }, 5000)

                    collisionIndex = i;

                    break; // Jeśli wykryto kolizję, nie trzeba dalej sprawdzać
                }

            }
        }

        if (collisionIndex !== -1 && obstacles[collisionIndex].type.type != "coin" && obstacles[collisionIndex].type.type != "nitro") {
            const position = stage[currentMap].roadTab[Math.floor(Math.random() * stage[currentMap].roadTab.length) + 1].position;
            obstacles.push(new Obstacle({
                position,
                width: 8 * global.scale.x,
                height: 8 * global.scale.y,
                type: obstacles[collisionIndex].type,
                imageSrc: obstacles[collisionIndex].type.imgSrc
            }))
            obstacles.splice(collisionIndex, 1);
        }

        // Resetowanie flagi, gdy wyjedziemy z kolizji
        if (!currentlyColliding) {
            this.isColliding1 = false;
        }
    }

    //metody do sprawdzania kolizji miedzy autami
    checkCollisionsWithPlayer() {

        const car = getObjectsToCollisions(this, true, this.angle, true);

        const enemy = getObjectsToCollisions(player, true, player.angle, false, { x: 1, y: 1 }, { x: -global.translation.x, y: -global.translation.y });

        if (satCollisionWithVertices(car, enemy).colliding) { // napisz do tego kod SAT
            if (!this.isColliding) {
                this.reactToCollisions(player.velocity);
            }
        }
        else {
            this.knockback.x *= 0.8;
            this.knockback.y *= 0.8;
        }
    }

    checkCollisionWithBots() {
        let currentlyColliding = false;
        const enemies = [];

        for (let i = 0; i < bots.length; i++) {
            if (i != this.index) enemies.push(bots[i]);
        }

        for (let i = 0; i < enemies.length; i++) {
            const car = getObjectsToCollisions(this, true, this.angle, true)
            const bot = getObjectsToCollisions(enemies[i], true, enemies[i].angle, true)
            if (satCollisionWithVertices(car, bot).colliding) { // napisz do tego kod SAT
                if (!this.isColliding) {
                    this.isColliding = true;
                    this.reactToCollisions(enemies[i].velocity); // metoda znajduje się w klasie Player, od której klasa Bot dziedziczy
                    currentlyColliding = true
                }
                break; // Jeśli wykryto kolizję, nie trzeba dalej sprawdzać
            }
        }

        // Resetowanie flagi, gdy wyjedziemy z kolizji
        if (!currentlyColliding) {
            this.isColliding = false;
            this.knockback.x *= 0.95;
            this.knockback.y *= 0.95;
        }
    }

    //metoda ktora okresla polozenie checkpointa do ktorego botma jechac
    updateDistance() {
        let lastCheckpoint = this.previousCheckpoint - 1;

        if (this.previousCheckpoint == 0) lastCheckpoint = stage[currentMap].checkpointsTab.length - 1;

        const checkpoint = stage[currentMap].checkpointsTab[lastCheckpoint];
        const checkpointX = (checkpoint.position.x + checkpoint.width / 2) * 2 + global.translation.x;
        const checkpointY = (checkpoint.position.y + checkpoint.height / 2) * 2 + global.translation.y;
        const botX = this.position.x + this.width / 2 + global.translation.x;
        const botY = this.position.y + this.height / 4 + global.translation.y;
        this.distanceFromLastCheckpoint = Math.hypot(checkpointX - botX, checkpointY - botY);
        ////////////////////////////// do debugowania
        // c.strokeStyle = "black";
        // c.beginPath();
        // c.moveTo(botX, botY); 
        // c.lineTo(checkpointX, checkpointY);
        // c.stroke();
    }

    reset() {
        this.angle = convertToRadians(270);
        this.currentCheckpoint = 0;
        this.maxSpeed = 2;
        this.expectedAngle = 0;
        this.brakeValue = 1;
        this.isColliding1 = false;
        this.speedValue = 0.03;
        this.previousCheckpoint = 0;
        this.laps = -1;
        this.shouldAttack = false;
        this.hasBraked = false;
        this.randomOffset = {
            x: 0,
            y: 0
        }
        this.distance = 0;
        this.distanceFromLastCheckpoint = 0;
        this.botPlaying = true;
    }
}