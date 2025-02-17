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
        },

        ht: {
            x: cx + (obj.x + obj.width / 2 - cx) * cosA - (obj.y - cy) * sinA,
            y: cy + (obj.x + obj.width / 2 - cx) * sinA + (obj.y - cy) * cosA
        },
        
        hb: {
            x: cx + (obj.x + obj.width / 2 - cx) * cosA - (obj.y + obj.height - cy) * sinA,
            y: cy + (obj.x + obj.width / 2 - cx) * sinA + (obj.y + obj.height - cy) * cosA
        },

        hl: {
            x: cx + (obj.x - cx) * cosA - (obj.y + obj.height / 2 - cy) * sinA,
            y: cy + (obj.x - cx) * sinA + (obj.y + obj.height / 2 - cy) * cosA
        },

        hr: {
            x: cx + (obj.x + obj.width - cx) * cosA - (obj.y + obj.height / 2 - cy) * sinA,
            y: cy + (obj.x + obj.width - cx) * sinA + (obj.y + obj.height / 2 - cy) * cosA
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