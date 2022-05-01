// Base Components
import Tabber from './component/Tabber';
import Group from './component/Group';

// App Components
import AnimationForm from './AnimationForm';
import AboutForm from './AboutForm';

export default class App {
    constructor ({ stageQuerySelector }) {
        this.groups = {
            about: new Group ({
                class: 'ui segment group about-form',
                parent: $(stageQuerySelector),
                label: {
                    content: 'About'
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
            parent: $(document.body)
        })

        this.groups.about.addContent (this.aboutForm.node);

        this.animationNames = [ 'Idle', 'Walk', 'Walk-Back' ];

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
                    frameDuration: 100
                }
            );
            this.tabber.addContent (
                this.tabber.getTabIndexByName (name),
                this.animationForms [name].node
            );
        });
    }
}
