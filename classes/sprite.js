class Sprite {
    constructor({position, imageSrc, scale = {x: 1, y: 1}, rotation = 0, translation = {x: 0, y: 0}, maxFrames = 1, frameBuffer = 0, isMovingWithTranslation = true,}) {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.translation = translation;
        this.rotation = rotation;
        this.newPosition;
        this.maxFrames = maxFrames;
        this.frameCounter = 1;
        this.lastFrame = 0;
        this.frameBuffer = frameBuffer;
        this.allFrames = 0;
        this.isMovingWithTranslation = isMovingWithTranslation
    }

    update() {
        this.draw();
        this.animate();
    }

    draw() {
        if (this.isMovingWithTranslation) {
            this.newPosition = {
                x: this.position.x - this.translation.x / this.scale.x,
                y: this.position.y - this.translation.y / this.scale.y
            }
        }
        else {
            this.newPosition = this.position
        }
        c.save();
        c.translate(this.translation.x, this.translation.y);
        c.scale(this.scale.x, this.scale.y);
        c.rotate(this.rotation);
        c.drawImage(this.image, this.newPosition.x, this.newPosition.y);
        c.restore();
    }

    animate() {
        if (this.allFrames % this.frameBuffer == 0) {
            this.frameCounter++;
            this.lastFrame++;
            this.image.src = this.image.src.replace(this.lastFrame, this.frameCounter);
            if (this.frameCounter == this.maxFrames) {
                this.frameCounter = 1;
            }
            if (this.lastFrame == this.maxFrames) {
                this.lastFrame = 1;
            }
        }
        this.allFrames++;
    }
}