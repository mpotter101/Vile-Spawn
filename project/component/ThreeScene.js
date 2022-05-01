/*

    Manages a ThreeJS Scene

*/

import Three from './THREE';

export default class ThreeScene extends Three {
    constructor (config) {
        super (config);
        this.assignConfig (config);

        this.scene = new this.THREE.Scene ();
    }

    add (three) {
        this.scene.add (three);
    }
}
