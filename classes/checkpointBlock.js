//rozszerzenie klasy collisionBlock dziala na takiej samej zasadzie 
class CheckpointBlock extends collisionBlock {
    constructor({ position, width, height, color, isPassed, index }) {
        super({ position, width, height, color })
        this.isPassed = isPassed // czy checkpoint zotal zaliczony
        this.index = index //index chekpointa
        this.angle = 0;
    }

    draw() {
        c.save();
        //skalowanie hitboxow zgodnie z mapa
        c.translate(global.translation.x, global.translation.y);
        c.scale(global.scale.x, global.scale.y);
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.font = "5px Arial";
        c.fillStyle = "black"
        c.fillText(this.index, this.position.x, this.position.y)
        c.restore();
    }
}