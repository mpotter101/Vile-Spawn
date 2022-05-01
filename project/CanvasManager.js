import Html from './component/Html';
import Canvas from './component/Canvas';

export default class CanvasManager extends Html {
    constructor ({ parent, height, width }) {
        super ({parent});
        this.const = { HEIGHT: height, WIDTH: width };

        this.canvas = new Canvas ({
            parent: this.node,
            prop: { width, height }
        });

        this.ctx = this.canvas.GetContext();

        this.state = {};
        this.state.frames = [];
        this.state.currentFrame = 0;
    }

    SetImage ({ index, img }) {
        console.log ('Canvas manager');
        console.log (index, img);
        this.state.currentFrame = index;
        this.state.frames [index] = img;

        console.log (this.state);

        this.RedrawScene ();
    }

    RedrawScene () {
        this.ctx.clearRect(0, 0, this.const.WIDTH, this.const.HEIGHT);

        if (this.state.frames [this.state.currentFrame]) {
            this.ctx.drawImage (this.state.frames [this.state.currentFrame], 0, 0);
        }
    }
}
