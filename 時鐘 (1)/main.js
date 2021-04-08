function draw() {
    // 中間圓形時鐘
    const Angle = 360 / border;
    const upandown = size * 0.02; // 起伏差距
    const count = 20; // 起伏個數
    const speed = 8; // 旋轉速度
    fill('#222831')
    fill(-ww, -wh, ww * 2, wh * 2);
    save(() => { // 外框
        rotate(-90);
        begin();
        for (let i = 0; i < border; ++i) {
            lineW(size * 0.01);
            lineTo(size + upandown * Math.sin(ATP(Angle * i * count + times * speed)), 0);
            rotate(Angle);
        }
        close();
        fill('#10151d');
        fill();
        shadow(size * 0.08, 'aqua');
        stroke('#00adb5');
        stroke();
    })
    save(() => { // 時刻
        const Angle = 360 / 180;
        rotate(-90);
        for (let i = 1; i <= 180; ++i) {
            begin();
            stroke('#c41c1cC0');
            const distance = size + upandown * Math.sin(ATP(Angle * i * count + times * speed));
            lineW(size * (i % 5 ? 0.002 : 0.008));
            rotate(Angle);
            moveTo(distance - size * 0.01, 0);
            lineTo(distance - (i % 5 ? distance / 13 : distance / 9), 0);
            close();
            stroke();
        }
    })
    save(() => { // 點鐘
        const Angle = 360 / 12;
        const r = size * 0.75;
        for (let i = 1; i <= 12; ++i) {
            const pos = loca(r, Angle * i - 90);
            begin();
            fill('#adadad');
            textAlign();
            textBaseline();
            font(`bold ${size * 0.15}px Airla`);
            shadow(5, 'blue', 1.2, 1.2)
            filltext(i, pos.x, pos.y);
            stroke();
            close();
        }
    })
    save(() => { // 指針
        lineCap('round');
        rotate(-90);
        const time = +new Date() + TaipaiTime;
        save(() => { // 時針
            begin();
            stroke('#f0a060C0');
            rotate(time / 3600000 % 24 * 30);
            lineW(size * 0.04);
            moveTo(0, 0);
            lineTo(size * 0.5, 0);
            stroke();
        })
        save(() => { // 分針
            begin();
            stroke('#005Fb5C0');
            rotate(time / 60000 % 60 * 6);
            lineW(size * 0.03);
            moveTo(0, 0);
            lineTo(size * 0.7, 0);
            stroke();
        })
        save(() => { // 秒針
            begin();
            rotate(time / 1000 % 60 * 6);
            stroke('#008000C0');
            lineW(size * 0.02);
            moveTo(0, 0);
            lineTo(size * 0.89, 0);
            stroke();
        })
    })
    // 中心點
    save(() => {
        lineW(size * 0.008);

        begin();
        fill('#777777');
        arc(0, 0, size * 0.05);
        fill();
        arc(0, 0, size * 0.05); // border
        stroke();
        close();

        begin();
        fill('#131313');
        arc(0, 0, size * 0.025);
        fill();
        close();
    })
    ++times;
    requestAnimationFrame(draw);
}
function update() {

}
function init() {

}
let size;
let times = 0; // 計數器;
const TaipaiTime = 8 * 60 * 60 * 1000;
const border = 360; // 切分幾個角度
const FPS = 30;
window.onload = () => {
    init();
    requestAnimationFrame(draw);
    setInterval(update, 1000 / FPS);
}
let ww, wh;
function WC() {
    ww = window.innerWidth;
    wh = window.innerHeight;
    canvas.width = ww;
    canvas.height = wh;
    translate(ww / 2, wh / 2);
    size = Math.min(ww, wh) * 0.3;
} WC();
window.onresize = WC;