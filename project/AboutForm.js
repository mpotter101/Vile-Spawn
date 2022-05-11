import Html from './Component/HTML';
import LabeledInput from './Component/LabeledInput';
import Group from './Component/Group';

export default class AboutForm extends Html {
    constructor (data) {
        super (data);

        this.state = {};
        this.state.name;
        this.state.keywords = {};

        this.inputs = {};

        this.name = new LabeledInput ({
            parent: this.node,
            label: { content: 'Name' },
            input: { class: 'ui input name' }
        })

        this.name.setValue ('');

        this.keywordsGroup = new Group ({
            parent: this.node,
            label: { content: 'Keywords' }
        })

        var keywords = data.keywords.sort ();

        keywords.forEach ((name) => {
            var newInput = this.CreateKeywordCheckbox ({ name });
            this.inputs [name] = newInput
            this.keywordsGroup.addContent (newInput.node);
        })
    }

    CreateKeywordCheckbox ({ name }) {
        this.state.keywords [name] = false;

        return new LabeledInput ({
            parent: this.node,
            name,
            label: { content: name },
            input: { prop: { type: 'checkbox' } },
            onInput: (data) => {
                this.HandleCheckbox ({
                    name: data.target.name,
                    value: data.target.getIsCheckedAsBoolean ()
                });
            }
        })
    }

    HandleCheckbox (data) {
        this.state.keywords [data.name] = data.value;
    }

    GetName () { return this.name.getValue (); }

    GetState () {
        this.state.name = this.GetName ();

        if (this.state.name == 0) { this.state.name = ''; }

        return this.state;
    }
}
