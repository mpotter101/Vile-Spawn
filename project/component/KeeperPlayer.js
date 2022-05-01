/*

    Prototype player object
    Manages sprite and player inputs

*/

import Keeper from './KEEPER';

import KeeperResourceBar from './KeeperResourceBar';
import KeeperPlayerStatus from './KeeperPlayerStatus';

export default class KeeperPlayer extends Keeper {
    constructor (config) {
        super (config);

        this.assignConfig (config);

        // Set defaults and store items from config
        this.view = config.view;
        this._speed = this.speed = 0.1;
        this._halfSpeed = this.speed / 1.5;
        this.movementKeys = 'w a s d';
        this.anyKeysHeld = false;
        this.keysHeld = {};
        this.numberOfKeysHeld = 0;
        this.crosshair = $ ('.crosshair');
        this.crosshair.addClass ('hide');
        this.character = config.character

        console.log ('Setting up player with:', this.character)

        // Create the mouse look controls
        this.controls = new this.THREE.PointerLockControls ( this.view.camera.camera );
        this.view.scene.add (this.controls.getObject ());

        // Create event listeners
        this._createEvents ();

        // Sync up the mesh to the config
        this.syncMesh ();

        // Set our avatars position so the bottom of the sprite is on the ground
        this.mesh.position.y = this.height / 2;
        this.headPosition = this.mesh.position.y + this.height / 2;

        // Create UI components
        this.healthBar = new KeeperResourceBar ({
            parent: $ ('.dngn.player-bars'),
            name: 'health',
            class: 'dngn hp bar',
            currentValue: this.character.stats.willpower.current,
            // maxValue: 100,
            // minValue: 0
        })

        this.resourceBar = new KeeperResourceBar ({
            parent: $ ('.dngn.player-bars'),
            name: 'resource',
            class: 'dngn resource bar',
            currentValue: this.character.stats.power.current,
            // maxValue: 100,
            // minValue: 0
        })

        this.staminaBar = new KeeperResourceBar ({
            parent: $ ('.dngn.player-bars'),
            name: 'stamina',
            class: 'dngn stamina bar',
            currentValue: this.character.stats.stamina.current,
            // maxValue: 100,
            // minValue: 0
        })

        this.otherBar = new KeeperResourceBar ({
            parent: $ ('.dngn.player-bars'),
            name: 'other',
            class: 'dngn other bar',
            currentValue: this.character.stats.maintenance.current,
            // maxValue: 100,
            // minValue: 0
        })

        this.status = new KeeperPlayerStatus ({
            parent: $ ('.dngn.player-bars')
        })

        this.portraitNode.attr ({ src: this.character.portrait });
        this.nameNode.html ( this.character.name );
    }

    _clearMouseSelection () {
        // Unhighlight any text (caused by double clicking)
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            } else if (document.selection) {  // IE?
                document.selection.empty();
            }
        }
    }

    _createEvents () {
        // Add a listener to the stage to active the mouse look controls when it is clicked
        $ ('#stage').click ((event) => { this.controls.lock (); this._clearMouseSelection (); })

        $ (window).click ((event) => { if (this.controls.isLocked) { this.handleClick (event); } this._clearMouseSelection (); });
        // Respond to when the user's cursor is locked
        $ (window).on ('pointerlockchange', (event) => { this.handlePointerLockChange (event); });

        // Listen for any keypresses
        $ (window).on ('keypress', (event) => { this.handleKeypress (event); });
        $ (window).on ('keyup', (event) => { this.handleKeyup (event); });
    }

    update () {

        // Set our mesh's rotation to match the cameras
        // since the translate functions operate relative to
        // the rotation of the object being translated
        this.mesh.rotation.y = this.view.camera.camera.rotation.y;
        this.mesh.rotation.x = this.view.camera.camera.rotation.x;
        this.mesh.rotation.z = this.view.camera.camera.rotation.z;

        // Check if the user is holding any keys down
        if (this.anyKeysHeld) {
            // k for keyboard
            let k = this.keysHeld;

            // Check if multiple keys are being held, if so, divide speed by 2
            if (this.numberOfKeysHeld > 1) { this.speed = this._halfSpeed; }
            else { this.speed = this._speed }

            // If they are, respond to what keys are being held
            if (k ['w']) { this.moveForward () }
            if (k ['a']) { this.moveLeft () }
            if (k ['s']) { this.moveBackward () }
            if (k ['d']) { this.moveRight () }
        }


        // Keep our player's height the same since moving forward while
        // looking up will cause us to fly
        this.mesh.position.y = 1;

        // Make sure the camera is in the same place as our player
        this.view.camera.setPosition ( this.mesh.position );

        // Now move our camera so it is at the head of our player
        this.view.camera.camera.position.y = this.headPosition

        this.handleLooking ();
    }

    handleLooking () {
        // Don't bother raycasting if the player is not looking
        if (this.controls.isLocked === false) { return; }

        this.inRangeLookTarget = null;
        this.leftTargetRange = null;
        this.lookTarget = null;

        let raycaster = new this.THREE.Raycaster();
        raycaster.setFromCamera( new this.THREE.Vector2 (), this.view.camera.camera );

        let intersects = raycaster.intersectObjects( this.view.masterObjectList, false );
        let key, item;
        for (key in intersects) {
            item = intersects [key].object;

            if (item.keeper && item.keeper.interact) {
                this.lookTarget = item.keeper;
                break;
            }
        }

        if (!this.lookTarget || !this.lookTarget.mesh) {
            if ($ ('.crosshair').hasClass ('target')) {
                $ ('.crosshair').removeClass ('target')
            }

            if (!$ ('.chatbox').hasClass ('hide')) {
                $ ('.chatbox').addClass ('hide')
            }

            if (this.lookTarget) { this.lookTarget = null }
        }

        if (this.lookTarget) {
            this.distanceFromLookTarget = this.lookTarget.mesh.position.distanceTo ( this.mesh.position );

            if (this.distanceFromLookTarget <= 2) {
                if (!$ ('.crosshair').hasClass ('target')) { $ ('.crosshair').addClass ('target') }
                this.inRangeLookTarget = this.lookTarget
            }
            else {
                if ($ ('.crosshair').hasClass ('target')) { $ ('.crosshair').removeClass ('target') }
            }
        }

        this.lastLookTarget = this.lookTarget;
    }

    handleClick (event) {
        event.preventDefault ();
        event.stopPropagation ();

        // If we have something we can interact with
        if (this.inRangeLookTarget) {
            // Try and interact with it
            // for now, assume its an NPC

            // Interact with a look target that is in range and
            // pass in any existing interactivity
            // Store data from any possible previous interactivity and send it to the interactable
            // Currently, NPCs use this to see if any other NPCs are talking
            this.interactivity = this.lookTarget.interact (
                this.interactivity,
                {
                    interacter: this,
                    distance: this.distanceFromLookTarget
                }
            );
        }
    }

    handleKeypress (event) {
        let key = event.key;

        // Only accept input when the game has focus
        if (this.controls.isLocked === false) { return; }

        // Only care about movement keys
        if (this.movementKeys.indexOf (key) > -1) {
            // Add the keys being held to our keys held property
            this.keysHeld [key] = true;

            // Start checking for keys held in the update loop
            this.anyKeysHeld = true;

            // Count how many keys are being held
            this.numberOfKeysHeld = Object.keys (this.keysHeld).length;
        }
    }

    handleKeyup (event) {
        let key = event.key;

        // Try to delete the key that was released
        delete this.keysHeld [key];

        // Count how many keys are being held
        this.numberOfKeysHeld = Object.keys (this.keysHeld).length;

        // Set if any keys are being held for our update loop
        this.anyKeysHeld = (Object.keys (this.keysHeld).length !== 0)

    }

    handlePointerLockChange (event) {
        if (this.controls.isLocked) { this.crosshair.removeClass ('hide') }
        else { this.crosshair.addClass ('hide') }
    }

    moveDown () { this.mesh.translateY ( -this.speed ); }
    moveUp () { this.mesh.translateY ( this.speed ); }

    moveRight () { this.mesh.translateX ( this.speed ); }
    moveLeft () { this.mesh.translateX ( -this.speed ); }

    moveForward () { this.mesh.translateZ ( -this.speed ); }
    moveBackward () { this.mesh.translateZ ( this.speed ); }
}
