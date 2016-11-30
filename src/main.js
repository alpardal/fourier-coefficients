import $ from "jquery";
import debounce from "debounce";
import Hash from "./hash";
import ComplexInput from "./complex_input";
import TableSelect from "./table_select";

const playButton = $('#play-button'),
      frequencyInput = $('#frequency-input'),
      frequencyButtons = $(".frequency-button"),
      inputsContainer = $("#input-container"),
      inputs = Array.from({length: 22}, ComplexInput);

inputs[0].setTo(1, 0);
inputs.forEach((i) => i.appendTo(inputsContainer));

TableSelect.init(loadTable, defaultTable);

const ctx = new AudioContext();
let osc,
    freq = currentFrequency(),
    table = harmonicsTable(),
    playing = false;

function defaultTable() {
  inputs.forEach((input, index) => {
    const real = (index === 0 ? 1 : 0);
    input.setTo(real, 0);
  });
  Hash.clear("voice");
  settingsChanged();
}

function loadTable(table, tableName) {
  const real = table.real,
        imag = table.imag;
  for (let i = 1; i < real.length && i-1 < inputs.length; i++) {
    inputs[i-1].setTo(real[i], imag[i]);
  }
  Hash.add({voice: tableName});
  settingsChanged();
}

function harmonicsTable() {
  const real = new Float32Array([0].concat(inputs.map((i) => i.real))),
        imag = new Float32Array([0].concat(inputs.map((i) => i.imag)));
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
inputs.forEach((i) => i.onChange(settingsChanged));
loadHash();
