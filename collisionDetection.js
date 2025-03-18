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

function getRotatedVertices(entity) {
    const { position, width, height, angle } = entity;
    const centerX = position.x + width / 2;
    const centerY = position.y + height / 4;

    const corners = [
        { x: position.x, y: position.y },
        { x: position.x + width, y: position.y },
        { x: position.x + width, y: position.y + height },
        { x: position.x, y: position.y + height }
    ];

    return corners.map(corner => rotatePoint(corner, centerX, centerY, angle));
}

function rotatePoint(point, centerX, centerY, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = point.x - centerX;
    const dy = point.y - centerY;

    return {
        x: centerX + dx * cos - dy * sin,
        y: centerY + dx * sin + dy * cos
    };
}

// Funkcja obliczająca przetransformowane wierzchołki obiektu (uwzględnia pivot)
function getTransformedVertices(entity) {
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

// Funkcja główna sprawdzająca kolizję SAT między dwoma obiektami
function satCollision(entityA, entityB) {
    const verticesA = getTransformedVertices(entityA);
    const verticesB = getTransformedVertices(entityB);
    return checkSeparatingAxis(verticesA, verticesB) && checkSeparatingAxis(verticesB, verticesA);
}

// Funkcja pomocnicza sprawdzająca oś separacji
function checkSeparatingAxis(verticesA, verticesB) {
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

function pointInPolygon(point, polygon) {
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

// Rozszerzona funkcja SAT, która oprócz wykrycia kolizji, zwraca też wierzchołki kolidujące
function satCollisionWithVertices(entityA, entityB) {
    const verticesA = getTransformedVertices(entityA);
    const verticesB = getTransformedVertices(entityB);
    
    const colliding = checkSeparatingAxis(verticesA, verticesB) && checkSeparatingAxis(verticesB, verticesA);
    
    if (!colliding) {
        return { colliding: false, collidingVertices: [] };
    }
    
    let collidingVertices = [];
    
    // Sprawdzamy, które wierzchołki z A są wewnątrz B
    for (const vertex of verticesA) {
        if (pointInPolygon(vertex, verticesB)) {
            collidingVertices.push(vertex);
        }
    }
    
    // Sprawdzamy, które wierzchołki z B są wewnątrz A
    for (const vertex of verticesB) {
        if (pointInPolygon(vertex, verticesA)) {
            collidingVertices.push(vertex);
        }
    }
    
    return { colliding: true, collidingVertices };
}

// Funkcja pomocnicza, która pobiera wierzchołki jako tablicę w odpowiedniej kolejności
function getVertices(entity) {
    // Ustal pivot zgodnie z Twoim kodem: (position.x + width/2, position.y + height/4)
    const pivotX = entity.position.x + entity.width / 2;
    const pivotY = entity.position.y + entity.height / 4;
    // Pobieramy punkty z getPoints (zakładamy, że kąt jest w stopniach)
    const points = getPoints(entity, entity.angle, pivotX, pivotY, false);
    // Zwracamy wierzchołki w kolejności: lt, rt, rb, lb (tworząc poprawny wielokąt)
    return [points.lt, points.rt, points.rb, points.lb];
}

// Funkcja obliczająca Minimal Translation Vector (MTV)
function computeMTV(entityA, entityB) {
    const verticesA = getVertices(entityA);
    const verticesB = getVertices(entityB);
    let mtvAxis = null;
    let mtvOverlap = Infinity;

    // Pobieramy osie (normale) dla obu wielokątów
    const axesA = getAxes(verticesA);
    const axesB = getAxes(verticesB);
    const axes = axesA.concat(axesB);

    for (const axis of axes) {
        const projA = project(verticesA, axis);
        const projB = project(verticesB, axis);
        // Obliczamy nakładanie (overlap) między projekcjami
        const overlap = Math.min(projA.max, projB.max) - Math.max(projA.min, projB.min);
        if (overlap < 0) {
            // Brak kolizji
            return { colliding: false, mtv: null };
        }
        if (overlap < mtvOverlap) {
            mtvOverlap = overlap;
            mtvAxis = axis;
        }
    }

    // Obliczamy środki obu wielokątów
    const centerA = computeCenter(verticesA);
    const centerB = computeCenter(verticesB);
    const centerDiff = { x: centerB.x - centerA.x, y: centerB.y - centerA.y };
    console.log(mtvAxis)
    // Upewniamy się, że MTV skierowany jest z entityA na zewnątrz (od entityB)
    if (dot(centerDiff, mtvAxis) < 0) {
        mtvAxis = { x: -mtvAxis.x, y: -mtvAxis.y };
    }
    return { colliding: true, mtv: { x: mtvAxis.x * mtvOverlap, y: mtvAxis.y * mtvOverlap } };
}

function getAxes(vertices) {
    const axes = [];
    for (let i = 0; i < vertices.length; i++) {
        const j = (i + 1) % vertices.length;
        const edge = { x: vertices[j].x - vertices[i].x, y: vertices[j].y - vertices[i].y };
        // Normalna do krawędzi
        const normal = { x: -edge.y, y: edge.x };
        // Normalizacja wektora
        const length = Math.hypot(normal.x, normal.y);
        axes.push({ x: normal.x / length, y: normal.y / length });
    }
    return axes;
}

function project(vertices, axis) {
    let min = Infinity, max = -Infinity;
    for (const v of vertices) {
        const projection = v.x * axis.x + v.y * axis.y;
        min = Math.min(min, projection);
        max = Math.max(max, projection);
    }
    return { min, max };
}

function computeCenter(vertices) {
    let center = { x: 0, y: 0 };
    for (const v of vertices) {
        center.x += v.x;
        center.y += v.y;
    }
    center.x /= vertices.length;
    center.y /= vertices.length;
    return center;
}

function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}