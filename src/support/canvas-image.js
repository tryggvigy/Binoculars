
oo._support.CanvasImage = function (image) {
    this.canvas  = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    this.width  = this.canvas.width  = image.width;
    this.height = this.canvas.height = image.height;

    this.context.drawImage(image, 0, 0, this.width, this.height);
};

oo._support.CanvasImage.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

oo._support.CanvasImage.prototype.update = function (imageData) {
    this.context.putImageData(imageData, 0, 0);
};

oo._support.CanvasImage.prototype.getPixelCount = function () {
    return this.width * this.height;
};

oo._support.CanvasImage.prototype.getImageData = function () {
    return this.context.getImageData(0, 0, this.width, this.height);
};

oo._support.CanvasImage.prototype.removeCanvas = function () {
    this.canvas.parentNode.removeChild(this.canvas);
};
