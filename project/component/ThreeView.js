/*

    Makes creating a scene that lets you start seeing things easily

*/

import Three from './THREE'

import ThreeScene from './ThreeScene';
import ThreeRenderer from './ThreeRenderer';
import ThreeCamera from './ThreeCamera';

export default class ThreeView extends Three {
    constructor (config) {
        super (config);

        config = this.setConfigDefaults ({
            camera: {
                type: 'PerspectiveCamera'
            },
            renderer: {}
        })

        this.assignConfig (config);

        this.renderer = new ThreeRenderer (this.renderer);
        this._scene = new ThreeScene ();
        this.scene = this._scene.scene;

        this.renderToParent ();

        this.camera.aspectRatio = this.node.width () / this.node.height ();
        this.camera = new ThreeCamera (this.camera);

        if (config.autoResize) {
            // Requires multiple calls to the render function to see changes
            $ (window).on ('resize', () => {
                let width = this.parent.width ();
                let height = this.parent.height ();


                this.renderer.node.width ( width );
                this.renderer.node.height ( height );
                this.camera.camera.aspect = width / height;
                this.camera.camera.updateProjectionMatrix ();
            });
        }
    }

    _render (parent) {
        this.node = this.renderer.node;

        parent.append (this.node);
    }

    renderToParent () { this._render (this.parent); }

    add (three) {
        this.scene.add (three)
        this.masterObjectList = this.collectMasterObjectList ();
    }

    render () {
        this.renderer.render (this.scene, this.camera.camera);
    }

    remove (mesh) {
        // Stop rendering this item
        this.scene.remove (mesh);

        // Remove it from the master object list
        this.masterObjectList.forEach ((item, index) => {
            if (item === mesh) { this.masterObjectList.splice (index, 1) }
        })
    }

    lookAt (data) { this.camera.camera.lookAt (data) }

    collectMasterObjectList (list) {
        if (!list) { list = this.scene.children; }

        let item, key
        for (key in list) {
            item = list [key];

            if (item.children && item.children.length) {
                list = list.concat ( this.collectMasterObjectList (item.children) );
            }
        }

        return list;
    }
}
