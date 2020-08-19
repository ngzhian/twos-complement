// Takes a user input, converts it into a 32-bit number.
// Stores string representation of number in dec, hex, and binary.
function Number32(value) {
  const i32arr = new Int32Array(1);
  const uint8_i32 = new Uint8Array(i32arr.buffer);
  i32arr[0] = value;

  function toHex(n) {
    if (n === 0) return '00';
    return n.toString(16).padStart(2, '0');
  }

  function toDec(n) {
    if (n === 0) return '0';
    return n.toString(10);
  }

  function toBin(n) {
    if (n === 0) return '00000000';
    return n.toString(2).padStart(8, '0');
  }

  function convert() {
    decimal.value = toDec(i32arr[0]);
    hexadecimal.value = "0x" + Array.from(uint8_i32).map(v => toHex(v)).reverse().join('');
    binary.value = "0b" + Array.from(uint8_i32).map(v => toBin(v)).reverse().join('');
  }

  convert();

  return {
    original: value,
    asi32: i32arr[0],
    decimal: decimal.value,
    hexadecimal: hexadecimal.value,
    binary: binary.value,
  }
}

// TODO separate entering numbers and performing calculation.

// Interface to update HTML and perform arithmetic.
function Calculator(id) {
  const OP_INDEX = 0;
  const DECICMAL_INDEX = 1;
  const HEXADECICMAL_INDEX = 2;
  const BINARY_INDEX = 3;
  const calc = document.getElementById('calculator');
  var storedOp = "";

  // The last row of the table always has input text, so you can edit the values.

  function finalize_numbers() {
    // Calculator will always have 1 initial row.
    // Insert second last row.
    let last_row = calc.rows[calc.rows.length-1];
    let save_row = calc.insertRow(calc.rows.length-1);

    // make 4 cells for the 3 representations to show and operation
    for (let i = 0; i < last_row.cells.length; i++) {
      let save_cell = save_row.insertCell();
      let input_cell = last_row.cells[i];
      if (input_cell.childElementCount === 0) {
        // tr > td > text
        save_cell.textContent = input_cell.textContent;
        input_cell.textContent = "";
      } else {
        // tr > td > input > value
        save_cell.textContent = input_cell.children[0].value;
        input_cell.children[0].value = "";
      }
    }
  }

  /// [1] =>   1  =>    1   =>    1
  //        + [ ]    + [2]     +  2
  //                              3
  //                           + [ ]

  function set_last_row(i32, op) {
    let last_row = calc.rows[calc.rows.length-1];

    if (typeof(op) !== "undefined") {
      last_row.cells[OP_INDEX].textContent = op;
    }

    if (typeof(i32) === "undefined") {
      // Adding a new row to show operation, no numbers yet.
      return;
    }

    last_row.cells[DECICMAL_INDEX].children[0].value = i32.decimal;
    last_row.cells[HEXADECICMAL_INDEX].children[0].value = i32.hexadecimal;
    last_row.cells[BINARY_INDEX].children[0].value = i32.binary;
  }

  function performOperation(op, inputs) {
    if (inputs.length < 2) {
      throw 'List wrong size';
    }
    let lhs = inputs[inputs.length-2];
    let rhs = inputs[inputs.length-1];
    if (storedOp == '+') {
      console.log(`${lhs.asi32} + ${rhs.asi32}`);
      return Number32(lhs.asi32 + rhs.asi32);
    } else if (storedOp == '-') {
      console.log(`${lhs.asi32} - ${rhs.asi32}`);
      return Number32(lhs.asi32 - rhs.asi32);
    } else {
      throw `Unsupported operation ${storedOp}`;
    }
  }

  function storeOp(op) {
    storedOp = op;
  }


  return {
    finalize_numbers,
    set_last_row,
    performOperation,
    storeOp,
  }
}

(function() {
  inputs = [];
  current = "";
  current_num = null;

  calc = new Calculator('calculator');

  function isSupportedOp(key) { return ['+', '-', '*', '/'].indexOf(key) !== -1; }

  // Driver to decide when to call specific operations of Calculator.
  function updateCalculator(e) {
    has_update = false;

    // console.log(e);

    // TODO support enter and equals keys, which will mean inputs need to only store up to 2 operators
    // Allow simple user edits to the current number, in the future maybe allow
    // use to focus on previously computed result and update it.
    if (e.code === "Backspace") {
      return;
      // current = current.slice(0, current.length-1);
      // has_update = true;
    } else if (e.code.startsWith("Digit")) {
      return;
      // Add to current input.
      // current += e.key;
      // has_update = true;
    } else if (isSupportedOp(e.key)) {
      // Nothing to do.
      if (e.target.value === "") { return; }

      // Performing an operation adds a new row to show the operation, and also the new number.
      inputs.push(current_num);
      current = "";
      current_num = null;

      // Two cases, we have 2 inputs to perform the operation, or it's pending a number.
      //   1
      //   2
      // <hit +>
      let op = e.key;
      calc.finalize_numbers();
      // possibly need to perform calculation
      if (inputs.length > 1) {
        let result = calc.performOperation(op, inputs);
        calc.storeOp(op);
        inputs.push(result)
        calc.set_last_row(result, undefined);
        calc.finalize_numbers();
        calc.set_last_row(undefined, op);
      } else {
        calc.storeOp(op);
        calc.set_last_row(undefined, op);
      }
    }

    if (!has_update) {
      return;
    }

    current_num = Number32(current);
    calc.set_last_row(current_num);
  }

  function updateInputs(e) {
    let current = e.target.value;
    current_num = Number32(current);
    calc.set_last_row(current_num);
  }


  document.getElementById("t1").addEventListener("keydown", updateCalculator);
  document.getElementById("t2").addEventListener("keydown", updateCalculator);
  document.getElementById("t3").addEventListener("keydown", updateCalculator);

  document.getElementById("t1").addEventListener("input", updateInputs);
  document.getElementById("t2").addEventListener("input", updateInputs);
  document.getElementById("t3").addEventListener("input", updateInputs);
})();

(function() {
  const DEBUG = 0;

  function debug() {
    if (!DEBUG) {
      let debug_elements = document.getElementsByClassName('debug');
      for (let i = 0; i < debug_elements.length; i++) {
        debug_elements[i].hidden = true;
      }
    }
  }

  debug();

  const i32arr = new Int32Array(1);
  const i64arr = new BigInt64Array(1);
  const uint8_i32 = new Uint8Array(i32arr.buffer);
  const uint8_i64 = new Uint8Array(i64arr.buffer);

  const bits = [
    document.getElementById('uint8_0'),
    document.getElementById('uint8_1'),
    document.getElementById('uint8_2'),
    document.getElementById('uint8_3'),
  ]
  const hex = [
    document.getElementById('uint8_0_hex'),
    document.getElementById('uint8_1_hex'),
    document.getElementById('uint8_2_hex'),
    document.getElementById('uint8_3_hex'),
  ]

  const hexadecimal = document.getElementById('hexadecimal');
  const binary = document.getElementById('binary');
  const decimal = document.getElementById('decimal');

  const hexadecimal64 = document.getElementById('hexadecimal64');
  const binary64 = document.getElementById('binary64');
  const decimal64 = document.getElementById('decimal64');

  function toHex(n) {
    if (n === 0) return '00';
    return n.toString(16).padStart(2, '0');
  }

  function toDec(n) {
    if (n === 0) return '0';
    return n.toString(10);
  }

  function toBin(n) {
    if (n === 0) return '00000000';
    return n.toString(2).padStart(8, '0');
  }

  function update(e) {
    if (!e) return;
    if (typeof(e) === undefined) return;
    i32arr[0] = e.target.value;

    // For debugging.
    bits.forEach((v, i) =>  bits[i].textContent = uint8_i32[i]);
    hex.forEach((v, i) =>  hex[i].textContent = toHex(uint8_i32[i]));

    let n = new Number32(e.target.value);
    // endianess?
    decimal.value = n.decimal;
    hexadecimal.value = n.hexadecimal;
    binary.value = n.binary;
  }

  decimal.addEventListener('focusout', update);
  hexadecimal.addEventListener('focusout', update);
  binary.addEventListener('focusout', update);

  function update64(e) {
    if (!e) return;
    if (typeof(e) === undefined) return;
    i64arr[0] = e.target.value;

    // endianess?
    decimal64.value = toDec(i64arr[0]);
    hexadecimal64.value = "0x" + Array.from(uint8_i64).map(v => toHex(v)).reverse().join('');
    binary64.value = "0b" + Array.from(uint8_i64).map(v => toBin(v)).reverse().join('');
  }

  decimal64.addEventListener('focusout', update64);
  hexadecimal64.addEventListener('focusout', update64);
  binary64.addEventListener('focusout', update64);
})();
