'use strict';
class Square {
    constructor(args) {
        let def = {
            color: null,
            isDraw: false,
            isFind: false,
            isEnd: false,
            wall: {
                right: true, down: true,
                up: true, left: true
            },
            stroke: {
                color: '#303030',
                width: block.size.x * 0.05
            },
            drawed: {
                color: '#505050'
            },
            found: {
                lineW: 10,
                form: undefined,
                to: null
            }
        }
        Object.assign(def, args);
        Object.assign(this, def);
    }
    draw() {
        this.isDraw = true;
        save(() => {
            translate(Vector.mul(this.pos, block.size));
            if (this.color === null) this.color = map.background_color();
            fill(this.color);
            fill(0, 0, block.size.x, block.size.y);
            this.border();
        })
    }
    get getWall() {
        return '' + (this.wall['up'] & 1) + (this.wall['down'] & 1) + (this.wall['left'] & 1) + (this.wall['right'] & 1);
    }
    fixed() {
        save(() => {
            const offset = Vector.mul(block.size, 0.5);
            translate(offset);
            fill(this.stroke.color);
            let rotates = [0, 90, 180, 270];
            rotates.forEach(ang => {
                save(() => {
                    const Correct = ang % 180 === 90 ? Vector.swap(offset) : offset;
                    rotate(ang);
                    begin();
                    moveTo(Correct);
                    arc(Correct.x, Correct.y, this.stroke.width, ATP(900), ATP(-90));
                    fill();
                })
            })
        })
    }
    border(trans = false) {
        save(() => {
            lineW(this.stroke.width);
            if (trans) translate(Vector.mul(this.pos, block.size));
            const rotates = {
                up: 0, right: 90,
                down: 180, left: 270,
            };
            Object.entries(this.wall).filter(([key, val]) => val).map(e => e[0]).forEach(e => {
                let deg = rotates[e];
                let offset = {
                    x: block.size.x / 2,
                    y: block.size.y / 2,
                }, line = {
                    x: offset.x,
                    y: offset.y - this.stroke.width / 2
                }
                if (deg % 180 === 90) {
                    line = {
                        y: offset.x - this.stroke.width / 2,
                        x: offset.y
                    }
                }
                save(() => {
                    translate(offset.x, offset.y);
                    begin();
                    stroke(this.stroke.color);
                    rotate(deg)

                    moveTo(-line.x, -line.y);
                    lineTo(line.x, -line.y);
                    stroke();
                    close();
                })
            })
        });
        this.fixed();
    }
    cango() {
        const Path = Object.entries(this.wall).filter(([wall, val]) => !val).map(([dir, bool]) => Vector.transform(dir));
        return Path.filter(v => !map.get(Vector.add(map.head, v)).isFind);
    }
    find() {
        const Path = this.cango();
        this.isFind = true;
        if (map.isEnd) {
            let cross = map.cross[map.cross.length - 1];
            let last = map.history.pop();
            map.get(last).clear();
            if (Vector.equal(cross, last)) {
                map.isEnd = false;
                map.head = map.cross.pop();
            }
            return;
        } else if (Path.length === 0) {
            map.history.push(this.pos);
            map.isEnd = true;
            this.find();
            return;
        } else if (Path.length >= 2) {
            map.cross.push(this.pos);
        }
        const Select = Path[0];
        this.found.to = Vector.add(Select, map.head);
        const Get = map.get(this.found.to);
        Get.found.form = map.head;
        const offset = Vector.mul(block.size, .5);
        save(() => {
            const From = this.absolute(this.found.form);
            const Now = this.absolute();
            const Next = Get.absolute();
            stroke('aqua');
            lineW(block.size.x * .1);
            begin();
            lineJoin('round')
            moveTo(From);
            lineTo(Now);
            lineTo(Next);
            stroke();
            close();
        })
        map.history.push(this.pos);
        map.head = Vector.add(map.head, Select);
    }
    absolute(pos = this.pos) {
        return Vector.add(Vector.mul(pos, block.size), Vector.mul(block.size, .5));
    }
    breakWall(dir) {
        this.wall[dir] = false;
    }
    clear() {
        save(() => {
            translate(Vector.mul(this.pos, block.size));
            fill(this.drawed.color);
            fill(0, 0, block.size.x, block.size.y);
            this.border();
        })
    }
}
class Map {
    constructor(args) {
        let def = {
            minSize: 30,
            head: Vector.set(),
            move: [
                Vector.set(0, -1), Vector.set(0, 1), // up down
                Vector.set(1, 0), Vector.set(-1, 0) // right left
            ],
            isFinding: false,
            cross: [], // 轉角紀錄
            history: [], // 移動紀錄
            isEnd: false, // 是否碰到牆壁需回頭,
            color: [rand(0, 255), rand(0, 255), rand(0, 255)],
            colorfixed: [rand(0, 1) ? 1 : -1, rand(0, 1) ? 1 : -1, rand(0, 1) ? 1 : -1],
        }
        Object.assign(def, args);
        Object.assign(this, def);
        this.init();
    }
    get(v = this.head) {
        return this.data[v.y] && this.data[v.y][v.x]
    }
    init() {
        if (ww <= wh) {
            let x = Math.floor(ww / this.minSize);
            block.count = Vector.set(this.minSize, Math.round(wh / x));
            block.size = Vector.set(x, Math.floor(wh / block.count.y));
        } else {
            let y = Math.floor(wh / this.minSize);
            block.count = Vector.set(Math.round(ww / y), this.minSize);
            block.size = Vector.set(Math.floor(ww / block.count.x), y);
        }
        this.data = Array(block.count.y).fill(Array(block.count.x).fill()).map((y, yi) => y.map((x, xi) => {
            return new Square({
                pos: Vector.set(xi, yi),
            });
        }));
    }
    find() {
        if (this.head.x === block.count.x - 1 && this.head.y === block.count.y - 1) {
            fill('#10101005');
            fill(0, 0, ww, wh);
            return;
        } else { // find line
            this.get().find();
            if (this.head.x === block.count.x - 1 && this.head.y === block.count.y - 1) {
                save(() => {
                    translate(Vector.add(Vector.mul(block.size, 0.5), Vector.mul(block.size, Vector.add(block.count, -1))));
                    fill('aqua');
                    begin();
                    arc(0, 0, block.size.x / 4);
                    fill();
                })
                setTimeout(init, 2000);
            }
        }
    }
    update() {
        if (this.isFinding) {
            this.find();
            return;
        }
        let path = this.cango();
        if (this.isEnd) {
            const last = {
                history: this.history[this.history.length - 1],
                cross: this.cross[this.cross.length - 1]
            };
            if (last.history == last.cross) {
                this.isEnd = false;
            } else {
                this.get(last.history).clear();
                this.history.pop();
            }
            return;
        } else if (path.length === 0) {
            if (this.cross.length === 0) { // End
                save(() => {
                    translate(Vector.mul(block.size, 0.5));
                    fill('aqua');
                    begin();
                    arc(0, 0, block.size.x / 4);
                    fill();
                })
                this.isFinding = true;
                return false;
            }
            this.history.push(this.head);
            this.get().draw();
            while (path.length === 0 && this.cross.length) {
                this.head = this.cross.pop();
                path = this.cango();
            }
            this.color = this.get().color.replace(/[a-z()]/g, '').split(',').map(x => +x);
            this.isEnd = true;
            return;
        } else if (path.length >= 2) {
            this.cross.push(this.head);
        }
        let select = path[rand(0, path.length - 1)];
        this.get().breakWall(Vector.transform(select));
        this.get().draw();
        this.history.push(this.head);
        this.head = Vector.add(this.head, select);
        this.get().breakWall(Vector.reverse(Vector.transform(select)));
    }
    cango() {
        return this.move.filter(dir => this.get(Vector.add(dir, this.head))?.isDraw === false);
    }
    background_color() {
        this.colorfixed.forEach((change, i) => {
            this.color[i] += change;
            if (this.color[i] >= 255 && change >= 0) this.colorfixed[i] *= -1;
            else if (this.color[i] <= 0 && change <= 0) this.colorfixed[i] *= -1;
        })
        return `rgb(${this.color.join(',')})`;
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
const FPS = 1000 / 60;
for (let i = 1; i <= 1; ++i) {
    setInterval(update, FPS);
}
let step = 500;
addEventListener('keydown', key => {
    if (key.key === 'ArrowRight') {
        for (let i = 0; i < step; ++i) {
            update();
        }
    }
})