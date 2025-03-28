//rozszerzenie klasy collisionBlock dziala na takiej samej zasadzie 
class CheckpointBlock extends collisionBlock {
    constructor({ position, width, height, color, isPassed, index, rotation }) {
        super({ position, width, height, color })
        this.isPassed = isPassed // czy checkpoint zotal zaliczony
        this.index = index //index chekpointa
        //zmienne do strzalek pokazujacych nastepny checkpoint
        this.image = new Image();
        this.imageSrc = "File1.png"
        this.image.src = "assets/img/arrow/" + this.imageSrc;
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
        c.fillText(this.index, this.position.x, this.position.y)

        c.restore();
    }
    
    //metoda do animacji
    animate() {
        if (this.allFrames % this.frameBuffer == 0) {
            this.frameCounter++;
            this.lastFrame++;
            this.imageSrc = this.imageSrc.replace(this.lastFrame, this.frameCounter);
            this.image.src = "assets/img/arrow/" + this.imageSrc;
            if (this.frameCounter == this.maxFrames) {
                this.frameCounter = 1;
            }
            if (this.lastFrame == this.maxFrames) {
                this.lastFrame = 1;
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