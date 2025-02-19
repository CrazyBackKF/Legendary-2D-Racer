//rozszerzenie klasy collisionBlock dziala na takiej samej zasadzie 
class CheckpointBlock extends collisionBlock {
    constructor({position, width, height ,color, isPassed})
    {
        super({position, width, height , color})
        this.isPassed = isPassed
    }

    draw() {
        c.save();
        //skalowanie hitboxow zgodnie z mapa
        c.translate(player.camerabox.translation.x, player.camerabox.translation.y);
        c.scale(2, 2);
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.restore();
    }
}