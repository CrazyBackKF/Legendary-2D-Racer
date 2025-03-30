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
        },
        
        mid: {
            x: cx,
            y: cy
        }
    }
}

// Funkcja obliczająca przetransformowane wierzchołki obiektu (uwzględnia pivot)
function getTransformedVertices(entity) { //
    // Obliczamy punkt obrotu
    const centerX = entity.position.x + entity.width / 2;
    const centerY = entity.position.y + entity.height / 4;
    // Definiujemy wierzchołki jako lewy górny róg, prawy górny, prawy dolny, lewy dolny
    const corners = [
        { x: entity.position.x, y: entity.position.y },
        { x: entity.position.x + entity.width, y: entity.position.y },
        { x: entity.position.x + entity.width, y: entity.position.y + entity.height },
        { x: entity.position.x, y: entity.position.y + entity.height }
    ];
    
    // Jeśli kąt jest w stopniach, przekonwertuj na radiany
    const rad = entity.angle;
    
    // Obracamy każdy wierzchołek względem punktu obrotu
    return corners.map(corner => {
        const dx = corner.x - centerX;
        const dy = corner.y - centerY;
        return {
            x: centerX + dx * Math.cos(rad) - dy * Math.sin(rad),
            y: centerY + dx * Math.sin(rad) + dy * Math.cos(rad)
        };
    });
}

// Funkcja pomocnicza sprawdzająca oś separacji
function checkSeparatingAxis(verticesA, verticesB) { //
    for (let i = 0; i < verticesA.length; i++) {
        const j = (i + 1) % verticesA.length;
        // Krawędź pomiędzy kolejnymi wierzchołkami
        const edge = { x: verticesA[j].x - verticesA[i].x, y: verticesA[j].y - verticesA[i].y };
        // Normalna do krawędzi
        const normal = { x: -edge.y, y: edge.x };

        let minA = Infinity, maxA = -Infinity;
        let minB = Infinity, maxB = -Infinity;

        // Rzutujemy wierzchołki pierwszego obiektu na normalną
        for (const v of verticesA) {
            const projection = v.x * normal.x + v.y * normal.y;
            minA = Math.min(minA, projection);
            maxA = Math.max(maxA, projection);
        }

        // Rzutujemy wierzchołki drugiego obiektu na tę samą normalną
        for (const v of verticesB) {
            const projection = v.x * normal.x + v.y * normal.y;
            minB = Math.min(minB, projection);
            maxB = Math.max(maxB, projection);
        }

        // Jeżeli przedziały nie zachodzą na siebie, to brak kolizji
        if (maxA < minB || maxB < minA) {
            return false;
        }
    }
    return true;
}

function pointInPolygon(point, polygon) { //
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;
        const intersect = ((yi > point.y) !== (yj > point.y)) &&
                          (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// sprawdam kolizję algorytmem Seprating Axis Theorem
function satCollision(entityA, entityB) {
    const verticesA = getTransformedVertices(entityA);
    const verticesB = getTransformedVertices(entityB);
    
    const colliding = checkSeparatingAxis(verticesA, verticesB) && checkSeparatingAxis(verticesB, verticesA);
    
    if (!colliding) {
        return false;
    }
    return true;
}