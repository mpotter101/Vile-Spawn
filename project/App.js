// Base Components
import Tabber from './component/Tabber';
import Group from './component/Group';

// App Components
import AnimationForm from './AnimationForm';
import AboutForm from './AboutForm';

export default class App {
    constructor ({ stageQuerySelector, animations, canvasHeight, canvasWidth, keywords }) {
        this.groups = {
            about: new Group ({
                class: 'ui segment group about-form',
                parent: $(stageQuerySelector),
                label: {
                    content: 'About Your Character'
                }
            }),
            animation: new Group ({
                parent: $(stageQuerySelector),
                label: {
                    content: 'Animations'
                }
            }),
        }

        this.aboutForm = new AboutForm ({
            parent: $(document.body),
            keywords: keywords
        })

        this.groups.about.addContent (this.aboutForm.node);

        this.animations = animations;
        this.animationNames = [];

        for (var key in this.animations) {
            this.animationNames.push (key);
        }

        this.tabber = new Tabber ({
            parent: $(document.body),
            tabs: this.animationNames
        });

        this.groups.animation.addContent (this.tabber.node);

        this.animationForms = {}

        for (var key in this.animations) {
            var item = this.animations [key];
            this.animationForms [key] = new AnimationForm (
                {
                    parent: $(document.body),
                    frameCount: 5,
                    frameDuration: 100,
                    canvasHeight, canvasWidth,
                    scrollDir: item.scrollDir,
                }
            );
            this.tabber.addContent (
                this.tabber.getTabIndexByName (key),
                this.animationForms [key].node
            );
        }
    }

    CollectStateData () {
        var data = {};
        data.about = this.aboutForm.GetState ();
        data.animation = {};

        this.animationNames.forEach ((name) => {
            data.animation [name] = this.animationForms [name].GetState ();
        })

        return data;
    }
}
