// Funkcja zrobiona by pobrać koodrynaty wierchołków po rotacji
function getPoints(obj, angle, cx, cy) {
    let rad = angle * Math.PI / 180; // Zamiana stopni na radiany
    let cosA = Math.cos(rad);
    let sinA = Math.sin(rad);

    return {
        lt: {
            x: cx + (obj.x - cx) * cosA - (obj.y - cy) * sinA,
            y: cy + (obj.x - cx) * sinA + (obj.y - cy) * cosA
        },

        rt: {
            x: cx + (obj.x + obj.width - cx) * cosA - (obj.y - cy) * sinA,
            y: cy + (obj.x + obj.width - cx) * sinA + (obj.y - cy) * cosA
        },

        lb: {
            x: cx + (obj.x - cx) * cosA - (obj.y + obj.height - cy) * sinA,
            y: cy + (obj.x - cx) * sinA + (obj.y + obj.height - cy) * cosA
        },

        rb: {
            x: cx + (obj.x + obj.width - cx) * cosA - (obj.y + obj.height - cy) * sinA,
            y: cy + (obj.x + obj.width - cx) * sinA + (obj.y + obj.height - cy) * cosA
        }
    }
}

// Metoda sprawdza czy jakiś wierzchołek ma kolizje. Jeżeli tak to zwraca jego nazwę
function isColliding(obj1, obj2) {
    obj1.corners = getPoints(obj1, obj1.angle, obj1.x + obj1.width / 2, obj1.y + obj1.height / 4);
    obj2.corners = getPoints(obj2, obj2.angle, obj2.x + obj2.width / 2, obj2.y + obj2.height / 2);
    for (let key in obj1.corners) {
        const corner = obj1.corners[key];
        if (corner.x >= obj2.x && corner.x <= obj2.x + obj2.width && corner.y >= obj2.y && corner.y <= obj2.y + obj2.height) {
            console.log()
            return key;
        }
    }
}

function getCollisionDirection(collidingCorners, angle) {
    if (angle >= 0 && angle < 45) {
        if (collidingCorners.has("rt") || collidingCorners.has("lb")) return "horizontal";
        else if (collidingCorners.has("lt") || collidingCorners.has("rb")) return "vertical"
    }
    if (angle >= 45 && angle < 90) {
        if (collidingCorners.has("rt") || collidingCorners.has("lb")) return "horizontal";
        else if (collidingCorners.has("lt") || collidingCorners.has("rb")) return "vertical"
    }
    if (angle >= 90 && angle < 135) {
        if (collidingCorners.has("lt") || collidingCorners.has("rb")) return "horizontal";
        else if (collidingCorners.has("rt") || collidingCorners.has("lb")) return "vertical"
    }
    if (angle >= 135 && angle < 180) {
        if (collidingCorners.has("lt") || collidingCorners.has("rb")) return "horizontal";
        else if (collidingCorners.has("rt") || collidingCorners.has("lb")) return "vertical"
    }
    if (angle > 180 && angle < 225) {
        if (collidingCorners.has("rt") || collidingCorners.has("lb")) return "horizontal";
        else if (collidingCorners.has("lt") || collidingCorners.has("rb")) return "vertical"
    }
    if (angle >= 225 && angle < 270) {
        if (collidingCorners.has("rt") || collidingCorners.has("lb")) return "horizontal";
        else if (collidingCorners.has("lt") || collidingCorners.has("rb")) return "vertical"
    }
    if (angle >= 270 && angle < 315) {
        if (collidingCorners.has("lt") || collidingCorners.has("rb")) return "horizontal";
        else if (collidingCorners.has("rt") || collidingCorners.has("lb")) return "vertical"
    }
    if (angle >= 315 && angle < 360) {
        if (collidingCorners.has("lt") || collidingCorners.has("rb")) return "horizontal";
        else if (collidingCorners.has("rt") || collidingCorners.has("lb")) return "vertical"
    }
}

function correctAngle(collidingCorners, angle) {
        if (collidingCorners.has("lb")) {
            if (angle > 270 && angle < 300) return 270.1;
            if (angle > 90 && angle < 120) return 90.1;
            if (angle > 0 && angle < 30) return 0.1;
            if (angle > 180 && angle < 210) return 180.1;
        }
        if (collidingCorners.has("rb")) {
            if (angle > 60 && angle < 90) return 89.9;
            if (angle > 240 && angle < 270) return 269.9;
            if (angle > 330 && angle < 360) return 359.9;
            if (angle > 150 && angle < 180) return 179.9;
        }
}