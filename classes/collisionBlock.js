//klasa ktora pozwoli nam na wyswietlenie hitboxow
class collisionBlock {
    constructor({ position, width, height }) {
        this.position = position;
        this.width = width;
        this.height = height;
    }

    draw() {
        c.save();
        //skalowanie hitboxow zgodnie z mapa
        c.translate(mapTranslation.x, mapTranslation.y);
        c.scale(2, 2);
        c.fillStyle = "rgba(0, 0, 255, 0.5)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.restore();
    }
}