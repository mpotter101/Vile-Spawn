/*

    Manages a three.js camera

*/

import Three from './THREE'

export default class ThreeCamera extends Three {
    constructor (config) {
        super (config);

        config = this.setConfigDefaults ({
            fov: 75,
            aspectRatio: 860/480,
            nearPlane: 0.1,
            farPlane: 1000,
            cameraType: 'PerspectiveCamera'
        })

        this.assignConfig (config);

        this.camera = new this.THREE [this.cameraType] (
            this.fov,
            this.aspectRatio,
            this.nearPlane,
            this.farPlane
        )
    }

    setPosition (data) {
        let key, item;

        for (key in data) {
            item = data [key]
            this.camera.position [key] = item
        }
    }
}
