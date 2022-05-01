/*

    Allows creation of simple shapes via the built-in primitives to ThreeJS

*/

import Three from './THREE'

export default class ThreeShape extends Three {
    constructor (config) {
        super (config);

        config = this.setConfigDefaults ({
            shape: 'cube',
            width: 1,
            height: 1,
            depth: 1,
            radius: 1,
            widthSegments: 1,
            heightSegments: 1,
            material: { color: 0x1c6285 },
            materialType: 'MeshBasicMaterial',
            debug: false,
        })

        this.assignConfig (config);

        switch (this.shape) {
            case 'cube':
            case 'box':
                this.geometry = new this.THREE.BoxGeometry ( this.width, this.height, this.depth );
                break
            case 'plane':
            case 'quad':
                if ( !('side' in this.material) ) { this.material.side = this.THREE.DoubleSide }
                this.geometry = new this.THREE.PlaneGeometry( this.width, this.height, this.widthSegments, this.heightSegments );
                break;
            case 'ball':
            case 'sphere':
                this.geometry = new this.THREE.SphereGeometry( this.radius, this.widthSegments, this.heightSegments );
                break;
            default:
                console.warn (this.shape, 'is not a supported shape type.');
        }

        this.material = new this.THREE [ this.materialType ] (this.material);
        this.mesh = new this.THREE.Mesh (this.geometry, this.material);

        if (this.debug) {
            // Debug defaults
            if (typeof this.debug != 'object') { this.debug = {} }
            if (!('color' in this.debug)) { this.debug.color = 0xffffff }
            if (!('lineWidth' in this.debug)) { this.debug.lineWidth = 2 }

            // Preserve debug config
            this._debug = this.debug;
            this.debug = {};

            // wireframe
            this.debug.geometry = new this.THREE.EdgesGeometry( this.geometry ); // or WireframeGeometry
            this.debug.material = new this.THREE.LineBasicMaterial( { color: this._debug.color, linewidth: this._debug.lineWidth } );
            this.debug.mesh = new this.THREE.LineSegments( this.debug.geometry, this.debug.material );
            this.mesh.add( this.debug.mesh );
        }

        this.syncMesh ()
    }
}

/*

    ToDo
    Add support for a ball

*/
