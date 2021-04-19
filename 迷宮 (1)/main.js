class Square {
    constructor(args) {
        let def = {
            color: 'aqua',
            isDraw: false,
            wall: {
                up: true, down: true,
                left: true, right: true
            },
            stroke: {
                color: '#303030',
                width: block.size.x * 0.05
            },
            drawed: {
                color: '#505050'
            }
        }
        Object.assign(def, args);
        Object.assign(this, def);
    }
    draw() {
        this.isDraw = true;
        save(() => {
            translate(Vector.mul(this.pos, block.size));
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
    update() {
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
                return false;
            }
            this.history.push(this.head);
            this.background_color_change();
            this.get().draw();
            while (path.length === 0 && this.cross.length) {
                this.head = this.cross.pop();
                path = this.cango();
            }
            this.color = this.get().color.replace(/[a-z()]/g, '').split(',').map(x => +x);
            this.background_color_change();
            this.isEnd = true;
            return;
        } else if (path.length >= 2) {
            this.cross.push(this.head);
        }
        this.background_color_change();
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
    background_color_change() {
        this.colorfixed.forEach((change, i) => {
            this.color[i] += change;
            if (this.color[i] >= 255 && change >= 0) this.colorfixed[i] *= -1;
            else if (this.color[i] <= 0 && change <= 0) this.colorfixed[i] *= -1;
        })
        this.get().color = `rgb(${map.color.join(',')})`;
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
setInterval(update, FPS);