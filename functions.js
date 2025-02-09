// Funkcja odpowiada za zamianę stopni na radiany używane w rotacjach na canvas
function convertToRadians(angle) {
    return (angle * Math.PI / 180);
}

// Funkcja odpowiadająca za zmianę rozmiaru canvasu, względem okna przeglądarki
addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

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
    }
})