import $ from "jquery";

const template = `
<div class="slider-col">
  <input type="range" min="0" max="1" value="0" id="fader" step=".01">
  <label>0</label>
</div>
`;

class SliderClass {
  constructor(element) {
    this.element = element;
    this.currentValue = 0;
    this.input = this.element.find("input");
    this.label = this.element.find("label");
    this.input.on('input', this._changed.bind(this));
  }

  value() {
    return this.currentValue;
  }

  setTo(value) {
    this.currentValue = value;
    this.label.text(`${value}`);
    this.input.val(value);
  }

  appendTo(container) {
    container.append(this.element);
  }

  onChange(listener) {
    this.listener = listener;
  }

  _changed() {
    this.currentValue = this.input.val();
    this.label.text(`${this.currentValue}`);
    if (this.listener) {
      this.listener(this.currentValue);
    }
  }
}

function Slider() {
  return new SliderClass($(template));
}


export default Slider;
