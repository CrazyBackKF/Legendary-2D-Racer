function getPoints(obj1, angle = 0) {
    let rad = angle * Math.PI / 180; // Zamiana stopni na radiany
    let cosA = Math.cos(rad);
    let sinA = Math.sin(rad);
    const cx = obj1.x + obj1.width / 2;
    const cy = obj1.y + obj1.height / 4;

    return {
        lt: {
            x: cx + (obj1.x - cx) * cosA - (obj1.y - cy) * sinA,
            y: cy + (obj1.x - cx) * sinA + (obj1.y - cy) * cosA
        },

        rt: {
            x: cx + (obj1.x + obj1.width - cx) * cosA - (obj1.y - cy) * sinA,
            y: cy + (obj1.x + obj1.width - cx) * sinA + (obj1.y - cy) * cosA
        },

        lb: {
            x: cx + (obj1.x + obj1.width - cx) * cosA - (obj1.y + obj1.height - cy) * sinA,
            y: cy + (obj1.x + obj1.width - cx) * sinA + (obj1.y + obj1.height - cy) * cosA
        },

        rb: {
            x: cx + (obj1.x - cx) * cosA - (obj1.y + obj1.height - cy) * sinA,
            y: cy + (obj1.x - cx) * sinA + (obj1.y + obj1.height - cy) * cosA
        }
    }
}

function isColliding(obj1, obj2) {
    obj1.corners = getPoints(obj1, obj1.angle);
    obj2.corners = getPoints(obj2);

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