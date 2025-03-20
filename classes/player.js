// Tworzenie klasy Player

class Player extends Sprite {
    constructor({ position, color, imageSrc }) {
        super({ imageSrc, position });
        this.position = position; //pozycja pojazdu
        //wymiary hitboxa pojazdu
        this.width = 31;
        this.height = 71;
        this.color = color
        this.angle = 270; //zmienna opisujaca kat obrotu pojazdu podczas skretu
        //zmienne predkosci pojazd
        this.speed = 0; //zmienna służąca do stopniowej zmiany prędkości
        this.brakeValue = 0.1;
        this.bonusSpeed = 0;
        this.notOnRoadFriction = 0.02; // nie wiem jak to nazwać lol, służy do zwalniania, jeżeli nie znajdujesz się na drodze, im lepsze koła tym mniej zwalnia
        this.speedMultiplier = 1; //służy do zwiększania prędkości po naciśnięciu turbo
        this.driftMultiplier = 1;
        this.speedValue = 0.005;    //zmienna dodajaca predkosc z kazda klatka z wcisnietym klawiszem [w / s]
        this.friction = 0.01;  //zmienna opisujaca tarcie[o ile hamuje bez kliknietych klawiszy]
        this.maxSpeed = 3; //maksymalna prędkość z jaką może jechać pojazd
        this.maxTurbo = 1.5;
        this.turboAmount = 1.5; //maksymalna ilość turbo
        this.lastTurbo = 0; //ostatnie kliknięcie turbo
        this.isColliding = false;//bool do okreslania wystepowania kolizji
        this.isColliding2 = false;
        this.lastRoadTime = 0; //zmienne przechowujaca czas na drodze
        this.isOnRoad = false; //bool czy gracz jest na drodze
        this.isOnIce = false;
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
        this.camerabox = {
            width: 800,
            height: 450,
            position: {
                x: this.position.x + this.width / 2 - 800 / 2, // Centrowanie w poziomie
                y: this.position.y + this.height / 4 - 450 / 2  // Centrowanie w pionie
            }
        };
        this.knockback = {
            x: 0,
            y: 0
        }
        this.lastCheckpoint = -1; //zmienna pomocnicza do zaznaczanie checkpointo (-1 poniewaz trzeba zaliczyc start/mete z indexem 0)
        this.laps = 1; //zmienna opisujaca ilosc okrazen
        this.oliedMultiplier = 1; //zmienne zmieniajaca turnSpeed jezeli gracz przejechal przez kaluze oleju
        this.allObstacles = false;
        this.deletedObstacle = "";
        this.translation = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 4
        }
        this.scale = {
            x: 1,
            y: 1
        }
        this.isMovingWithTranslation = true;
        this.startTime = Date.now();
        this.distance = 0;
        this.distanceFromLastCheckpoint = 0;
        this.place = 0;
        this.isPlaying = true;
        this.alpha = 1;
        this.name = "Player";
        this.correctPlace;
        this.money = JSON.parse(localStorage.getItem("money")) || 0;
        this.moneyToAdd = 0;
        this.imageSrc = imageSrc;
    }


    // Metoda która aktualizuje parametry i grafikę instancji klasy
    update() {
        this.changeSpriteProperties();
        this.draw();
        this.drawHitbox();
        this.checkAmountOfObstacles();
        this.moveCamerabox();
        this.moveCameraVertically();
        this.moveCameraHorizontally();
        this.accelerate();
        this.drift();
        this.turn();
        this.checkIfHitCanvas();
        this.checkCollisions();
        this.checkCheckpoints();
        //this.checkObstacles();
        this.checkRoad();
        this.turbo();
        //this.checkCollisionWithBots();
        this.updateDistance();
        this.changeStats();
        if (!this.isPlaying) return;
        this.physics();
    }

    changeSpriteProperties() {
        this.rotation = convertToRadians(this.angle);
        this.translation = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 4
        }
        this.image.src = this.imageSrc
    }

    // Metoda która dodaje prędkość pojazdu
    physics() {
        if (!deltaTime) return;
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
            if (this.speed < 0) this.speed += (this.speedValue + this.brakeValue);
            else this.speed += (this.speedValue - this.friction + this.bonusSpeed);

        }
        else if (this.key.s && this.speed >= -this.maxSpeed) {
            if (this.speed > 0) this.speed -= (this.speedValue + this.brakeValue);
            else this.speed -= (this.speedValue - this.friction + this.bonusSpeed);
        }
        this.velocity.y = -(this.speed * Math.cos(convertToRadians(this.angle)) * this.speedMultiplier + this.knockback.x) * deltaTime * 120;
        this.velocity.x = (this.speed * Math.sin(convertToRadians(this.angle)) * this.speedMultiplier + this.knockback.y) * deltaTime * 120;
    }

    // Metoda która wyświetla pojazd
    drawHitbox() {
        if (key.q) {
            c.fillStyle = "rgba(0, 255, 0, 0.2)"
            c.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height);
            c.save();
            c.translate(this.position.x + this.width / 2, this.position.y + this.height / 4);
            c.rotate(convertToRadians(this.angle));
            //c.drawImage(this.image, -this.width / 2, -this.height / 4,);

            c.fillStyle = "rgba(255, 0, 0, 0.5)";
            c.fillRect(-this.width / 2, -this.height / 4, this.width, this.height);
            c.restore();
            // c.save()
            // c.translate(this.position.x + this.width / 2, this.position.y + this.height / 4);
            // c.rotate(convertToRadians(this.angle));
            // c.fillStyle = "rgba(189, 11, 180, 0.5)"
            // c.fillRect(this.boxToChase.position.x - this.position.x - this.width / 2, this.boxToChase.position.y - this.position.y - this.height / 4, this.boxToChase.width, this.boxToChase.height)
            // c.restore()
        }
    }

    //metoda nie pozwala wyjechać za brzegi ekranu
    checkIfHitCanvas() {
        const rotatedRect = {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
            angle: this.angle
        };

        const corners = getPoints(rotatedRect, this.angle, rotatedRect.x + rotatedRect.width / 2, rotatedRect.y + rotatedRect.height / 4);

        for (let key in corners) {
            const corner = corners[key];
            if (corner.y <= 0) this.velocity.y += 2;
            if (corner.y >= canvas.height) this.velocity.y -= 2;
            if (corner.x <= 0) this.velocity.x += 2;
            if (corner.x >= canvas.width) this.velocity.x -= 2;
        }
    }

    // Metoda która obraca pojazd
    turn() {
        let turnSpeed = this.changeTurningSpeed();
        if (this.key.a) {
            if (this.speed > 0) {
                this.angle -= turnSpeed;
                if (this.angle <= 0) this.angle = 360;
            }
            if (this.speed < 0) {
                this.angle += turnSpeed;
                if (this.angle >= 360) this.angle = 0;
            }
        }
        if (this.key.d) {
            if (this.speed > 0) {
                this.angle += turnSpeed;
                if (this.angle >= 360) this.angle = 0;
            }
            if (this.speed < 0) {
                this.angle -= turnSpeed;
                if (this.angle <= 0) this.angle = 360;
            }
        }
    }

    // Metoda która zmienia szybkość obrotu w zależności od szybkości auta
    changeTurningSpeed() {
        if (this.speed > 0) {
            if (this.speed <= 2) return this.speed / 1.5 * this.driftMultiplier * deltaTime * 120 * this.oliedMultiplier;
            else return ((2 - (this.speed / this.maxSpeed))) * this.driftMultiplier * deltaTime * 120 * this.oliedMultiplier;
        }
        else if (this.speed < 0) {
            if (this.speed >= -2) return -this.speed / 1.5 * this.driftMultiplier * deltaTime * 120 * this.oliedMultiplier;
            else return (2 + (this.speed / this.maxSpeed) ) * this.driftMultiplier * deltaTime * 120 * this.oliedMultiplier;
        }
    }

    // Metoda która dodaje turbo gdy wciśnie się t
    turbo() {
        if (this.turboAmount > this.maxTurbo) this.turboAmount = this.maxTurbo;
        if (Date.now() - this.lastTurbo >= 500 && this.turboAmount < this.maxTurbo) // Gdy nie zużyjesz turbo przez 0.5 s to zacznie się odnawiać
        {
            this.turboAmount += 0.004;
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

    // Metoda która dodaje drift po wciśnięciu spacji
    drift() {
        if (this.key.space && this.speed > 2) {
            this.driftMultiplier = 0.9 * this.speed;
            if (this.key.w) return;
            if (this.speed > 0) this.speed -= 0.02;
            else this.speed = 0;
            if (this.oliedMultiplier == 2.5) {
                this.oliedMultiplier /= 2;
            }
        }
        else {
            this.driftMultiplier = 1;
        }
    }

    // Metoda sprawdza kolizję między samochodzem a blokami kolizji
    checkCollisions() {
        let wasColliding = false;
        
        for (let i = 0; i < stage[currentMap].collisionsTab.length; i++) {
            const car = getObjectsToCollisions(this, false, this.angle, false);
            const collision = getObjectsToCollisions(stage[currentMap].collisionsTab[i], false, 0, false, global.scale, global.translation);
            if (isColliding(car, collision)) {
                wasColliding = true;
                if (!this.isColliding2) {
                    this.speed *= -0.8;
                }
                this.isColliding2 = true;
                break;
            }
        }
    
        if (!wasColliding) {
            this.isColliding2 = false;
        }
    }
    

    //po wyjechaniu z drogi na 5 sekund, samochód wraca do ostatniego checkpointu
    checkRoad() {
        this.isOnRoad = false;
        this.isOnIce = false;
        for (let i = 0; i < stage[currentMap].roadTab.length; i++) {
            const car = getObjectsToCollisions(this, false, this.angle, false);
            const road = getObjectsToCollisions(stage[currentMap].roadTab[i], false, 0, false, global.scale, global.translation) //skalowanie pozycji zgodnie z mapa

            if (isColliding(car, road)) {
                this.isOnRoad = true;
                break; // Wystarczy wykryć jedną kolizję
            }
        }

        for (let i = 0; i < stage[currentMap].iceTab.length; i++) {
            const car = getObjectsToCollisions(this, false, this.angle, false);
            const ice = getObjectsToCollisions(stage[currentMap].iceTab[i], false, 0, false, global.scale, global.translation) //skalowanie pozycji zgodnie z mapa

            if (isColliding(ice, car)) {
                this.isOnIce = true;
                break; // Wystarczy wykryć jedną kolizję
            }
        }
        if (this.isOnIce) {
            this.lastRoadTime = 0;
            this.friction = 0;
        }
        else if (this.isOnRoad) {
            this.lastRoadTime = 0;
            this.friction = 0.01;
            return;
        }
        else {
            this.speed -= (this.notOnRoadFriction * this.speed);
        }
        if (5 - parseInt((Date.now() - this.lastRoadTime) / 1000) == 0) {
            for (let i = stage[currentMap].checkpointsTab.length - 1; i >= 0; i--) {
                const element = stage[currentMap].checkpointsTab[i];
                if (stage[currentMap].checkpointsTab[i].isPassed) {
                    this.position.x = element.position.x
                    this.position.y = element.position.y
                    global.translation.x = -(element.position.x + element.width);
                    global.translation.y = -(element.position.y + element.height);
                    this.angle = element.angle;
                    this.speed = 0;
                    break;
                }
            }
        }

        if (this.lastRoadTime == 0) {
            this.lastRoadTime = Date.now();
        }
    }

    //funkcja sprawdzajaca czy wystepuje kolizja z przeszkodom
    checkObstacles() {
        let currentlyColliding = false; // Flaga do sprawdzenia, czy nadal jesteśmy w kolizji
        let collisionIndex = -1; //zmienna ktora opisuje index przeszkody z kolizja
        this.isColliding = false;

        for (let i = 0; i < obstacles.length; i++) {
            const rotatedRect = getObjectsToCollisions(this, false, this.angle, false);

            const square = getObjectsToCollisions(obstacles[i], false, 0, false, global.scale, global.translation);

            if (isColliding(rotatedRect, square)) {
                currentlyColliding = true;

                let angleTypeTab = [110, -110]

                // Wykrycie wejścia w kolizję po raz pierwszy
                if (!this.isColliding) {
                    this.isColliding = true;

                    //reakcja na aprzeszkode 'oil'
                    if (obstacles[i].type.type == "oil") {
                        gsap.to(this, {
                            angle: this.angle + angleTypeTab[(Math.floor(Math.random() * 2 + 1)) - 1],
                            duration: 0.5,
                            speed: this.speed - (0.35 * this.speed),
                            ease: "power2.out"
                        })
                        this.oliedMultiplier = 2.5;
                    }
                    //reakcja na przezszkode 'hole'
                    else if (obstacles[i].type.type == "hole") {
                        gsap.to(this, {
                            angle: this.angle + (angleTypeTab[(Math.floor(Math.random() * 2 + 1)) - 1]) / 2,
                            duration: 0.4,
                            speed: this.speed - (0.2 * this.speed),
                            ease: "power2.out"
                        })
                        this.oliedMultiplier = 1.5
                    }
                    //reakcja na 'traffic cone'
                    else if (obstacles[i].type.type == "traffic cone") {
                        gsap.to(this, {
                            duration: 0.7,
                            speed: this.speed - (0.4 * this.speed),
                            ease: "power2.out"
                        })
                    }
                    else if (obstacles[i].type.type == "spikes") {
                        gsap.to(this, {
                            duration: 0.7,
                            speed: this.speed - this.speed,
                        })
                    }
                    else if (obstacles[i].type.type == "coin") {
                        this.money += 20;
                    }
                    else if (obstacles[i].type.type == "nitro") {
                        this.turboAmount += 0.5;
                        if(this.turboAmount > 2)
                        {
                            this.turboAmount = 2
                        }
                    }


                    //usuniecie 'oiledMultiplayer' nie ma juz reakcji na to
                    setTimeout(() => {
                        this.oliedMultiplier = 1
                    }, 5000)

                    collisionIndex = i;

                    break; // Jeśli wykryto kolizję, nie trzeba dalej sprawdzać
                }
            }
        }

        //usuwanie obiektu w momencie kolizji
        if (collisionIndex !== -1) {
            this.deletedObstacle = obstacles[collisionIndex].type;
            obstacles.splice(collisionIndex, 1);
        }

        // Resetowanie flagi, gdy wyjedziemy z kolizji
        if (!currentlyColliding) {
            this.isColliding = false;
        }
    }

    //metoda sprawdzajaca ilosc przeszkod
    checkAmountOfObstacles() {
        if (obstacles.length < stage[currentMap].amountOfObstacles + stage[currentMap].amountOfBuffers) {
            this.allObstacles = false;
        }
        else if (obstacles.length == stage[currentMap].amountOfObstacles + stage[currentMap].amountOfBuffers) {
            this.allObstacles = true;
        }
    }

    checkCollisionWithBots() {
        let currentlyColliding = false;

        for (let i = 0; i < bots.length; i++) {
            const car = getObjectsToCollisions(this, false, this.angle, false)

            const bot = getObjectsToCollisions(bots[i], true, bots[i].angle, true, { x: 1, y: 1 }, global.translation)
            if (satCollisionWithVertices(car, bot).colliding) { // napisz do tego kod SAT
                if (!this.isColliding) {
                    this.isColliding = true;
                    this.reactToCollisions(bots[i].velocity, bots[i].angle);
                    currentlyColliding = true
                }
                break; // Jeśli wykryto kolizję, nie trzeba dalej sprawdzać
            }
        }

        // Resetowanie flagi, gdy wyjedziemy z kolizji
        if (!currentlyColliding) {
            this.isColliding = false;
            this.knockback.x *= 0.8;
            this.knockback.y *= 0.8;
        }
    }

    checkCheckpoints() {
        //okreslanie kolizji z checkpointem
        for (let i = 0; i < stage[currentMap].checkpointsTab.length; i++) {
            const rotatedRect = getObjectsToCollisions(this, false, this.angle, false)

            //pozycja checkpointa analogiczna do square z poprzednioego for'a   
            const checkpoint = getObjectsToCollisions(stage[currentMap].checkpointsTab[i], false, 0, false, global.scale, global.translation);

            if (isColliding(rotatedRect, checkpoint) && this.lastCheckpoint - i == -1) {
                //przypisuje checkpointowi angle w momencie wjechania w niego, żeby wiedzieć z jakim kątem trzeba przywrócić auto, gdy wyjedzie za tor
                stage[currentMap].checkpointsTab[i].angle = this.angle;

                //jesli nie bedzie drugiej czesci to nie zaleznie ktory checkpoint bedzie ostatni i tak zmieni na true
                //jest to warunek okreslajacy kolejnosc checkpointow i powstrzymuje gracza przed jechanie w druga strone
                //sprawdzamy czy gracz pejechal mete/start
                if (i == 0) {
                    for (let j = 0; j < stage[currentMap].checkpointsTab.length; j++) {
                        //jezli gracz nie zaliczyl wszystkich checkpointow (ktores jest false to koniec petli) - najwazniejszy warunek poniewaz bez niego zawsze bedzie dodac 'laps'
                        if (!stage[currentMap].checkpointsTab[j].isPassed) break;
                        if (this.laps == 3) //jezli sa 3 okrazenia to koniec
                        {
                            this.distance += 10000000 * (allCars.length - this.place) // po skończeniu trzech okrążeń dodaje do dystansy dużą liczbę, w zależności od jego pozycji
                            //, bo po wygranej, źle liczyło miejsce, tak samo dla botów
                            gsap.to(this, {
                                alpha: 0,
                                repeat: 4,
                                yoyo: true,
                                duration: 0.2
                            })
                            this.correctPlace = this.place;
                            this.isPlaying = false;
                            this.addMoney(); // dodaje monety, ze względu na miejsce
                            break;
                        }
                        else // jezli to nie koniec dodajemy kolo do zmkennej i ustwawiamy na false
                        {
                            stage[currentMap].checkpointsTab.forEach(checkpoint => {
                                checkpoint.isPassed = false;
                            });
                            this.laps++;
                            break;
                        }
                    }
                }
                //jezeli byl zaliczony ustawiamy na true
                stage[currentMap].checkpointsTab[i].isPassed = true;
                //zmieniamy lastCheckpoint poniewaz przekraczamy nowy
                this.lastCheckpoint = i
                this.distance += this.distanceFromLastCheckpoint;
                //sprawdzanie czy zaliczylismy ostatni checkpoint 
                if (this.lastCheckpoint == stage[currentMap].checkpointsTab.length - 1) {
                    this.lastCheckpoint = -1
                }
                break;
            }
        }
    }

    addMoney() {
        this.moneyToAdd = 100 * stage[currentMap].moneyMultiplier + 10 * (allCars.length - this.correctPlace); // zapisuje to, żeby móc się odwołać do tego w skrypcie, i narysować to po skończeniu wyścigu
        this.money += this.moneyToAdd;
        localStorage.setItem("money", this.money);
    }

    //metoda reagujaca na kolizje
    reactToCollisions(enemyVelocity) {
        const force = 1
        this.knockback.x = (this.velocity.x - enemyVelocity.x) * force;
        this.knockback.y = (this.velocity.y - enemyVelocity.y) * force
    }

    //ruch kamery(nizej okreslenie czy pionowo czy poziomo)
    moveCamerabox() {
        //pozycja camery
        this.camerabox.position.x = this.position.x + this.width / 2 - this.camerabox.width / 2;
        this.camerabox.position.y = this.position.y + this.height / 4 - this.camerabox.height / 2;
    }

    moveCameraVertically() {
        // warunki sprawdzające czy kamera nie wychodzi poza mapę

        if (global.translation.y - this.velocity.y < -canvas.height * stage[currentMap].scale || global.translation.y - this.velocity.y > 0) return;

        // w przeciwnym wypadku, gdy "camerabox" wyjdzie poza granicę canvasu to przesuń mapę o prędkość z 
        // jaką się poruszamy i zatrzymaj gracza, żeby sprawić iluzję przesuwania się samochodu, mimo że przesuwa się mapa
        if ((this.camerabox.position.y <= 0 && this.velocity.y < 0) || (this.camerabox.position.y + this.camerabox.height >= canvas.height && this.velocity.y > 0)) {
            global.translation.y -= this.velocity.y;
            this.position.y -= this.velocity.y
        }
    }

    moveCameraHorizontally() {
        // to samo z poziomą orientacją
        if (global.translation.x - this.velocity.x < -canvas.width * stage[currentMap].scale || global.translation.x - this.velocity.x > 0) return;

        if ((this.camerabox.position.x <= 0 && this.velocity.x < 0) || (this.camerabox.position.x + this.camerabox.width >= canvas.width && this.velocity.x > 0)) {
            global.translation.x -= this.velocity.x;
            this.position.x -= this.velocity.x;
        }
    }

    updateDistance() {
        let lastCheckpoint = this.lastCheckpoint;
        if (this.lastCheckpoint == -1) lastCheckpoint = stage[currentMap].checkpointsTab.length - 1;
        const checkpoint = stage[currentMap].checkpointsTab[lastCheckpoint];
        const checkpointX = (checkpoint.position.x + checkpoint.width / 2) * 2 + global.translation.x;
        const checkpointY = (checkpoint.position.y + checkpoint.height / 2) * 2 + global.translation.y;
        const playerX = this.position.x + this.width / 2;
        const playerY = this.position.y + this.height / 4;
        this.distanceFromLastCheckpoint = Math.hypot(checkpointX - playerX, checkpointY - playerY);
        ////////////////////////////////////////// do debugowania
        // c.strokeStyle = "black";
        // c.beginPath();
        // c.moveTo(this.position.x + this.width / 2, this.position.y + this.height / 4); 
        // c.lineTo((checkpoint.position.x + checkpoint.width / 2) * 2 + global.translation.x, (checkpoint.position.y + checkpoint.height / 2) * 2 + global.translation.y);
        // c.stroke();
        //////////////////////////////////////////
    }

    changeStats() {
        this.brakeValue = tuning.brakes.stats[tuning.brakes.level];
        this.maxSpeed = tuning.engine.stats[tuning.engine.level];
        this.notOnRoadFriction = tuning.wheels.stats[tuning.wheels.level];
        this.bonusSpeed = tuning.spoiler.stats[tuning.spoiler.level];
        this.maxTurbo = tuning.turbo.stats[tuning.turbo.level];
    }



    reset() {
        this.angle = 270; //zmienna opisujaca kat obrotu pojazdu podczas skretu
        //zmienne predkosci pojazd
        this.speed = 0; //zmienna służąca do stopniowej zmiany prędkości
        this.speedMultiplier = 1; //służy do zwiększania prędkości po naciśnięciu turbo
        this.driftMultiplier = 1;
        this.speedValue = 0.005;    //zmienna dodajaca predkosc z kazda klatka z wcisnietym klawiszem [w / s]
        this.friction = 0.01;  //zmienna opisujaca tarcie[o ile hamuje bez kliknietych klawiszy]
        this.maxSpeed = 3; //maksymalna prędkość z jaką może jechać pojazd
        this.turboAmount = 2; //maksymalna ilość turbo
        this.lastTurbo = 0; //ostatnie kliknięcie turbo
        this.isColliding = false;//bool do okreslania wystepowania kolizji
        this.lastRoadTime = 0; //zmienne przechowujaca czas na drodze
        this.isOnRoad = false; //bool czy gracz jest na drodze
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
        this.camerabox = {
            width: 800,
            height: 450,
            position: {
                x: this.position.x + this.width / 2 - 800 / 2, // Centrowanie w poziomie
                y: this.position.y + this.height / 4 - 450 / 2  // Centrowanie w pionie
            }
        };
        this.knockback = {
            x: 0,
            y: 0
        }
        this.lastCheckpoint = -1; //zmienna pomocnicza do zaznaczanie checkpointo (-1 poniewaz trzeba zaliczyc start/mete z indexem 0)
        this.laps = 1; //zmienna opisujaca ilosc okrazen
        this.oliedMultiplier = 1; //zmienne zmieniajaca turnSpeed jezeli gracz przejechal przez kaluze oleju
        this.allObstacles = false;
        this.deletedObstacle = "";
        this.translation = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 4
        }
        this.scale = {
            x: 1,
            y: 1
        }
        this.isMovingWithTranslation = true;
        this.startTime = Date.now();
        this.distance = 0;
        this.distanceFromLastCheckpoint = 0;
        this.place = 0;
        this.isPlaying = true;
        this.alpha = 1;
        this.correctPlace;
        this.playerMoney = 100;
    }
}
