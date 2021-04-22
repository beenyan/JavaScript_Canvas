/** @type {HTMLCanvasElement} */
class Vector {
    static add(v1, v2 = v1) {
        const Integer = Number(v2) === v2;
        return {
            x: v1.x + (Integer ? v2 : v2.x),
            y: v1.y + (Integer ? v2 : v2.y)
        }
    }
    static minus(v1, v2 = v1) {
        const Integer = Number(v2) === v2;
        return {
            x: v1.x - (Integer ? v2 : v2.x),
            y: v1.y - (Integer ? v2 : v2.y)
        }
    }
    static set(x = 0, y = x) {
        return { x, y };
    }
    static equal(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y;
    }
    static mul(v1, v2 = v1) {
        const Integer = Number(v2) === v2;
        return {
            x: v1.x * (Integer ? v2 : v2.x),
            y: v1.y * (Integer ? v2 : v2.y)
        }
    }
    static transform(v) {
        const Direct = {
            right: Vector.set(1, 0),
            left: Vector.set(-1, 0),
            down: Vector.set(0, 1),
            up: Vector.set(0, -1),
        }
        if (v.x > 0) return 'right';
        else if (v.x < 0) return 'left';
        else if (v.y > 0) return 'down';
        else if (v.y < 0) return 'up';
        else return Direct[v];
    }
    static reverse(dir) {
        const Direct = {
            right: 'left',
            left: 'right',
            down: 'up',
            up: 'down',
        }
        return Direct[dir];
    }
    static swap(v) {
        return {
            x: v.y,
            y: v.x
        }
    }
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let translate = function () {
    if (arguments.length === 1)
        ctx.translate(arguments[0].x, arguments[0].y);
    else
        ctx.translate(...arguments);
}
let transform = function () {
    arguments = [...arguments];
    while (arguments.length < 6) arguments.push(0);
    ctx.transform(...arguments);
}
let fill = function () {
    if (arguments.length === 0)
        ctx.fill();
    else if (arguments.length === 1)
        ctx.fillStyle = arguments[0];
    else
        ctx.fillRect(...arguments);
}
let stroke = function () {
    if (arguments.length === 0)
        ctx.stroke();
    else if (arguments.length === 1)
        ctx.strokeStyle = arguments[0];
    else
        ctx.strokeRect(...arguments);
}
let save = fun1 => {
    ctx.save();
    fun1();
    ctx.restore();
}
let rotate = ang => {
    ctx.rotate(ATP(ang));
}
let shadow = (width, color, offx = 0, offy = 0) => {
    if (width) ctx.shadowBlur = width;
    if (color) ctx.shadowColor = color;
    ctx.shadowOffsetX = offx;
    ctx.shadowOffsetY = offy;
}
let moveTo = function () {
    if (arguments.length === 1)
        ctx.moveTo(arguments[0].x, arguments[0].y);
    else
        ctx.moveTo(...arguments);
}
let lineTo = function () {
    if (arguments.length === 1)
        ctx.lineTo(arguments[0].x, arguments[0].y);
    else
        ctx.lineTo(...arguments);
}
let begin = () => {
    ctx.beginPath();
}
let close = () => {
    ctx.closePath();
}
let arc = (x, y, size, beginAng = 0, endAng = ATP(360)) => {
    ctx.arc(x, y, size, beginAng, endAng);
}
let lineW = width => {
    ctx.lineWidth = width;
}
let clearRect = function () {
    if (arguments.length)
        ctx.clearRect(...arguments);
    else
        ctx.clearRect(-ww, -wh, ww * 2, wh * 2);
}
let deepcopy = json => {
    return JSON.parse(JSON.stringify(json));
}
let GCP = str => { // globalCompositeOperation
    ctx.globalCompositeOperation = str;
}
let lineCap = str => {
    ctx.lineCap = str;
}
let lineJoin = str => {
    ctx.lineJoin = str;
}
let filltext = (text, x = 0, y = 0, maxWidth) => {
    ctx.fillText(text, x, y, maxWidth);
}
let stroketext = (text, x = 0, y = 0, maxWidth) => {
    ctx.strokeText(text, x, y, maxWidth);
}
let font = str => {
    ctx.font = str;
}
let textAlign = (str = 'center') => {
    ctx.textAlign = str;
}
let textBaseline = (str = 'middle') => {
    ctx.textBaseline = str;
}
let scale = (x = 1, y = 1) => {
    ctx.scale(x, y);
}


function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const ATP = angle => { // angel to pi
    return Math.PI / 180 * angle;
}