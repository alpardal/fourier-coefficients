import $ from "jquery";
import debounce from "debounce";
import Hash from "./hash";
import Slider from "./slider";
import TableSelect from "./table_select";

const playButton = $('#play-button'),
      frequencyInput = $('#frequency-input'),
      frequencyButtons = $(".frequency-button"),
      sliderContainer = $("#sliders-container"),
      sliders = Array.from({length: 22}, Slider);

sliders[0].setTo(1, 0);
sliders.forEach((s) => s.appendTo(sliderContainer));

TableSelect.init(loadTable, defaultTable);

const ctx = new AudioContext();
let osc,
    freq = currentFrequency(),
    table = harmonicsTable(),
    playing = false;

function defaultTable() {
  sliders.forEach((s, i) => {
    const real = (i === 0 ? 1 : 0);
    s.setTo(real, 0);
  });
  Hash.clear("voice");
  settingsChanged();
}

function loadTable(table, tableName) {
  const real = table.real,
        imag = table.imag;
  for (let i = 1; i < real.length && i-1 < sliders.length; i++) {
    sliders[i-1].setTo(real[i], imag[i]);
  }
  Hash.add({voice: tableName});
  settingsChanged();
}

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
  Hash.add({frequency: freq});
  if (playing) {
    play();play();
  }
}

function loadHash() {
  const options = Hash.get();
  if (options.frequency) {
    frequencyInput.val(options.frequency);
    freq = currentFrequency();
  }
  if (options.voice) {
    TableSelect.select(options.voice);
  }
}

playButton.on("click", play);
frequencyInput.on("input", debounce(settingsChanged, 300));
frequencyButtons.on("click", (e) => {
  frequencyInput.val($(e.target).data("freq")).change();
  settingsChanged();
});
sliders.forEach((s) => s.onChange(settingsChanged));
loadHash();
