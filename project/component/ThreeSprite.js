/*

    Manages a threejs sprite object

*/

import Three from './THREE';

export default class ThreeSprite extends Three {
    constructor (config) {
        super (config);

        config = this.setConfigDefaults ({
            image: '',
            color: 0xffffff,
            width: 1,
            height: 1,
        })

        this.assignConfig (config);

        this.image = new this.THREE.TextureLoader ().load (this.image);
        this.material = new this.THREE.SpriteMaterial ( { map: this.image, color: this.color } );
        this.mesh = new this.THREE.Sprite (this.material);

        this.syncMesh ();
    }
}
