function draw() {
    const size = Math.min(ww, wh) * 0.3;
    const Angle = 360 / border;
    const upandown = size * 0.02; // 起伏差距
    const count = 20; // 起伏個數
    const speed = 8; // 旋轉速度
    // console.time('time');
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
        stroke('#00adb5');
        stroke();
    })
    save(() => { // 時刻
        const Angle = 360 / 180;
        rotate(-90);
        for (let i = 1; i <= 180; ++i) {
            stroke(i % 5 ? '#c41c1cC0' : '#c41c1cD0');
            const distance = size + upandown * Math.sin(ATP(Angle * i * count + times * speed));
            begin();
            lineW(size * (i % 5 ? 0.002 : 0.008));
            rotate(Angle);
            moveTo(distance - size * 0.01, 0);
            lineTo(distance - (i % 5 ? distance / 13 : distance / 9), 0);
            close();
            stroke();
        }
    })
    save(() => {
        lineCap('round');
        rotate(-90);
        const time = +new Date() + TaipaiTime;
        save(() => { // 時針
            begin();
            stroke('#f0a060');
            rotate(time / 3600000 % 24 * 30);
            lineW(size * 0.03);
            moveTo(0, 0);
            lineTo(size * 0.5, 0);
            stroke();
        })
        save(() => { // 分針
            begin();
            stroke('#005Fb5');
            rotate(time / 60000 % 60 * 6);
            lineW(size * 0.02);
            moveTo(0, 0);
            lineTo(size * 0.7, 0);
            stroke();
        })
        save(() => { // 秒針
            begin();
            rotate(time / 1000 % 60 * 6);
            stroke('green');
            lineW(size * 0.01);
            moveTo(0, 0);
            lineTo(size * 0.89, 0);
            stroke();
        })
    })
    // 中心點
    save(() => {
        lineW(size * 0.008);
        begin();
        fill('gray');
        arc(0, 0, size * 0.05);
        fill();
        arc(0, 0, size * 0.05); // border
        stroke();
        close();

        begin();
        fill('black');
        arc(0, 0, size * 0.025);
        fill();
        close();
    })
    ++times;
    // console.timeEnd('time');
    requestAnimationFrame(draw);
}
function update() {

}
function init() {

}
let times = 0; // 計數器;
const TaipaiTime = 8 * 60 * 60 * 1000;
const border = 360; // 切分幾個角度
const FPS = 30;
window.onload = () => {
    init();
    requestAnimationFrame(draw);
    setInterval(update, 1000 / FPS);
}
