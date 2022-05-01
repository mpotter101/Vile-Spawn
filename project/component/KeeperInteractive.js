/*

    A game object that expects to be interacted with by a Keeper Player

*/

import Keeper from './KEEPER'

export default class KeeperInteractive extends Keeper {
    // This is expected to be overridden, but demonstrates an example of interacting
    interact (otherInteraction, data) {
        if (this.shape) {
            // randomize the material color each time this is interacted with
            let color = new THREE.Color( 0xffffff );
            color.setHex( Math.random() * 0xffffff )
            this.shape.material.color = color;
        }

        return { colorChanged: true }
    }
}
