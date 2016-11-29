import $ from "jquery";

const serverPath = "/tables",
      selector = "#table-select";

function createOption(name) {
  return $(`<option value="${name}">${name}</option>`);
}

const TableSelect = {
  init(change, clear) {
    this.change = change;
    this.clear = clear;
    this.el = $(selector);
    this.el.on("change", this._tableSelected.bind(this));
    $.getJSON(serverPath).done(this._setTables.bind(this));
  },

  select(optionName) {
    setTimeout(() => {
      this.el.val(optionName).trigger("change");
    }, 0);
  },

  _tableSelected(event) {
    const selected = this.el.find("option:selected").val();
    if (selected !== "") {
      $.getJSON(serverPath + `/${selected}`).done(
        (table) => this.change(table, selected)
      )
    } else {
      this.clear();
    }
  },

  _setTables({tables}) {
    this.tables = [""].concat(tables.sort());
    this.tables.forEach((name) => {
      this.el.append(createOption(name));
    });
  }
};


export default TableSelect;
