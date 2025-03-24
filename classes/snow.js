class Snow{
    constructor({position, index, radius, velocity}) {
        this.position = position;
        this.velocity = velocity
        this.index = index;
        this.radius = radius
    }

    update() {
        this.draw();
        this.updatePos();
        //this.delete();
    }

    draw() {
        c.fillStyle = "white";
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        c.closePath();
        c.fill();
    }

    //metoda aktualizujaca pozycje
    updatePos() {
        this.position.x += this.velocity.x * deltaTime * 120;
        this.position.y += this.velocity.y * deltaTime * 120;
    }

    delete() {
        if (this.position.y >= canvas.height) {
            snowTab.splice(this.index, 1);
        }
    }
}