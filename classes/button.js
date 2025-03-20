class Button {
    constructor({ position, click, imageSrc, hoverImageSrc, scale = {x: 1, y: 1}, isClickable = true, name = "", translation = {x: 0, y: 0} }) {
        this.position = position;
        this.click = click;
        this.image = new Image();
        this.hoverImage = new Image();
        this.image.src = imageSrc;
        this.hoverImage.src = hoverImageSrc;
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        }
        this.isHovering = false;
        this.scale = scale;
        this.startScale = {
            x: scale.x,
            y: scale.y
        }
        this.hoverScale = {
            x: scale.x * 1.2,
            y: scale.y * 1.2
        }
        this.isClickable = isClickable;
        this.name = name;
        this.translation = translation;
    }

    draw() {
        c.save();
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        c.scale(this.scale.x, this.scale.y);
        if (!this.isHovering) {
            c.drawImage(this.image, -this.width / 2, -this.height / 2);
        }
        else {
            c.drawImage(this.hoverImage, -this.width / 2, -this.height / 2);
        }
        c.restore();
    }
}