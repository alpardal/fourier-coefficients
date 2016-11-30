import $ from "jquery";
import Graphics from "./graphics";

const template = `
<div class="input-col">
  <canvas width=100 height=100></canvas>
  <label>0</label>
</div>
`;

class ComplexInputClass {
  constructor(element) {
    this.element = element;
    this.real = 0;
    this.imag = 0;
    const canvas = this.element.find("canvas").get(0);
    this.graphics = Graphics(canvas);
    this.label = this.element.find("label");

    canvas.addEventListener('mousedown', this._mouseDown.bind(this));
    canvas.addEventListener('mouseup', this._mouseUp.bind(this));
    canvas.addEventListener('mousemove', this._mouseMove.bind(this));
  }

  setTo(real, imag) {
    this.real = real;
    this.imag = imag;
    this._changed();
  }

  appendTo(container) {
    container.append(this.element);
    this._render();
  }

  onChange(listener) {
    this.listener = listener;
  }

  _changed() {
    this.label.text(`(${this.real.toFixed(2)}, ${this.imag.toFixed(2)})`);
    this._render();
    if (this.listener) {
      this.listener(this.real, this.imag);
    }
  }

  _render() {
    this.graphics.render(this.real, this.imag);
  }

  _mouseDown(event) {
    this.down = true;
  }

  _mouseUp(event) {
    this.down = false;
    if (this.lastPosition) {
    }
  }

  _mouseMove(event) {
    if (this.down) {
      const pos = this.graphics.valueAt(this._eventCoords(event));
      this.setTo(...pos);
    }
  }

  _eventCoords(event) {
    return [event.offsetX, event.offsetY];
  }
}

function ComplexInput() {
  return new ComplexInputClass($(template));
}


export default ComplexInput;
