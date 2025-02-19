class Bot extends Player {
    constructor({position}) {
        super({position})
        this.angle = 270;
    }

    update()
    {
        this.draw()
    }

    draw()
    {
        c.save();
        c.translate(player.camerabox.translation.x + (this.position.x + this.width / 2), player.camerabox.translation.y + (this.position.y + this.height / 2));
        c.rotate(convertToRadians(this.angle));
        c.fillStyle = "orange"
        c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height)
        c.restore();
    }
}