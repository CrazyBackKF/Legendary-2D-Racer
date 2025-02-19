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
