export { ok, init, test_inputs, test_outputs, input, step }

function ok() {
    return true;
}

function disp(c, line, limit = 100) {
    if (c.display.length > limit) {
        c.display.shift();
    }
    c.display.push(line);
}

function debug(c, line, limit = 100) {
    if (c.allow_debug) {
        if (c.debug.length > limit) {
            c.debug.pop();
        }
        c.debug.unshift(line);
    }
}


function init(c, rawinput) {
    debug(c, "Reticulating splines...");
    c.input = rawinput.split(",").map(e => parseInt(e));
    c.display = [];
    c.noun = 0;
    c.verb = 0;
}

function read_next_value(c) {
    c.ptr++;
    var idx = c.mem[c.ptr];
    return [idx, c.mem[idx]];
}

function read_next_address(c) {
    c.ptr++;
    return c.mem[c.ptr];
}

function advance(c) {
    c.ptr++;
}

async function run_program(c) {
    var inst = c.mem[c.ptr];

    switch (inst) {
        case 99:
            debug(c, 'HALT');
            c.running = false;
            break;

        case 1:
            var [ADDR_a, a] = read_next_value(c);
            var [ADDR_b, b] = read_next_value(c);
            var ADDR_store = read_next_address(c);
            var res = a + b;

            debug(c, `ADD @${ADDR_a}:[${a}], @${ADDR_b}:[${b}] (${res}) -> @${ADDR_store}`);
            c.mem[ADDR_store] = res;

            advance(c);
            break;

        case 2:
            var [ADDR_a, a] = read_next_value(c);
            var [ADDR_b, b] = read_next_value(c);
            var ADDR_store = read_next_address(c);
            var res = a * b;

            debug(c, `MULT @${ADDR_a}:[${a}], @${ADDR_b}:[${b}] (${res}) -> @${ADDR_store}`);
            c.mem[ADDR_store] = res;

            advance(c);
            break;

        default:
            debug(c, `ERROR: unidentifiable opcode ${inst}`);
            c.halt = true;
            c.running = false;
            break;
    }

    if (c.allow_debug && !c.zoom) {
        await new Promise(r => setTimeout(r, c.slowdown)); // will never be relevant if we're disallowing debug text anyways
    }
}

async function step(c) {
    if (c.halt) {
        set_output(c);
        return;
    }

    c.running = true;

    c.mem = [...c.input];
    c.mem[1] = c.noun;
    c.mem[2] = c.verb;
    c.ptr = 0;

    c.allow_debug = false;
    while (c.running) {
        if (c.zoom) {
            run_program(c);
        } else {
            await run_program(c);
        }
    }
    c.allow_debug = true;

    set_output(c);
    disp(c, `NOUN ${c.noun} VERB ${c.verb} PRODUCES OUTPUT ${c.mem[0]}`)

    if (c.verb < 99) {
        c.verb++;
    } else {
        c.verb = 0;
        c.noun++;
    }

    c.halt = c.halt || terminate(c);
    if (!c.zoom) {
        await new Promise(r => setTimeout(r, c.slowdown));
    }
}

function terminate(c) {
    return c.mem[0] == 19690720 || (c.noun == 99 && c.verb == 99);
}

function set_output(c) {
    c.output = c.noun * 100 + c.verb;
}

function test_inputs() {
    return []
}

function test_outputs() {
    return []
}

function input() {
    return `1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,10,19,1,19,5,23,1,6,23,27,1,27,5,31,2,31,10,35,2,35,6,39,1,39,5,43,2,43,9,47,1,47,6,51,1,13,51,55,2,9,55,59,1,59,13,63,1,6,63,67,2,67,10,71,1,9,71,75,2,75,6,79,1,79,5,83,1,83,5,87,2,9,87,91,2,9,91,95,1,95,10,99,1,9,99,103,2,103,6,107,2,9,107,111,1,111,5,115,2,6,115,119,1,5,119,123,1,123,2,127,1,127,9,0,99,2,0,14,0`
}