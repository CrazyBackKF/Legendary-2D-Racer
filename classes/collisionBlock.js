class collisionBlock {
    constructor({ position, width, height }) {
        this.position = position;
        this.width = width;
        this.height = height;
    }

    draw() {
        c.save();
        c.translate(-canvas.width / 2, -canvas.height);
        c.scale(2, 2);
        c.fillStyle = "rgba(0, 0, 255, 0.5)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.restore();
    }
}