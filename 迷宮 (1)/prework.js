/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let translate = function () {
    if (arguments.length === 1)
        ctx.translate(arguments.x, arguments.y);
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
        ctx.moveTo(arguments.x, arguments.y);
    else
        ctx.moveTo(...arguments);
}
let lineTo = function () {
    if (arguments.length === 1)
        ctx.lineTo(arguments.x, arguments.y);
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
let GCP = str => { // globalCompositeOperation
    ctx.globalCompositeOperation = str;
}
let lineCap = str => {
    ctx.lineCap = str;
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
let ww, wh;
function WC() {
    ww = window.innerWidth;
    wh = window.innerHeight;
    canvas.width = ww;
    canvas.height = wh;
    translate(ww / 2, wh / 2);
} WC();
window.onresize = WC;