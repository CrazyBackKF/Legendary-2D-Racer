class Bot extends Player {
    constructor({ position, color }) {
        super({ position, color })
        this.angle = convertToRadians(270);
        this.currentCheckpoint = 0;
        this.maxSpeed = 3;
    }

    //wszystkie metody bota, żeby kod w script.js był czytelniejszy; nie trzeba wywoływać wszystkie metody w script.js, tylko update
    update() {
        this.draw()
        this.move();
        this.accelerate();
        this.turn();
        this.physics();
        this.checkCheckpoints();
    }

    //metoda rysuje bota
    draw() {
        c.save();
        c.translate(player.camerabox.translation.x + (this.position.x + this.width / 2), player.camerabox.translation.y + (this.position.y + this.height / 4));
        c.rotate(this.angle);
        c.fillStyle = this.color
        c.fillRect(-this.width / 2, -this.height / 4, this.width, this.height)
        c.restore();
    }

    // metoda przyspiesza bota
    move() {
        if (this.speed <= this.maxSpeed) this.speed += 0.1
    }

    // metoda dodaje szybkosc bota
    accelerate() {
        this.velocity.y = -(this.speed * Math.cos(this.angle) * this.speedMultiplier);
        this.velocity.x = this.speed * Math.sin(this.angle) * this.speedMultiplier;
    }

    // metoda zmienia botowi pozycje
    physics() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    // metoda skręca bota, żeby kierował się na następny checkpoint
    turn() {
        const checkpoint = stage[currentMap].checkpointsTab[this.currentCheckpoint];
        const checkpointPosition = {
            x: (checkpoint.position.x * 2 + checkpoint.width / 2 * 2 + player.camerabox.translation.x),
            y: (checkpoint.position.y * 2 + checkpoint.height / 2 * 2 + player.camerabox.translation.y)
        }
        /////////////////////////////////////////////////////////////////do debugowania
        c.beginPath();
        c.fillStyle = "black";
        c.arc(checkpointPosition.x, checkpointPosition.y, 5, 0, 2 * Math.PI);
        c.closePath();
        c.fill();
        const direction = {
            x: checkpointPosition.x - (this.position.x + this.width / 2 + player.camerabox.translation.x),
            y: checkpointPosition.y - (this.position.y + this.height / 4 + player.camerabox.translation.y)
        }
        c.beginPath();

        c.strokeStyle = "black";
        c.moveTo(this.position.x + this.width / 2 + player.camerabox.translation.x, this.position.y + this.height / 4 + player.camerabox.translation.y);
        c.lineTo(checkpointPosition.x, checkpointPosition.y);
        c.stroke();
        //////////////////////////////////////////////////////////////

        this.angle = Math.atan2(direction.y, direction.x) + Math.PI / 2; //obliczanie kąta między botem o checkpointem za pomocą funkcji cyklometrzycnzej arcus tangens
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
                    x: (stage[currentMap].checkpointsTab[i].position.x * 2),
                    y: (stage[currentMap].checkpointsTab[i].position.y * 2),
                    width: stage[currentMap].checkpointsTab[i].width * 2,
                    height: stage[currentMap].checkpointsTab[i].height * 2,
                    index: stage[currentMap].checkpointsTab[i].index
                }

                if (isColliding(rotatedRect, checkpoint) && this.currentCheckpoint - i == 0) {
                    if (this.currentCheckpoint < stage[currentMap].checkpointsTab.length - 1) this.currentCheckpoint++;
                    else this.currentCheckpoint = 0;
                    break;
                }
            }
    }
}