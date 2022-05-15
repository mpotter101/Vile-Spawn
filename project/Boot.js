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
            'idle-right': { },
            'idle-left': { },
            '(idle-right-back)': { optional: true },
            '(idle-left-back)': { optional: true },
        },
        'Movement': {
            'walk-right': { scrollDir: 'right' },
            'walf-left': { scrollDir: 'left' },
            '(walk-right-back)': {scrollDir: 'down right', optional: true},
            '(walk-left-back)': { scrollDir: 'down left', optional: true },
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
