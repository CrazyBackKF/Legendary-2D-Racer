// Funkcja odpowiada za zamianę stopni na radiany używane w rotacjach na canvas
function convertToRadians(angle) {
    return (angle * Math.PI / 180);
}

//funkcja ktora jest warukiem innej funkcji
function checkCollisionsCondition(corners, object) {
    if (corners.rt.y <= object.position.y + object.height &&
        corners.lt.y >= object.position.y + object.height &&
        corners.rt.x <= object.position.x + object.width &&
        corners.lt.x >= object.position.x + object.width) {
        return "collision"
    }
}

//funkcja ktora sprawdza kolizje
function getCollisions(collisions) {
    const checkpointsTab = [];
    const collisionsTab = [];
    const roadTab = [];
    let witdhMultiplier, heightMultipler;
    for (let i = 1; i < collisions.length; i++) {
        for (let j = 0; j < collisions[i].length; j++) {
            //okreslanie rodzaju hitboxa
            if (collisions[i - 1][j] == 1) {
                witdhMultiplier = 1;
                heightMultipler = 8;
            }
            else if (collisions[i][j - 1] == 1) {
                witdhMultiplier = 8;
                heightMultipler = 1;
            }

            if (collisions[i][j] == 1) {
                collisionsTab.push(new collisionBlock({
                    position: {
                        x: j * 8,
                        y: i * 8
                    },
                    width: 8,
                    height: 8,
                    color: 'rgba(0, 0, 255, 0.5)',
                }))
            }
            //ustalenie miejsca z checkpointem
            else if (collisions[i][j] == 2) {
                checkpointsTab.push(new CheckpointBlock({
                    position: {
                        x: j * 8,
                        y: i * 8
                    },
                    width: 8 * witdhMultiplier,
                    height: 8 * heightMultipler,
                    color: 'rgba(255,255,00, 0.5)',
                    isPassed: false,
                }))
            }
            else if (collisions[i][j] == 3) {
                roadTab.push(new Road({
                    position: {
                        x: j * 8,
                        y: i * 8
                    },
                    width: 8,
                    height: 8, color: 'rgba(255, 255, 255, 0.5)'
                }))
            }
        }
    }
    return { collisions: collisionsTab, checkpoints: checkpointsTab, road: roadTab };
}

function reorderArray(arr, order) {
    let reordered = new Array(arr.length); // Tworzymy nową tablicę o tej samej długości

    order.forEach((newPosition, currentIndex) => {
        reordered[newPosition] = arr[currentIndex]; // Umieszczamy element na poprawnej pozycji zgodnej z kolejnoscia na trasie
    });

    return reordered;
}

//sprawdzamy czy jest fullscreen
function checkIfFullScreen() {
    return document.fullscreenElement !== null;
}

//sprawdzamy strone pozycji z
function getSidePosition(target, offset) {
    return {
        x: target.position.x + Math.cos(target.angle + Math.PI / 2) * offset,
        y: target.position.y + Math.sin(target.angle + Math.PI / 2) * offset
    };
}

//zwracamy kierunek
function returnDirection(obj1, obj2) {
    if (obj1.hr.x < obj2.hl.x) return "right";
    if (obj1.hl.x > obj2.hr.x) return "left";
    if (obj1.hr.y < obj2.hl.y) return "down";
    if (obj1.hl.y > obj2.hr.y) return "up";
}

// isDifferent dodałem, ponieważ czasem trochę inaczej zapisuje obiekty a nie chce mi się tego zmieniać
function getObjectsToCollisions(obj, isDifferent = false , angle = 0, isInRadians = false, scale = {x: 1, y: 1}, translation = {x: 0, y: 0}) {
    if (!isInRadians) angle = convertToRadians(angle);
    if (!isDifferent) {
        return {
            x: obj.position.x * scale.x + translation.x,
            y: obj.position.y * scale.y + translation.y,
            width: obj.width * scale.x,
            height: obj.height * scale.y,
            angle: angle
        }
    }
    return {
        position: {
            x: obj.position.x * scale.x + translation.x,
            y: obj.position.y * scale.y + translation.y,
        },
        width: obj.width * scale.x,
        height: obj.height * scale.y,
        angle: angle
    }
}

function isCollidingButtons(mouse, button) {
    const scaledWidth = button.width * button.scale.x;
    const scaledHeight = button.height * button.scale.y;

    const offsetX = (scaledWidth - button.width) / 2;
    const offsetY = (scaledHeight - button.height) / 2;

    const scaledX = button.position.x - offsetX;
    const scaledY = button.position.y - offsetY;

    return (
        mouse.x > scaledX &&
        mouse.x < scaledX + scaledWidth &&
        mouse.y > scaledY &&
        mouse.y < scaledY + scaledHeight
    );
}

// Obsługa przycisków kiedy wcisniety kiedy nie
addEventListener("keydown", (e) => {
    switch (e.key.toLowerCase()) {
        case "a":
            player.key.a = true;
            break;
        case "d":
            player.key.d = true;
            break;
        case "w":
            player.key.w = true;
            break;
        case "s":
            player.key.s = true;
            break;
        case "t":
            player.key.t = true;
            break;
        case " ":
            player.key.space = true;
            break;
        case 'q':
            if (!key.q) key.q = true
            else key.q = false
            break;
    }
})

addEventListener("keyup", (e) => {
    switch (e.key.toLowerCase()) {
        case "a":
            player.key.a = false;
            break;
        case "d":
            player.key.d = false;
            break;
        case "w":
            player.key.w = false;
            break;
        case "s":
            player.key.s = false;
            break;
        case "t":
            player.key.t = false;
            break;
        case " ":
            player.key.space = false;
            break;
    }
})

// document.querySelector("#fullscreen").addEventListener("click", () => {
//     canvas.requestFullscreen();
//     lastFullScreen = Date.now();
//     animate();
// })
