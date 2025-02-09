// Tworzenie klasy Player
class Player {
    constructor({ position }) {
        this.position = position;
        this.width = 20;
        this.height = 50;
        this.angle = 0; //zmienna opisujaca kat obrotu pojazdu podczas skretu
        //zmienne predkosci pojazd
        this.speed = 0;
        this.speedValue = 0.015;    //zmienna dodajaca predkosc z kazda klatka z wcisnietym klawiszem [w / s]
        this.friction = 0.008;  //zmienna opisujaca tarcie[o ile hamuje bez kliknietych klawiszy]
        this.maxSpeed = 3;
        this.turboAmount = 5;
        this.howLongTNotClicked = 0;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.key = {
            a: false,
            d: false,
            w: false,
            s: false,
            t: false
        }
    }

    // Metoda która aktualizuje parametry i grafikę instancji klasy
    update() {
        this.draw();
        this.accelerate();
        this.turn();
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
        this.velocity.y = -(this.speed * Math.cos(convertToRadians(this.angle)));
        this.velocity.x = this.speed * Math.sin(convertToRadians(this.angle));
    }

    // Metoda która wyświetla pojazd
    draw() {
        c.save();
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2);
        c.rotate(convertToRadians(this.angle));

        c.fillStyle = "red";
        c.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);

        c.fillStyle = "white";
        c.font = "50px Arial";
        c.fillText("↑", -12.5, 12.5);

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
            if (this.speed <= 2) return this.speed / 1.5;
            else return 2 - (this.speed / this.maxSpeed) * 1.2;
        }
        else if (this.speed < 0) {
            if (this.speed >= -2) return -this.speed / 1.5;
            else return 2 + (this.speed / this.maxSpeed) * 1.2;
        }
    }

    turbo()
    {
        
        
        if(!this.key.t)
            this.howLongTNotClicked++; // tu sprawdza ile t nie zostalo klikenite jak znacie jakis inny zajebisty wbudowany sposob na to to podmiencie 

        if(this.howLongTNotClicked >= 300 && this.turboAmount < 5) //jak vhwile nie zuyjesz turbo to zaczyna sie dodawac
        {
            this.turboAmount += 0.004;
            if(this.turboAmount > 5)
                this.turboAmount = 5;
        }

        if(this.key.t)
        {
            this.howLongTNotClicked = 0;
            if(this.turboAmount > 0) // a tu ni ma co tlumaaczyc chyba
            {
                this.maxSpeed = 4.5;
                this.turboAmount -= 0.01;
            }   
        }
        else if(this.turboAmount <= 0)
        {
            this.maxSpeed = 3;
            this.turboAmount = 0;    
        }
        else
        {
            this.maxSpeed = 3;
        }


    }

}