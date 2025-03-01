class Obstacle {
    constructor({ position, type, width, height }) {
        this.position = position;
        this.type = type;
        this.width = width;
        this.height = height;
    }

    update() {
        this.draw();
    }

    draw() {
        c.save();
        c.translate(global.translation.x, global.translation.y);
        c.scale(global.scale.x, global.scale.y)
        c.fillStyle = this.type.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.restore();
    }
}