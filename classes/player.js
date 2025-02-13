// Tworzenie klasy Player
class Player {
    constructor({ position }) {
        this.position = position; //pozycja pojazdu
        //wymiary hitboxa pojazdu
        this.width = 20;
        this.height = 50;
        this.angle = 0; //zmienna opisujaca kat obrotu pojazdu podczas skretu
        //zmienne predkosci pojazd
        this.speed = 0; //zmienna służąca do stopniowej zmiany prędkości
        this.speedMultiplier = 1; //służy do zwiększania prędkości po naciśnięciu turbo
        this.driftMultiplier = 1;
        this.speedValue = 0.03;    //zmienna dodajaca predkosc z kazda klatka z wcisnietym klawiszem [w / s]
        this.friction = 0.01;  //zmienna opisujaca tarcie[o ile hamuje bez kliknietych klawiszy]
        this.maxSpeed = 3; //maksymalna prędkość z jaką może jechać pojazd
        this.turboAmount = 5; //maksymalna ilość turbo
        this.lastTurbo = 0; //ostatnie kliknięcie turbo
        //this.image = new Image();
        //this.image.src = "img/sport_green.png";
        //prędkość w poziomie x i y
        this.velocity = {
            x: 0,
            y: 0
        }
        //lista klawiszy którymi można sterować, pobrana z addEventListenerów
        this.key = {
            a: false,
            d: false,
            w: false,
            s: false,
            t: false,
            space: false
        }
    }

    // Metoda która aktualizuje parametry i grafikę instancji klasy
    update() {
        this.draw();
        this.accelerate();
        this.drift();
        this.turn();
        this.checkCollisions();
        this.physics();
        this.turbo();
    }

    // Metoda która dodaje prędkość pojazdu
    physics() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    // Metoda odpowiedzialna za zmianę prędkości pojazdu
    accelerate() {
        if (!this.key.w && !this.key.s) {
            if (this.speed > 0) {
                this.speed -= this.friction;
                if (this.speed < 0) this.speed = 0;
            }
            else if (this.speed < 0) {
                this.speed += this.friction;
                if (this.speed > 0) this.speed = 0;
            }
        }
        if (this.key.w && this.speed <= this.maxSpeed) {
            if (this.speed < 0) this.speed += this.speedValue;
            else this.speed += this.speedValue + this.friction;

        }
        else if (this.key.s && this.speed >= -this.maxSpeed) {
            if (this.speed > 0) this.speed -= this.speedValue;
            else this.speed -= (this.speedValue + this.friction);
        }

        this.velocity.y = -(this.speed * Math.cos(convertToRadians(this.angle)) * this.speedMultiplier);
        this.velocity.x = this.speed * Math.sin(convertToRadians(this.angle)) * this.speedMultiplier;
    }

    // Metoda która wyświetla pojazd
    draw() {
        c.save();
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 4);
        c.rotate(convertToRadians(this.angle));
        //c.drawImage(this.image, -this.width / 2, -this.height / 4,);
        
        c.fillStyle = "rgba(255, 0, 0, 1)";
        c.fillRect(-this.width / 2, -this.height / 4, this.width, this.height);
        c.restore();

    }

    // Metoda która obraca pojazd
    turn() {
        let turnSpeed = this.changeTurningSpeed();
        if (this.key.a) {
            if (this.speed > 0) {
                this.angle -= turnSpeed;
                if (this.angle == 0) this.angle = 360;
            }
            if (this.speed < 0) {
                this.angle += turnSpeed;
                if (this.angle == 360) this.angle = 0;
            }
        }
        if (this.key.d) {
            if (this.speed > 0) {
                this.angle += turnSpeed;
                if (this.angle == 360) this.angle = 0;
            }
            if (this.speed < 0) {
                this.angle -= turnSpeed;
                if (this.angle == 0) this.angle = 360;
            }
        }
    }

    // Metoda która zmienia szybkość obrotu w zależności od szybkości auta
    changeTurningSpeed() {
        if (this.speed > 0) {
            if (this.speed <= 2) return this.speed / 1.7 * this.driftMultiplier;
            else return ((2 - (this.speed / this.maxSpeed)) * 0.8) * this.driftMultiplier;
        }
        else if (this.speed < 0) {
            if (this.speed >= -2) return -this.speed / 1.7 * this.driftMultiplier;
            else return (2 + (this.speed / this.maxSpeed) * 0.8) * this.driftMultiplier;
        }
    }

    // Metoda która dodaje turbo gdy wciśnie się t
    turbo() {
        if (Date.now() - this.lastTurbo >= 500 && this.turboAmount < 5) // Gdy nie zużyjesz turbo przez 0.5 s to zacznie się odnawiać
        {
            this.turboAmount += 0.004;
            if (this.turboAmount > 5) this.turboAmount = 5;
        }
        if (!this.key.t && this.speedMultiplier > 1) this.speedMultiplier -= 0.005; // Dzięki tej lini zmiana prędkości jest płynniejsza;

        if (this.key.t && this.turboAmount > 0) // Gdy wciśnięty klawisz t to prędkość zwiększa się 1.5 razy
        {
            this.lastTurbo = Date.now();
            this.speedMultiplier = 1.5;
            this.turboAmount -= 0.01;
        }
        else if (this.turboAmount <= 0) {
            this.speedMultiplier = 1;
            this.turboAmount = 0;
            this.speedMultiplier -= 0.005;
        }

    }

    drift() {
        if (this.key.space && this.speed > 2) {
            this.driftMultiplier = 0.7 * this.speed;
            if (this.key.w) return;
            if(this.speed > 0) this.speed -= 0.02;
            else this.speed = 0;
        }
        else {
            this.driftMultiplier = 1;
        }
    }

    checkCollisions() {
        for (let i = 0; i < collisionsTab.length; i++)
        {
            const rotatedRect = { x: this.position.x, y: this.position.y, width: this.width, height: this.height, angle: this.angle };
            const square = { sq_x: (collisionsTab[i].position.x * 2 - canvas.width / 2), sq_y: (collisionsTab[i].position.y * 2 - canvas.height), sq_size: collisionsTab[i].width * 2 };   

            if (isCollidingSAT(rotatedRect, square))
            {
                console.log("chuj");
                break;
            }
        }
    }

}
