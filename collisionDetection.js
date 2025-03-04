// Funkcja zrobiona by pobrać koodrynaty wierchołków po rotacji
function getPoints(obj, angle, cx, cy, isInRadians = false) {
    let rad;

    if (!isInRadians) rad = angle * Math.PI / 180; // Zamiana stopni na radiany
    else rad = angle;

    let cosA = Math.cos(rad);
    let sinA = Math.sin(rad);

    return {
        //rog left top
        lt: {
            x: cx + (obj.x - cx) * cosA - (obj.y - cy) * sinA,
            y: cy + (obj.x - cx) * sinA + (obj.y - cy) * cosA
        },

        //rog right top
        rt: {
            x: cx + (obj.x + obj.width - cx) * cosA - (obj.y - cy) * sinA,
            y: cy + (obj.x + obj.width - cx) * sinA + (obj.y - cy) * cosA
        },

        //rog left bottom
        lb: {
            x: cx + (obj.x - cx) * cosA - (obj.y + obj.height - cy) * sinA,
            y: cy + (obj.x - cx) * sinA + (obj.y + obj.height - cy) * cosA
        },

        //rog right bottom
        rb: {
            x: cx + (obj.x + obj.width - cx) * cosA - (obj.y + obj.height - cy) * sinA,
            y: cy + (obj.x + obj.width - cx) * sinA + (obj.y + obj.height - cy) * cosA
        }
    }
}

// Metoda sprawdza czy jakiś wierzchołek ma kolizje. Jeżeli tak to zwraca jego nazwę
function isColliding(obj1 = { isInRadians: false }, obj2 = { isInRadians: false }) {
    obj1.corners = getPoints(obj1, obj1.angle, obj1.x + obj1.width / 2, obj1.y + obj1.height / 4, obj1.isInRadians);

    // for (let key in obj1.corners) {
    //     const corner = obj1.corners[key];
    //     c.fillStyle = "black";
    //     c.beginPath();
    //     c.arc(corner.x, corner.y, 2, 0, 2 * Math.PI);
    //     c.closePath();
    //     c.fill();
    // }

    obj2.corners = getPoints(obj2, obj2.angle, obj2.x + obj2.width / 2, obj2.y + obj2.height / 2, obj2.isInRadians);

    // for (let key in obj2.corners) {
    //     const corner = obj2.corners[key];
    //     c.fillStyle = "black";
    //     c.beginPath();
    //     c.arc(corner.x, corner.y, 2, 0, 2 * Math.PI);
    //     c.closePath();
    //     c.fill();
    // }

    for (let key in obj1.corners) {

        const corner = obj1.corners[key];

        if (corner.x >= obj2.x && corner.x <= obj2.x + obj2.width && corner.y >= obj2.y && corner.y <= obj2.y + obj2.height) {
            return true;
        }
    }

    for (let key in obj2.corners) {

        const corner = obj2.corners[key];

        if (corner.x >= obj1.x && corner.x <= obj1.x + obj1.width && corner.y >= obj1.y && corner.y <= obj1.y + obj1.height) {
            return true;
        }
    }

    return false;
}