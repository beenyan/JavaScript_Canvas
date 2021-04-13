String.prototype.replaceAt = function (index, replacement) {
    if (index >= this.length) return this.valueOf();
    return this.substring(0, index) + replacement + this.substring(index + 1);
}
class Square {
    constructor(args) {
        let def = {
            color: 'aqua',
            stroke: {
                color: 'blue',
                width: block.size.x / 15
            },
            wall: {
                up: true, right: true,
                down: true, left: true
            },
            clear: {
                color: '#303030',
            },
            isDraw: false
        }
        Object.assign(def, args);
        Object.assign(this, def);
    }
    get rotate() {
        return {
            up: 0, right: 90,
            down: 180, left: 270
        };
    }
    breakWall(dir) {
        this.wall[dir] = false;
    }
    light() {
        const offset = {
            x: block.size.x / 2,
            y: block.size.y / 2
        };
        fill('green');
        fill(offset.x / 2, offset.y / 2, offset.x, offset.y);
    }
    border() {
        const offset = {
            x: block.size.x / 2,
            y: block.size.y / 2
        };
        lineW(this.stroke.width);
        Object.entries(this.wall).filter(([key, val]) => val).map(e => e[0]).forEach(dir => {
            save(() => {
                translate(offset.x, offset.y);
                stroke(this.stroke.color);
                rotate(this.rotate[dir]);
                begin();
                moveTo(-offset.x, -offset.y);
                lineTo(offset.x, -offset.y);
                stroke();
                close();
            })
        });
    }
    draw(light = 0) {
        save(() => {
            translate(Vector.mul(this.pos, block.size));
            this.isDraw = true;
            fill(this.color);
            fill(0, 0, block.size.x, block.size.y);
            this.border();
            this.text();
            if (light) this.light();
        })
    }
    text() {
        textAlign('center');
        textBaseline('middle');
        fill('red');
        font(`${block.size.x * 0.3}px arial`)
        filltext(`(${this.pos.x},${this.pos.y})`, block.size.x / 2, block.size.y / 2);
    }
    erase() {
        save(() => {
            translate(Vector.mul(this.pos, block.size));
            fill(this.clear.color);
            fill(0, 0, block.size.x, block.size.y);
            this.border();
        })
    }
}
class Vector {
    static add(v1, v2 = v1, v3 = { x: 0, y: 0 }) {
        return {
            x: v1.x + v2.x + v3.x,
            y: v1.y + v2.y + v3.y
        }
    }
    static set(x, y = x) {
        return { x, y };
    }
    static mul(v1, v2 = v1) {
        return {
            x: v1.x * v2.x,
            y: v1.y * v2.y
        }
    }
    static transform(v) {
        if (v.x > 0) return 'right';
        else if (v.x < 0) return 'left';
        else if (v.y > 0) return 'down';
        else if (v.y < 0) return 'up';
        else return null;
    }
    static reverse(dir) {
        if (dir === 'right') return 'left';
        else if (dir === 'left') return 'right';
        else if (dir === 'down') return 'up';
        else if (dir === 'up') return 'down';
        else return null;
    }
}
class Map {
    constructor() {
        this.minSzie = 30;
        this.divideBlocks();
        this.head = Vector.set(0);
        this.move = [
            Vector.set(0, -1), Vector.set(0, 1), // up down
            Vector.set(1, 0), Vector.set(-1, 0) // right left
        ];
        this.stack = [];
        this.road = [this.head];
    }
    get(v) {
        return this.data[v.y] && this.data[v.y][v.x];
    }
    set(v, val) {
        this.data[v.y][v.x] = val;
    }
    draw(light = 0) {
        if (light) this.get(this.head).light();
        else this.get(this.head).draw();
    }
    update() {
        let path = this.cango(this.head);
        if (path.length === 0) {
            while (path.length === 0 && this.stack.length) {
                this.draw();
                this.head = this.stack.pop();
                path = this.cango(this.head);
            }
            while (this.road.indexOf(this.head) !== -1) {
                let temp = this.road.pop();
                this.get(temp).erase();
            }
            if (this.stack.length === 0) return;
            this.update();
            return;
        }
        else if (path.length >= 2) {
            this.stack.push(this.head);
        }
        let select = path[rand(0, path.length - 1)];
        this.get(this.head).breakWall(Vector.transform(select));
        this.draw();
        this.head = Vector.add(this.head, select);
        this.get(this.head).breakWall(Vector.reverse(Vector.transform(select)));
        this.road.push(this.head);
    }
    divideBlocks() {
        if (ww <= wh) {
            let x = ww / this.minSzie;
            block.count = Vector.set(this.minSzie, Math.round(wh / x));
            block.size = Vector.set(x, wh / block.count.y);
        } else {
            let y = wh / this.minSzie;
            block.count = Vector.set(Math.round(ww / y), this.minSzie);
            block.size = Vector.set(ww / block.count.x, y);
        }
        this.data = Array(block.count.y).fill(Array(block.count.x).fill()).map((y, yi) => y.map((x, xi) => new Square({ pos: Vector.set(xi, yi) })));
    }
    cango(v) { // vector
        let ret = this.move.filter(e => this.get(Vector.add(e, v))?.isDraw === false);
        return ret;
    }
}
function update() {
    map.update();
}
function init() {
    fill('#181818');
    fill(0, 0, ww, wh);
    map = new Map();
}
let ww, wh;
let map;
let block = {};
function WC() {
    ww = window.innerWidth;
    wh = window.innerHeight;
    canvas.width = ww;
    canvas.height = wh;
    init();
} WC();
window.onresize = WC;
const FPS = 1000 / 30;
setInterval(update, FPS);