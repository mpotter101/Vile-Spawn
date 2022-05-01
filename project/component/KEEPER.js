/*

    Creates the bare minimum stuff to be added to the game
    Exposes some of the three.js functions for ease of access

    Will default to creating a shadeless sphere if no graphical parameters are given

*/

import Three from './THREE';

import ThreeSprite from './ThreeSprite';
import ThreeShape from './ThreeShape';
import ThreeModel from './ThreeModel';

export default class Keeper extends Three {
    constructor (config) {
        super (config);

        // Only add a shape if no other rendering type is provided
        if (!('sprite' in config) && !('shape' in config) && !('model' in config)) {
            config.shape = {
                radius: 1,
                shape: 'ball',
                widthSegments: 8,
                heightSegments: 8,
                materialType: 'MeshBasicMaterial'
            }
        }

        // Assign config properties
        this.assignConfig (config);

        // Create an Group to child everything to
        this.mesh = new this.THREE.Group ();
        this.mesh.keeper = this;

        // Create Three.js objects as requested by config
        if (this.shape) { this._createPart ('shape', this.shape) }
        if (this.sprite) { this._createPart ('sprite', this.sprite) }
        if (this.model) { this._createPart ('model', this.model) }

        // Add the group to our scene
        this.parent.add (this.mesh)

        // Update mesh with config properties
        this.syncMesh ();
    }

    // Helper funciton for keeping constructor clean
    _createPart (type, config) {

        this [type].parent = this.mesh;
        this [ '_' +  type] = this [type];

        switch (type) {
            case 'shape':
                this [type] = new ThreeShape (this._shape);
                break
            case 'sprite':
                this [type] = new ThreeSprite (this._sprite);
                break
            case 'model':
                this [type] = new ThreeModel (this._model);
                break
        }

        // Store a way to reference back to this object in the mesh
        this [type].mesh.keeper = this;

        // Add parts as children as they are created
        this.mesh.add (this [type].mesh);
    }

    remove (mesh) {
        // Our threeView object contains the real remove function
        // This function allows a child object to climb the chain
        // and ultimately be removed from the renderer
        this.parent.remove (mesh)
    }

    _destroy () {
        // Stop rendering
        this.parent.remove (this.mesh)

        // Delete properties to free up space
        let key;
        for (key in this) {
            delete this [key]
        }
    }

    //Abstract funciton to be overridden by extended objects
    update () {}
}
