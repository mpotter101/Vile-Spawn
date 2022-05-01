/*

    Handles rendering for a video game resource bar (most commonly, health)

*/

import Html from './HTML';

export default class ResourceBar extends Html {
    constructor (config) {
        super (config);

        config = this.setConfigDefaults ({
            maxValue: 100,
            minValue: 0,
            currentValue: 100,
            class: 'dngn bar',
            animate: true,
            valueChangeDuration: 5000,
            easing: 'easeOutCubic',
            name: 'Generic',
            onValueChangeComplete: () => { console.log ('Resource bar value finished changing') },
        })

        this.assignConfig (config);
        this.renderToParent ();

        this.lastValue = this.currentValue;
        this.setValue ( this.currentValue );
    }

    _animateBar () {
        let newWidth = (this._percent * 100) + '%';

        if (this._animation) {
            this._animation.pause ();
            this._animation = null;
        }

        // We lost resources
        if (this.lastValue >= this.currentValue) {
            this.currentValueNode.width (newWidth )

            this._animation = anime ({
                targets: this.lostAmountNode [0],
                width: newWidth,
                duration: this.valueChangeDuration,
                easing: this.easing,
                complete: () => { this.valueChangeCompleteHandler (); }
            })
        }
        // We gained resources
        else if (this.lastValue < this.currentValue) {
            this._animation = anime ({
                targets: [this.currentValueNode [0], this.lostAmountNode [0]],
                width: newWidth,
                duration: this.valueChangeDuration,
                easing: this.easing,
                complete: () => { this.valueChangeCompleteHandler (); }
            })
        }
    }

    _updatePercentValue () {
        this._percent = (this.currentValue - this.minValue) / (this.maxValue - this.minValue);
    }

    setValue (value) {
        this.lastValue = this.currentValue;
        this.currentValue = value;
        this._updatePercentValue ();

        if (this.animate) {
            this._animateBar ();
        }
        else {
            this.valueChangeCompleteHandler ();
        }
    }

    add (value) {
        this.setValue ( this.currentValue + value )
    }

    take (value) {
        let amount;
        if (value > this.currentValue) { amount = this.currentValue }
        else { amount = value; }

        this.setValue ( this.currentValue - value )

        // Return how much was taken away
        return amount;
    }

    render (parent) {
        this.template = `
            <div>
                <div class="lost value"></div>
                <div class="current value"></div>
            </div>
        `

        this._render (parent);

        this.currentValueNode = this.node.find ('.current.value');
        this.lostAmountNode = this.node.find ('.lost.value');
    }

    valueChangeCompleteHandler () {
        this.onValueChangeComplete ({
            target: this,
            currentValue: this.currentValue,
            name: this.name
        })
    }
}
