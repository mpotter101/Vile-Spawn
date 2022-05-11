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

        this.animationNames = animations;

        this.tabber = new Tabber ({
            parent: $(document.body),
            tabs: this.animationNames
        });

        this.groups.animation.addContent (this.tabber.node);

        this.animationForms = {}

        this.animationNames.forEach ((name, index) => {
            this.animationForms [name] = new AnimationForm (
                {
                    parent: $(document.body),
                    frameCount: 5,
                    frameDuration: 100,
                    canvasHeight, canvasWidth
                }
            );
            this.tabber.addContent (
                this.tabber.getTabIndexByName (name),
                this.animationForms [name].node
            );
        });
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
