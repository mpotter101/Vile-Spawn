/*

    Talks to the player
    Should be expanded on later by specific types of NPCs

*/

import KeeperInteractive from './KeeperInteractive';
import Typed from 'typed.js';

export default class Npc extends KeeperInteractive {
    constructor (config) {
        super (config);

        config = this.setConfigDefaults ({
            dialogue: 'Hello, friend. Looks like the dev forgot to set my dialogue. Woops!',
            avatar: './asset/avatar.gif',
            talkSpeed: 40,
        })

        this.assignConfig (config);
    }

    interact (interaction, data) {
        if (!data) { data = {}; }
        if (!interaction) { interaction = {}; }
        if (interaction.typing) { interaction.typing.destroy (); }

        this.interacter = data.interacter;

        let avatar, chat, text;
        $ ('.chatbox').removeClass ('hide');

        avatar = $ ('.chatbox > .pic > img');
        chat = $ ('.chatbox > .chat > p');

        chat.html ('');
        avatar.prop ({ src: this.avatar });
        text = this.dialogue

        if (this.typing) { this.typing.destroy (); }
        if (typeof text !== 'array') { text = [text] }

        this.typing = new Typed (chat [0], {
            strings: text,
            typeSpeed: this.talkSpeed,
            onComplete: (self) => { if (this.typing) {this.typing = null}; }
        })

        return { typing: this.typing };
    }

    update () {
        if (this.interacter) {
            let distance = this.mesh.position.distanceTo ( this.interacter.mesh.position );

            // Whoever was talking with us walked too far. Stop talking to them cuz they reude.
            if (distance > 2) {
                $ ('.chatbox').addClass ('hide');
                this.interacter = null;

                if (this.typing) {
                    this.typing.destroy ();
                    this.typing = null;
                }
            }
        }
    }
}
