// import files needed here
//import App from './Kitchen-Sink'
import App from './App'

// Create the App
// Pass in schema for app here
window.VileSpawn = new App ({
    stageQuerySelector: "#stage",
    canvasHeight: 512,
    canvasWidth: 512,
    keywords: ['beast', 'humanoid', 'fur', 'claws', 'quadroped', 'wings', 'undead', 'construct', 'aquatic', 'scales'],
    animationCategories: {
        'Idle': {
            'face-right': { },
            'face-left': { },
            'face-right-away': { optional: true },
            'face-left-away': { optional: true },
        },
        'Movement': {
            'face-right': { scrollDir: 'right' },
            'face-left': { scrollDir: 'left' },
            'face-right-away': {scrollDir: 'down right', optional: true},
            'face-left-away': { scrollDir: 'down left', optional: true },
        },
        'Combat': {
            'basic-attack': {},
            'cast-ability': {},
            'hurt': {},
            '(knockedout-start)': { optional: true },
            'knockedout-loop': {},
        }
    }
});
