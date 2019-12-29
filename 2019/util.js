export { disp, debug };

function dispchars(ch) {
    switch (ch) {
        case '♥':
            return '<span class="display-red">';

        case '♦':
            return '<span class="display-yellow">';

        case '♣':
            return '<span class="display-green">';

        case '♠':
            return '<span class="display-blue">';

        case '•':
            return '<span class="display-tiny">';

        case '☺':
            return '</span>';

        case '☻':
            return '<span class="display-bold">';

        case '◄':
            return '<span class="display-left">';

        case '►':
            return '<span class="display-right">';

        case '○':
            return '';

        default:
            return ch;
    }
}

function disp(c, line, limit = 100) {
    if (c.display.length > limit) {
        c.display.shift();
    }
    c.display.push(line.split("").map(ch => dispchars(ch)).join(""));
}

function debug(c, line, limit = 100) {
    if (c.allow_debug) {
        if (c.debug.length > limit) {
            c.debug.pop();
        }
        c.debug.unshift(line);
    }
}