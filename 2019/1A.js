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

    c.display[0] = `Module ${c.ptr} has mass ${curr}`;

    var required_fuel = Math.floor(curr / 3) - 2;

    c.display[2] = `The required fuel for that module is ${required_fuel}!`
    c.sum += required_fuel;
    c.display[4] = `The total required fuel so far is ${c.sum}!`

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
    c.output = c.sum;
}

function test_inputs() {
    return ["12", "14", "1969", "100756"]
}

function test_outputs() {
    return [2, 2, 654, 33583]
}

function input() {
    return `51360
    95527
    72603
    128601
    68444
    138867
    67294
    134343
    62785
    53088
    134635
    137884
    97654
    103704
    138879
    87561
    83922
    68414
    84876
    105143
    76599
    98924
    57080
    63590
    50126
    111872
    55754
    64410
    78488
    56557
    105446
    127182
    59451
    87249
    61652
    131698
    148820
    95742
    68223
    121744
    65678
    99745
    64089
    75610
    106085
    100364
    116959
    122862
    56580
    109631
    82895
    79666
    133474
    50579
    83473
    140028
    125999
    68225
    131345
    90797
    84914
    81915
    65369
    71230
    50379
    106385
    118503
    119640
    138540
    70678
    95881
    100282
    123060
    147368
    93030
    82553
    131271
    147675
    111126
    115183
    82956
    145698
    99261
    52768
    99207
    123551
    64738
    117275
    98136
    111592
    78576
    118613
    130351
    68567
    72356
    85608
    129414
    66521
    76924
    130449`
}