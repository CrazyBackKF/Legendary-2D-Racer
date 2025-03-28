//klasa ktora pozwoli nam na wyswietlenie hitboxow
class collisionBlock {
    constructor({ position, width, height, color }) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;//kolor hitboxa
    }

    //metoda do rysowania hitboxa bloku kolizji
    draw() {
        c.save();

        //skalowanie hitboxow zgodnie z mapa
        c.translate(global.translation.x, global.translation.y);
        c.scale(global.scale.x, global.scale.y);
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        c.restore();
    }
}