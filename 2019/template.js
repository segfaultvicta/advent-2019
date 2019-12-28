export { ok, init, test_inputs, test_outputs, input, step }

function ok() {
    return true;
}

function init(c, rawinput) {
    c.debug.unshift("Reticulating splines...");
    c.input = rawinput.split("\n").map(e => e.trim()); // usually, this'll be fine
    c.sum = 0;
}

async function step(c) {
    if (c.halt) {
        set_output(c);
        return;
    }
    var curr = c.input[c.ptr];
    c.debug.unshift(`Handling input ${curr} at input pointer ${c.ptr}`);

    c.display = [];

    /// THE CHANGEY BITS



    /// END OF THE CHANGEY BITS

    c.ptr++;

    c.halt = c.halt || terminate(c);
    await new Promise(r => setTimeout(r, c.slowdown));
    set_output(c);
}

function terminate(c) {
    return c.ptr >= c.input.length;
}

function set_output(c) {
    c.output = null;
}

function test_inputs() {
    return []
}

function test_outputs() {
    return []
}

function input() {
    return ``
}