import Html from './component/HTML';

import Button from './component/Button';
import CanvasManager from './CanvasManager';
import Group from './component/Group';
import ImageInput from './component/ImageInput';
import InputSlider from './component/InputSlider';
import Label from './component/Label';
import LabeledInput from './component/LabeledInput';

export default class AnimationForm extends Html {
    constructor ({ parent, frameCount, frameDuration }) {
        super ({ parent });

        this.state = {};
        this.state.images = [];
        this.state.playing = false;

        this.const = {};
        this.const.FRAME_DURATION_LABEL = 'Duration(ms)';

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
                class: 'ui segment group frame-form',
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

        this.maxFrameCountInput = new LabeledInput ({
            parent: this.node,
            onInput: (data) => { this.HandleMaxFrameCountChange (data); },
            label: { content: 'Frame Count' }
        })

        this.maxFrameCountInput.setValue (frameCount);

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

        this.playPauseButton = new Button ({
            parent: this.node,
            label: 'Play',
            onClick: (e) => { this.HandlePlayPause (e); }
        })

        this.frameDurationInput = new LabeledInput ({
            parent: this.node,
            label: { content: 'Frame 1 Duration(ms)', class: 'ui label' },
            onInput: (data) => { this.HandleFrameDurationChange (data); }
        })

        this.frameDurationInput.setValue (frameDuration);

        this.groups.form.addContent (this.maxFrameCountInput.node);
        this.groups.form.addContent (this.frameSelector.node);
        this.groups.form.addContent (this.frameDurationInput.node);
        this.groups.form.addContent (this.uploadFrameButton.node);
        this.groups.form.addContent (this.playPauseButton.node);
    }

    HandleImage (data) {
        var frameIndex = this.GetCurrentFrame ();
        this.SetImageInFramesGroup ({index: frameIndex,  src: data.value.src});
        this.canvasManager.SetImage ({
            index: frameIndex,
            img: data.value,
            duration: this.frameDurationInput.getValue ()
        });
    }

    HandleMaxFrameCountChange (data) {
        var val = data.value;
        this.frameSelector.slider.setMaxValue (val);

        if (this.frameSelector.getValue () > val) {
            this.frameSelector.setValue (val);
        }
    }

    HandleFrameDurationChange (data) {
        if (this.CurrentFrameExists ()) {
            var curFrame = this.GetCurrentFrame ();
            this.canvasManager.state.frames [curFrame].duration = data.value;
        }
    }

    HandleCurrentFrameChange (data) {
        this.canvasManager.state.currentFrame = data.value;

        if (this.CurrentFrameExists ()) {
            var frameData = this.canvasManager.state.frames [data.value];
            this.frameDurationInput.setValue ( frameData.duration );
        }

        this.frameDurationInput.label.setContent ('Frame ' + data.value + ' ' + this.const.FRAME_DURATION_LABEL);

        this.canvasManager.RedrawScene ();
    }

    HandlePlayPause() {
        this.state.playing = !this.state.playing;

        if (this.state.playing) {
            this.playPauseButton.node.html ('Pause');
            this.PlayFrame (this.canvasManager.GetFrameDuration (this.frameSelector.getValue ()))
        }
        else {
            this.playPauseButton.node.html ('Play');
        }
    }

    SetImageInFramesGroup ({index, src}) {
        var frameExists = this.CurrentFrameExists();
        if (!frameExists) {
            var newImg = $('<img />');
            this.state.images [index] = newImg
            this.groups.frames.addContent (newImg)
        }

        this.state.images [index] [0].src = src;

        // Redraw the images so they appear in order
        this.state.images.forEach ((img) => {
            this.groups.frames.addContent (img);
        })
    }

    GetCurrentFrame () {
        return this.frameSelector.getValue ();
    }

    GetMaxFrameCount () {
        return this.maxFrameCountInput.getValue ();
    }

    CurrentFrameExists () {
        var curFrame = this.GetCurrentFrame ();
        var curFrameData = this.canvasManager.state.frames [curFrame];

        if (!curFrameData) { return false; }

        return true;
    }

    PlayFrame (duration) {
        if (this.state.playing) {
            var nextFrame = this.GetCurrentFrame () + 1;
            if (nextFrame > this.GetMaxFrameCount ()) {
                nextFrame = 1;
            }

            this.frameSelector.setValue (nextFrame);
            this.HandleCurrentFrameChange ({ value: nextFrame });

            window.setTimeout (() => {
                this.PlayFrame (this.canvasManager.GetFrameDuration (nextFrame));
            }, duration)
        }
    }
}
