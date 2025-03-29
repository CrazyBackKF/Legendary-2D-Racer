//rozszerzenie klasy collisionBlock dziala na takiej samej zasadzie 
class CheckpointBlock extends collisionBlock {
    constructor({ position, width, height, color, isPassed, index, rotation, images }) {
        super({ position, width, height, color })
        this.isPassed = isPassed // czy checkpoint zotal zaliczony
        this.index = index //index chekpointa
        //zmienne do strzalek pokazujacych nastepny checkpoint
        this.images = images;
        this.image = images[0];
        //zmienne do okreslania klatek animacji sztrzalki
        this.allFrames = 0;
        this.frameBuffer = 2;
        this.frameCounter = 1;
        this.lastFrame = 0;
        this.maxFrames = 59;
        this.rotation = rotation;
        this.playerTranslation = {
            x: 0,
            y: 0
        }
        this.playerPosition = {
            x: 0,
            y: 0
        }
        this.distanceToNextCheckpoint = 0;
    }

    //metoda do rysowania checkpointow
    draw() {
        c.save();

        //skalowanie hitboxow zgodnie z mapa
        c.translate(global.translation.x, global.translation.y);
        c.scale(global.scale.x, global.scale.y);
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.font = "20px Arial";
        c.fillStyle = "black"
        c.fillText(this.distanceToNextCheckpoint, this.position.x, this.position.y)

        c.restore();
    }
    
    //metoda do animacji
    //zmieniłem sposób animowania strzałki, gdyż zmienianie src nie działało dobrze, gdy strona jest hostowana. teraz przekazuje do obiektu tablice ze wszystkimi obrazami
    //i je zmieniam co ileś klatek (gdybym zmieniał co jedną to animacja wykonywałaby się zbyt szybko)
    animate() {
        if (this.allFrames % this.frameBuffer == 0) {
            this.frameCounter++;
            this.lastFrame++;
            this.image = this.images[this.lastFrame];
            if (this.frameCounter == this.maxFrames - 1) {
                this.frameCounter = 0;
            }
            if (this.lastFrame == this.maxFrames - 1) {
                this.lastFrame = 0;
            }
        }
        this.allFrames++;
    }

    //metoda rysowania strzalek
    drawArrow() {
        c.save();

        c.translate(global.translation.x + (this.position.x + this.width / 2) * 2, global.translation.y + (this.position.y + this.height / 2) * 2);
        c.scale(global.scale.x, global.scale.y)
        c.rotate(this.rotation)

        c.drawImage(
            this.image,
            -(this.image.width * 0.1) / 2,
            -(this.image.height * 0.1) / 2,
            this.image.width * 0.1,
            this.image.height * 0.1
        );

        c.restore();

        this.animate();
    }
}