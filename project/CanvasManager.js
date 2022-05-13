import Html from './component/Html';
import Canvas from './component/Canvas';

export default class CanvasManager extends Html {
    constructor ({ parent, height, width, imgSize, scrollDir = '' }) {
        super ({parent});
        this.const = { HEIGHT: height, WIDTH: width };
        this.const.HALF_HEIGHT = height / 2;
        this.const.HALF_WIDTH = width / 2;
        this.const.IMG_SIZE = imgSize;
        this.const.HALF_IMG_SIZE = imgSize / 2;
        this.const.FRAME_RATE = 1000 / 30;

        this.canvas = new Canvas ({
            parent: this.node,
            prop: { width, height }
        });

        this.ctx = this.canvas.GetContext();

        this.state = {};
        this.state.frames = [];
        this.state.currentFrame = 0;

        this.bgImg = $('<img src="./assets/Tiling Grass.png" />');
        this.bgImg.on ('load', () => { this.ready = true; this.RedrawLoop() });
        this.bgImgPos = { x: 0, y: 0 }
        this.bgImgSpeed = 4;
        this.scrolling = true;
        this.scrollDir = scrollDir;
    }

    SetImage ({ index, img, duration }) {
        this.state.currentFrame = index;
        this.state.frames [index] = {img, duration};
        this.RedrawScene ();
    }

    RedrawLoop () {
        if (this.scrolling) {
            this.ScrollBg ();
            this.RedrawScene ();

            window.setTimeout (() => { this.RedrawLoop () }, this.const.FRAME_RATE);
        }
    }

    ScrollBg () {
        if (this.scrollDir.indexOf ('right') != -1) {
            this.bgImgPos.x -= this.bgImgSpeed;
        }

        if (this.scrollDir.indexOf ('left') != -1) {
            this.bgImgPos.x += this.bgImgSpeed;
        }

        if (this.scrollDir.indexOf ('down') != -1) {
            this.bgImgPos.y += this.bgImgSpeed;
        }

        if (this.scrollDir.indexOf ('up') != -1) {
            this.bgImgPos.y -= this.bgImgSpeed;
        }

        if (this.bgImgPos.x <= -this.const.WIDTH || this.bgImgPos.x >= this.const.WIDTH) {
            this.bgImgPos.x = 0;
        }

        if (this.bgImgPos.y <= -this.const.HEIGHT || this.bgImgPos.y >= this.const.HEIGHT) {
            this.bgImgPos.y = 0;
        }
    }

    RedrawScene () {
        if (!this.ready) { return; }
        this.ctx.clearRect(0, 0, this.const.WIDTH, this.const.HEIGHT);

        this.DrawBgGrid ();

        if (this.state.frames [this.state.currentFrame]) {
            this.ctx.drawImage (
                this.state.frames [this.state.currentFrame].img,
                this.const.HALF_WIDTH - this.const.HALF_IMG_SIZE,
                this.const.HALF_HEIGHT - this.const.HALF_IMG_SIZE,
                this.const.IMG_SIZE, this.const.IMG_SIZE);
        }
    }

    DrawBgGrid () {
        // center img
        this.ctx.drawImage (
            this.bgImg [0],
            this.bgImgPos.x, this.bgImgPos.y
        )

        // center right img
        this.ctx.drawImage (
            this.bgImg [0],
            this.bgImgPos.x + this.const.WIDTH, this.bgImgPos.y
        )

        // center top img
        this.ctx.drawImage (
            this.bgImg [0],
            this.bgImgPos.x, this.bgImgPos.y - this.const.HEIGHT
        )

        // top right img
        this.ctx.drawImage (
            this.bgImg [0],
            this.bgImgPos.x + this.const.WIDTH, this.bgImgPos.y - this.const.HEIGHT
        )

        // center left
        this.ctx.drawImage (
            this.bgImg [0],
            this.bgImgPos.x - this.const.WIDTH, this.bgImgPos.y
        )

        // center bottom img
        this.ctx.drawImage (
            this.bgImg [0],
            this.bgImgPos.x, this.bgImgPos.y + this.const.HEIGHT
        )

        // bottom left img
        this.ctx.drawImage (
            this.bgImg [0],
            this.bgImgPos.x - this.const.WIDTH, this.bgImgPos.y + this.const.HEIGHT
        )

        // top left img
        this.ctx.drawImage (
            this.bgImg [0],
            this.bgImgPos.x - this.const.WIDTH, this.bgImgPos.y - this.const.HEIGHT
        )

        // bottom right img
        this.ctx.drawImage (
            this.bgImg [0],
            this.bgImgPos.x + this.const.WIDTH, this.bgImgPos.y + this.const.HEIGHT
        )
    }

    GetFrameDuration (index) {
        var dur = 0;
        var frame = this.state.frames [index];

        if (frame) { dur = frame.duration; }

        return dur;
    }
}
