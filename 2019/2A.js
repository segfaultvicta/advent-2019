export { ok, init, test_inputs, test_outputs, input, step }

function ok() {
    return true;
}

function init(c, rawinput) {
    c.debug.unshift("Reticulating splines...");
    c.input = rawinput.split(",").map(e => parseInt(e));
    c.input[1] = 12;
    c.input[2] = 2;
}

async function step(c) {
    if (c.halt) {
        set_output(c);
        return;
    }
    var curr = c.input[c.ptr];

    c.display = [];

    /// THE CHANGEY BITS

    c.display = c.input.map((e, i) => i == c.ptr ? `--> ${i}: ${e}` : `${i}: ${e}`);

    c.display.push("-----------------------------------------");

    switch (curr) {
        case 99:
            c.display.push(`HALT`);
            c.debug.unshift('HALT');
            c.halt = true;
            break;

        case 1:
            c.ptr++;
            var a_idx = c.input[c.ptr];
            var a = c.input[a_idx];
            c.ptr++;
            var b_idx = c.input[c.ptr];
            var b = c.input[b_idx];
            c.ptr++;
            var store = c.input[c.ptr];
            var res = a + b;
            c.ptr++;

            c.display.push(`ADD @${a_idx}:[${a}], @${b_idx}:[${b}] (${res}) -> @${store}`);
            c.debug.unshift(`ADD @${a_idx}:[${a}], @${b_idx}:[${b}] (${res}) -> @${store}`);
            c.input[store] = res;
            break;

        case 2:
            c.ptr++;
            var a_idx = c.input[c.ptr];
            var a = c.input[a_idx];
            c.ptr++;
            var b_idx = c.input[c.ptr];
            var b = c.input[b_idx];
            c.ptr++;
            var store = c.input[c.ptr];
            var res = a * b;
            c.ptr++;

            c.display.push(`MULT @${a_idx}:[${a}], @${b_idx}:[${b}] (${res}) -> @${store}`);
            c.debug.unshift(`MULT @${a_idx}:[${a}], @${b_idx}:[${b}] (${res}) -> @${store}`);
            c.input[store] = res;
            break;

        default:
            c.debug.unshift(`ERROR: unidentifiable opcode ${curr}`);
            c.halt = true;
            break;
    }

    /// END OF THE CHANGEY BITS

    c.halt = c.halt || terminate(c);
    await new Promise(r => setTimeout(r, c.slowdown));
    set_output(c);
}

function terminate(c) {
    return false; // intcode termination is handled by the step function
}

function set_output(c) {
    c.output = c.input[0];
}

function test_inputs() {
    return ["1,9,10,3,2,3,11,0,99,30,40,50", "1,0,0,0,99", "2,3,0,3,99", "2,4,4,5,99,0", "1,1,1,4,99,5,6,0,99"]
}

function test_outputs() {
    return ["3500", "2", "CHK", "CHK", "30"]
}

function input() {
    return `1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,10,19,1,19,5,23,1,6,23,27,1,27,5,31,2,31,10,35,2,35,6,39,1,39,5,43,2,43,9,47,1,47,6,51,1,13,51,55,2,9,55,59,1,59,13,63,1,6,63,67,2,67,10,71,1,9,71,75,2,75,6,79,1,79,5,83,1,83,5,87,2,9,87,91,2,9,91,95,1,95,10,99,1,9,99,103,2,103,6,107,2,9,107,111,1,111,5,115,2,6,115,119,1,5,119,123,1,123,2,127,1,127,9,0,99,2,0,14,0`
}