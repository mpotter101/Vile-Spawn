import Html from './HTML';

export default class ImageInput extends Html {
    constructor(config) {
        // Run HTML object setup
        super (config);

        // Make sure the config has certain properties
        config = this.setConfigDefaults ({
            template: '<div></div>',
            onImage: (data) => { console.log ("Image detected!") },
        })

        // Assign properties from config and render our dom
        this.assignConfig (config);
        this.renderToParent ();

        var fileElement = document.createElement('input');
        fileElement.type = 'file';
        this.reader = new FileReader();
        this.reader.onload = (e) => { this.ImageHandler (e); };
        this.node = $(fileElement);
        this.node [0].addEventListener ('change', (e) => {
            if (this.reader.readyState != 0) { this.reader.abort(); }
            this.LoadImageFromEvent (e);
        }, false);
    }

    ImageHandler (e) {
        var img = new Image();
        img.src = this.reader.result;
        img.onload = () => {
            this.onImage ({
                target: this,
                event: e,
                node: this.node,
                value: img
            });
            this.node [0].value = null;
        }
    }

    LoadImageFromEvent (e) {
        this.reader.readAsDataURL(e.target.files[0]);
    }
}
