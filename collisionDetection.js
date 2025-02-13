function rotatePoint(px, py, angle, cx, cy) {
    let rad = angle * Math.PI / 180;
    let cosA = Math.cos(rad);
    let sinA = Math.sin(rad);

    let dx = px - cx;
    let dy = py - cy;

    return {
        x: cx + dx * cosA - dy * sinA,
        y: cy + dx * sinA + dy * cosA
    };
}

// Sprawdzenie, czy punkt (px, py) jest wewnątrz kwadratu
function isPointInSquare(px, py, sq_x, sq_y, sq_size) {
    return px >= sq_x && px <= sq_x + sq_size && py >= sq_y && py <= sq_y + sq_size;
}

// Sprawdzenie, czy dwa odcinki się przecinają
function doLinesIntersect(A, B, C, D) {
    function crossProduct(v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    }

    function subtract(v1, v2) {
        return { x: v1.x - v2.x, y: v1.y - v2.y };
    }

    let AB = subtract(B, A);
    let AC = subtract(C, A);
    let AD = subtract(D, A);
    let CD = subtract(D, C);
    let CA = subtract(A, C);
    let CB = subtract(B, C);

    let cross1 = crossProduct(AB, AC);
    let cross2 = crossProduct(AB, AD);
    let cross3 = crossProduct(CD, CA);
    let cross4 = crossProduct(CD, CB);

    return (cross1 * cross2 < 0) && (cross3 * cross4 < 0);
}

// Sprawdzenie kolizji
function isColliding(rotatedRect, square) {
    let { x, y, width, height, angle } = rotatedRect;
    let { sq_x, sq_y, sq_size } = square;

    // Środek prostokąta
    let cx = x + width / 2, cy = y + height / 2;

    // Wierzchołki prostokąta po rotacji
    let corners = [
        rotatePoint(x, y, angle, cx, cy),
        rotatePoint(x + width, y, angle, cx, cy),
        rotatePoint(x, y + height, angle, cx, cy),
        rotatePoint(x + width, y + height, angle, cx, cy)
    ];

    // Wierzchołki kwadratu
    let squareCorners = [
        { x: sq_x, y: sq_y },
        { x: sq_x + sq_size, y: sq_y },
        { x: sq_x, y: sq_y + sq_size },
        { x: sq_x + sq_size, y: sq_y + sq_size }
    ];

    // **1️⃣ Sprawdzenie, czy jakikolwiek róg prostokąta jest w kwadracie**
    for (let corner of corners) {
        if (isPointInSquare(corner.x, corner.y, sq_x, sq_y, sq_size)) {
            return true; // Kolizja!
        }
    }

    // **2️⃣ Sprawdzenie, czy jakikolwiek róg kwadratu jest w prostokącie**
    let rectMinX = Math.min(...corners.map(c => c.x));
    let rectMaxX = Math.max(...corners.map(c => c.x));
    let rectMinY = Math.min(...corners.map(c => c.y));
    let rectMaxY = Math.max(...corners.map(c => c.y));

    for (let corner of squareCorners) {
        if (corner.x >= rectMinX && corner.x <= rectMaxX &&
            corner.y >= rectMinY && corner.y <= rectMaxY) {
            return true; // Kolizja!
        }
    }

    // **3️⃣ Sprawdzenie, czy krawędzie przecinają się**
    let rectEdges = [
        [corners[0], corners[1]],
        [corners[1], corners[3]],
        [corners[3], corners[2]],
        [corners[2], corners[0]]
    ];

    let squareEdges = [
        [squareCorners[0], squareCorners[1]],
        [squareCorners[1], squareCorners[3]],
        [squareCorners[3], squareCorners[2]],
        [squareCorners[2], squareCorners[0]]
    ];

    for (let rectEdge of rectEdges) {
        for (let squareEdge of squareEdges) {
            if (doLinesIntersect(rectEdge[0], rectEdge[1], squareEdge[0], squareEdge[1])) {
                return true; // Kolizja!
            }
        }
    }

    return false; // Jeśli żaden test nie wykrył kolizji, brak kolizji
}

