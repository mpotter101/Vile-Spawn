/*

    Manages a three.js renderer

*/

import Three from './THREE'

export default class ThreeRenderer extends Three {
    constructor (config) {
        super (config);

        config = this.setConfigDefaults ({
            height: 480,
            width: 860,
        })

        this.assignConfig (config);

        this.renderer = new this.THREE.WebGLRenderer ();
        this.renderer.setSize (this.width, this.height);
        this.node = $ (this.renderer.domElement);
    }

    render (scene, camera) {
        this.renderer.render (scene, camera);
    }
}
