/*

    Wraps around threejs libaray
    Acts as the base Object for 3D Objects

*/

import * as THREE from 'three'
import Html from './HTML'

export default class Three extends Html {
    constructor (config) {
        super (config);

        this.position = {};
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;

        this.rotation = {};
        this.rotation.x = 0;
        this.rotation.y = 0;
        this.rotation.z = 0;

        // Sync mesh prioritizes common word attributes
        // Since it looks more consistent with the rest of the component library
        this.height = 1;
        this.width = 1;
        this.depth = 1;

        this.THREE = THREE
    }

    // Override the HTML render functions
    _render () {}
    render () {}
    renderToParent () {}

    _ensureCertainProperties () {
        // Make sure we have certain properties
        if (!('position' in this)) { this.position = {} }
        if (!('x' in this.position)) { this.position.x = 0 }
        if (!('y' in this.position)) { this.position.y = 0 }
        if (!('z' in this.position)) { this.position.z = 0 }

        // Make sure all of our properties are numbers
        Object.keys (this.position).forEach ( (key) => { if (isNaN (this.position [key])) { this.position [key] = 0 } })

        if (!('rotation' in this)) { this.rotation = {} }
        if (!('x' in this.rotation)) { this.rotation.x = 0 }
        if (!('y' in this.rotation)) { this.rotation.y = 0 }
        if (!('z' in this.rotation)) { this.rotation.z = 0 }

        // Make sure all of our properties are numbers
        Object.keys (this.rotation).forEach ( (key) => { if (isNaN (this.rotation [key])) { this.rotation [key] = 0 } })

        if (!('height' in this)) { this.height = 1 }
        if (!('width' in this)) { this.width = 1 }
        if (!('depth' in this)) { this.depth = 1 }
    }

    // This is likely only needed for setting up
    // as interacting directly with the mesh object has been working out
    syncMesh () {
        this._ensureCertainProperties ();
        
        // Make sure we even have a mesh to interact with
        if (!this.mesh) { console.warn ('Object without a mesh tried to sync its mesh'); console.trace (); return; }

        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;

        this.mesh.rotation.x = this.rotation.x;
        this.mesh.rotation.y = this.rotation.y;
        this.mesh.rotation.z = this.rotation.z;

        this.mesh.scale.x = this.width;
        this.mesh.scale.y = this.height;
        this.mesh.scale.z = this.depth;
    }
}
