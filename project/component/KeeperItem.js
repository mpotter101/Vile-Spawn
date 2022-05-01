/*

    manages the exisitence of an item that a player can pick up

*/

import KeeperInteractive from './KeeperInteractive'

export default class KeeperItem extends KeeperInteractive {
    constructor (config) {
        super (config);

        config = this.setConfigDefaults ({
            spinAndFloat: true,
            float: {
                yVariance: 0.3,
                speed: 0.0025
            },
            spin: {
                speed: 0.005
            },
            direction: 'up',
            onInteract: () => {
                console.log ('You picked me up!')
                this._destroy ();
            }
        })

        this.assignConfig (config);

        this._travelledDistance = 0;
    }

    interact (interaction, data) {
        this.onInteract ({
            target: this,
            interaction: interaction,
            moreData: data
        });
    }

    update () {
        if (this.spinAndFloat) {
            if (this._travelledDistance < this.float.yVariance) {
                this._travelledDistance += this.float.speed;

                if (this.direction == 'up') { this.mesh.position.y += this.float.speed }
                else if (this.direction == 'down') { this.mesh.position.y -= this.float.speed }
            }
            else {
                if (this.direction == 'up') { this.direction = 'down' }
                else if (this.direction == 'down') { this.direction = 'up' }

                this._travelledDistance = -this.float.yVariance;
            }

            this.mesh.rotation.y += this.spin.speed;
        }
    }
}
