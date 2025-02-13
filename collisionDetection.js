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

// Pobieranie normalnych osi (wektory prostopadłe do krawędzi)
function getAxes(corners) {
    return [
        { x: -(corners[1].y - corners[0].y), y: (corners[1].x - corners[0].x) }, // Krawędź 1
        { x: -(corners[2].y - corners[0].y), y: (corners[2].x - corners[0].x) }  // Krawędź 2
    ].map(axis => {
        let length = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
        return { x: axis.x / length, y: axis.y / length };
    });
}

// Rzutowanie punktów na oś
function projectPolygon(vertices, axis) {
    let min = Infinity, max = -Infinity;
    for (let v of vertices) {
        let projection = (v.x * axis.x + v.y * axis.y);
        if (projection < min) min = projection;
        if (projection > max) max = projection;
    }
    return { min, max };
}

// Sprawdzenie kolizji SAT
function isCollidingSAT(rotatedRect, square) {
    let { x, y, width, height, angle } = rotatedRect;
    let { sq_x, sq_y, sq_size } = square;

    // **Obliczamy środek prostokąta**
    let cx = x + width / 2, cy = y + height / 2;

    // **Wierzchołki rotowanego prostokąta** (ustawione względem środka)
    let corners = [
        rotatePoint(x, y, angle, cx, cy),
        rotatePoint(x + width, y, angle, cx, cy),
        rotatePoint(x, y + height, angle, cx, cy),
        rotatePoint(x + width, y + height, angle, cx, cy)
    ];

    // **Wierzchołki kwadratu**
    let squareCorners = [
        { x: sq_x, y: sq_y },
        { x: sq_x + sq_size, y: sq_y },
        { x: sq_x, y: sq_y + sq_size },
        { x: sq_x + sq_size, y: sq_y + sq_size }
    ];

    // **Pobieramy osie normalne dla obu figur**
    let axes = [...getAxes(corners), { x: 1, y: 0 }, { x: 0, y: 1 }];

    // **Sprawdzamy kolizję na każdej osi**
    for (let axis of axes) {
        let proj1 = projectPolygon(corners, axis);
        let proj2 = projectPolygon(squareCorners, axis);

        // Jeśli na jakiejś osi nie nachodzą się, to nie ma kolizji
        if (proj1.max < proj2.min || proj2.max < proj1.min) {
            return false;
        }
    }

    return true; // Jeśli nie znaleźliśmy separacji, to mamy kolizję
}