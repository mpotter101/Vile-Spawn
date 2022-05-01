import Html from './Component/HTML';
import LabeledInput from './Component/LabeledInput';

export default class AboutForm extends Html {
    constructor (data) {
        super (data);

        this.state = {};
        this.state.name;
        this.state.race;

        this.name = new LabeledInput ({
            parent: this.node,
            label: { content: 'Name' },
        })

        this.raceName = new LabeledInput ({
            parent: this.node,
            label: { content: 'Race' },
            prop: { placeholder: '"Goblin", "Mimic" and the like' }
        })
    }

    GetName () { return this.name.getValue (); }

    GetState () {
        this.state.name = this.GetName ();
        return this.state;
    }
}
