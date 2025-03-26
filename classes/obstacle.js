class Obstacle {
    constructor({ position, type, width, height, imageSrc }) {
        this.position = position;
        this.type = type;
        this.width = width;
        this.height = height;
        this.isColliding = false; //zmienne okreslajaca czy obiekt jest kolidowany
        this.image = new Image();
        this.image.src = imageSrc;
    }

    update() {
        if (this.image) this.draw();

        if (key.q) this.drawHitbox();

        this.checkCollisonBetweenObstacles();
    }

    drawHitbox() {
        c.save();

        c.translate(global.translation.x, global.translation.y);
        c.scale(global.scale.x, global.scale.y)
        c.globalAlpha = 0.5;
        c.fillStyle = this.type.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        c.restore();
    }

    draw() {
        c.save();

        // Liczymy rzeczywiste przesunięcie dla obrazka, uwzględniając skalowanie hitboxa
        const realX = global.translation.x + this.position.x * global.scale.x;
        const realY = global.translation.y + this.position.y * global.scale.y;

        // Liczymy środek hitboxa po skalowaniu
        const scaledWidth = this.width * global.scale.x;
        const scaledHeight = this.height * global.scale.y;
        const centerX = realX + scaledWidth / 2;
        const centerY = realY + scaledHeight / 2;

        // Pozycjonujemy obrazek na środku hitboxa
        c.translate(centerX - this.image.width / 4, centerY - this.image.height / 4);
        c.scale(0.8, 0.8)
        // Rysujemy obrazek
        c.drawImage(this.image, -15, -15);

        c.restore();
    }

    //metoda ktora sprawdza kolizji miedzy przeszkodami nie chcemy aby sie stakowaly w jednym miejscu
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