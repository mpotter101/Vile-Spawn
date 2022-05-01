/*

    Manages a light from the Three.js library

*/

import Three from './THREE'

export default class ThreeLight extends Three {
    constructor (config) {
        super (config);

        config = this.setConfigDefaults ({
            type: 'ambient',
            color: 0xd6f5ff,
            intensity: 0.3,
        })

        this.assignConfig (config);

        switch (this.type) {
            case 'ambient':
            case 'global':
                this.bulb = new this.THREE [ 'AmbientLight' ] (this.color, this.intensity);
                break;
            case 'point':
                this.bulb = new this.THREE [ 'PointLight' ] (this.color, this.intensity, this.distance, this.decay);
                break;
            default:
                console.warn (this.type, 'is not a support light type');
        }

        this.mesh = this.bulb;
        this.syncMesh ();
    }
}
