/*

    Manages a simple status box for the player

*/

import Html from './HTML'

export default class KeeperPlayerStatus extends Html {
    constructor (config) {
        super (config);

        config = this.setConfigDefaults ({
            class: 'dngn player-status'
        })

        this.assignConfig (config);
        this.renderToParent ();

    }

    setStatus (status) {
        this.node.html (status);
    }

    render (parent) {
        this.template = `
        <div>
            <p>You feel <span class="wibble">cool</span>
        </div>`

        this._render (parent)
    }
}
