// Funkcja odpowiada za zamianę stopni na radiany używane w rotacjach na canvas
function convertToRadians(angle) {
    return (angle * Math.PI / 180);
}

function checkCollisionsCondition(object1, object2) {
    return (object1.position.x <= object2.position.x + object2.width &&
            object1.position.x + object1.width >= object2.position.x &&
            object1.position.y <= object2.position.y + object2.height &&
            object1.position.y + object1.height >= object2.position.y);
}

// Obsługa przycisków
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