class Road extends collisionBlock {
    constructor({position, width, height ,color})
    {
        super({position, width, height , color})
    }

    draw() {
        c.save();
        //skalowanie hitboxow zgodnie z mapa
        c.translate(player.camerabox.translation.x, player.camerabox.translation.y);
        c.scale(global.scale.x, global.scale.y);
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.restore();
    }
}