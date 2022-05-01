/*

    Manages state for an action trigger.
    When a 3D object passes into this object,
    fire off the onEnter

    If on the next frame the object is still there,
    fire off the onStay

    If the object leaves this object,
    fire off the onLeave

*/

import Keeper from './KEEPER';

export default class KeeperTrigger extends Keeper {
    constructor (config) {
        if (!('shape' in config)) {
            config.shape = {
                shape: 'ball',
                heightSegments: 8,
                widthSegments: 8,
                radius: 1,
                materialType: 'MeshBasicMaterial',
                debug: true,
                material: { color: 0x88097a, visible: false },
            }
        }

        super (config);

        config = this.setConfigDefaults ({
            onIntruder: () => { console.log ('Intruder detected') },
            radius: 1,
        })

        this.assignConfig (config);
    }

    checkTrigger () {
        // Get the master list of objects
            // !!! Assumes the parent is the view
        let list = this.parent.masterObjectList;
        let distance = 0;
        let intruders = [];

        // Iterate over objects and see if anything is close enough
        list.forEach ((item) => {
            if (item != this.mesh) {
                distance = this.mesh.position.distanceTo ( item.position );


                if (distance < this.radius && item.keeper) {
                    intruders.push (item.keeper)
                }
            }
        })

        if (intruders.length) { this.handleIntruders (intruders); }
    }

    handleIntruders (intruders) {
        intruders.forEach ((item) => {
            this.onIntruder ({
                target: this,
                intruder: item
            })
        })
    }

    update () {
        this.checkTrigger ();
    }
}
