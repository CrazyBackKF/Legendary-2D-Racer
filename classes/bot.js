class Bot extends Player {
    constructor({ position, color }) {
        super({ position, color })
        this.angle = 270;
        this.currentCheckpoint = 0;
    }

    update() {
        this.draw()
        this.move();
        this.accelerate();
        this.physics();
    }

    draw() {
        c.save();
        c.translate(player.camerabox.translation.x + (this.position.x + this.width / 2), player.camerabox.translation.y + (this.position.y + this.height / 2));
        c.rotate(convertToRadians(this.angle));
        c.fillStyle = this.color
        c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height)
        c.restore();
    }

    move() {
        this.speed += Math.random() * 0.15 + 0.1;
    }

    accelerate() {
        this.velocity.y = -(this.speed * Math.cos(convertToRadians(this.angle)) * this.speedMultiplier);
        this.velocity.x = this.speed * Math.sin(convertToRadians(this.angle)) * this.speedMultiplier;
    }

    physics() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}