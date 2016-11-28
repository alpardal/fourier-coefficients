import $ from "jquery";
import debounce from "debounce";
import Slider from "./slider";

const playButton = $('#play-button'),
      frequencyInput = $('#frequency-input'),
      sliderContainer = $("#sliders-container"),
      sliders = Array.from({length: 10}, Slider);

sliders[0].setTo(1, 0);
sliders.forEach((s) => s.appendTo(sliderContainer));

const ctx = new AudioContext();
let osc,
    freq = currentFrequency(),
    table = harmonicsTable(),
    playing = false;

function loadTable(table) {
  for (let i = 1; i < table.length && i-1 < sliders.length; i++) {
    sliders[i-1].setTo(table[i]);
  }
  settingsChanged();
}

// setTimeout(() => {
//   loadTable([0, 0.5, 0.4, 0.2, 0.4, 0, 0.4, 0, 0.4, 0, 0.4, 0, 0.4]);
//   play();
// }, 0);

function harmonicsTable() {
  const real = new Float32Array([0].concat(sliders.map((s) => s.real))),
        imag = new Float32Array([0].concat(sliders.map((s) => s.imag)));
  return ctx.createPeriodicWave(real, imag);
}

function currentFrequency() {
  return Number(frequencyInput.val());
}

function play() {
  if (playing) {
    osc.disconnect();
    playButton.text("Play");
    playing = false;
  } else {
    osc = ctx.createOscillator();
    osc.frequency.value = Number(frequencyInput.val());
    osc.setPeriodicWave(table);
    osc.connect(ctx.destination);
    osc.start(0);
    playButton.text("Stop");
    playing = true;
  }
}

function settingsChanged() {
  freq = currentFrequency();
  table = harmonicsTable();
  if (playing) {
    play();play();
  }
}

playButton.on('click', play);
frequencyInput.on('input', debounce(settingsChanged, 300));
sliders.forEach((s) => s.onChange(settingsChanged));
