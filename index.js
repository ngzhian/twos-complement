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

    // endianess?
    decimal.value = toDec(i32arr[0]);
    hexadecimal.value = "0x" + Array.from(uint8_i32).map(v => toHex(v)).reverse().join('');
    binary.value = "0b" + Array.from(uint8_i32).map(v => toBin(v)).reverse().join('');
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
