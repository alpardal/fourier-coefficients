
class GraphicsClass {
  constructor(canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.cx = this.width/2;
    this.cy = this.height/2;
    this.ctx = canvas.getContext("2d");
  }

  render(real, imag) {
    this._clearBackground();
    this._drawAxes();
    this._drawVec(real, imag);
  }

  valueAt([x, y]) {
    const real = x/this.cx - 1,
          imag = 1 - y/this.cy;
    return [real, imag];
  }

  _clearBackground() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  _drawAxes() {
    this._color("gray");
    this._line(0, this.cy, this.width, this.cy);
    this._line(this.cx, 0, this.cx, this.height);
  }

  _drawVec(real, imag) {
    this._color("blue");
    const [x, y] = this._coordToPixel(real, imag);
    this._line(this.cx, this.cy, x, y);
    this._fillCircle(x, y, 3);
  }

  _line(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  _fillCircle(x, y, radius) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2*Math.PI);
    this.ctx.fill();
  }

  _color(color) {
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
  }

  _coordToPixel(real, imag) {
    const x = this.cx * (1 + real),
          y = this.cy * (1 - imag);
    return [x, y];
  }
}

function Graphics(canvas) {
  return new GraphicsClass(canvas);
}


export default Graphics;
