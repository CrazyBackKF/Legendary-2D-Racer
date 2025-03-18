class Obstacle {
    constructor({ position, type, width, height }) {
        this.position = position;
        this.type = type;
        this.width = width;
        this.height = height;
        this.isColliding = false;
    }

    update() {
        this.draw();
        this.checkCollisonBetweenObstacles();
    }

    draw() {
        c.save();
        c.translate(global.translation.x, global.translation.y);
        c.scale(global.scale.x, global.scale.y)
        c.fillStyle = this.type.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.restore();
    }

    checkCollisonBetweenObstacles() {
        let currentlyColliding = false; // Flaga do sprawdzenia, czy nadal jesteśmy w kolizji
        let collisionIndex = -1; //zmienna ktora opisuje index przeszkody z kolizja

        for (let i = 0; i < obstacles.length; i++) {

            const obstacle1 = {
                x: (obstacles[i].position.x * global.scale.x + global.translation.x),
                y: (obstacles[i].position.y * global.scale.y + global.translation.y),
                width: obstacles[i].width * global.scale.x,
                height: obstacles[i].height * global.scale.y,
                angle: 0
            };

            let obstacle2;

            for (let j = 0; j < obstacles.length; j++) {
                if (i == j) break;

                obstacle2 = {
                    x: (obstacles[j].position.x * global.scale.x + global.translation.x),
                    y: (obstacles[j].position.y * global.scale.y + global.translation.y),
                    width: obstacles[j].width * global.scale.x,
                    height: obstacles[j].height * global.scale.y,
                    angle: 0
                };
                if (isColliding(obstacle1, obstacle2)) {
                    currentlyColliding = true;

                    // Wykrycie wejścia w kolizję po raz pierwszy
                    if (!this.isColliding) {
                        this.isColliding = true;

                        collisionIndex = i;

                        break; // Jeśli wykryto kolizję, nie trzeba dalej sprawdzać
                    }
                }
            }
        }

        //usuwanie obiektu w momencie kolizji
        if (collisionIndex !== -1) {
            player.deletedObstacle = obstacles[collisionIndex].type;
            obstacles.splice(collisionIndex, 1);
        }

        // Resetowanie flagi, gdy wyjedziemy z kolizji
        if (!currentlyColliding) {
            this.isColliding = false;
        }
    }
}