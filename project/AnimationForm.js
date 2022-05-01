import Html from './component/HTML';

import Button from './component/Button';
import CanvasManager from './CanvasManager';
import Group from './component/Group';
import ImageInput from './component/ImageInput';
import InputSlider from './component/InputSlider';
import Label from './component/Label';
import LabeledInput from './component/LabeledInput';

export default class AnimationForm extends Html {
    constructor ({ parent, frameCount }) {
        super ({ parent });

        this.state = {};
        this.state.allFramesUploaded = false;
        this.state.frames = [];

        this.groups = {
            canvas: new Group ({
                class: 'ui segment group canvas preview',
                parent: this.node,
                label: {
                    content: 'Preview'
                }
            }),
            form: new Group ({
                parent: this.node,
                label: {
                    content: 'Frames Upload'
                }
            }),
            frames: new Group ({
                parent: this.node,
                label: {
                    content: 'Frames'
                }
            }),
        }

        this.canvasManager = new CanvasManager ({
            parent: this.node,
            height: 256, width: 256
        })

        this.groups.canvas.addContent (this.canvasManager.node);

        this.frameSelector = new InputSlider ({
            parent: this.node,
            onSlider: (data) => { this.HandleCurrentFrameChange (data) },
            onInput: (data) => { this.HandleCurrentFrameChange (data) },
            label: {
                class: 'ui label',
                content: 'Frame Selection'
            },
            slider: {
                prop: {
                    min: 1,
                    max: frameCount,
                    value: 1
                }
            }
        });

        this.frameSelector.input.setValue (1);

        this.imageLoader = new ImageInput ({
            parent: this.node,
            onImage: (data) => { this.HandleImage (data); },
        });

        this.uploadFrameButton = new Button ({
            parent: this.node,
            label: 'Upload Frame',
            onClick: (e) => { this.imageLoader.node.click (); }
        })

        this.frameDurationInput = new LabeledInput ({
            parent: this.node,
            label: { content: 'Duration(ms)', class: 'ui label' }
        })

        this.frameDurationInput.setValue (100);

        this.groups.form.addContent (this.frameSelector.node);
        this.groups.form.addContent (this.frameDurationInput.node);
        this.groups.form.addContent (this.uploadFrameButton.node);
    }

    HandleImage (data) {
        var frameIndex = this.GetCurrentFrame ();
        this.SetImageInFramesGroup ({index: frameIndex,  src: data.value.src});
        this.canvasManager.SetImage ({index: frameIndex, img: data.value});
    }

    HandleCurrentFrameChange (data) {
        this.canvasManager.state.currentFrame = data.value;
        this.canvasManager.RedrawScene ();
    }

    SetImageInFramesGroup ({index, src}) {
        var frameExists = this.state.images [this.GetCurrentFrame ()] == undefined ? false : true;

        if (!frameExists) {
            var newImg = $('<img src="' + src + '" />');
            this.state.images [index] = newImg
            this.groups.frames.addContent (newImg)
        }
        else {
            this.state.images [index] [0].src = src
        }
    }

    GetCurrentFrame () {
        return this.frameSelector.getValue ();
    }
}
