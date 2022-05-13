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
    animations: {
        'idle-right': { },
        '(idle-right-back)': { },
        'idle-left': { },
        '(idle-left-back)': { },
        'walk-right': { scrollDir: 'right' },
        '(walk-right-back)': {scrollDir: 'down right'},
        'walf-left': { scrollDir: 'left' },
        '(walk-left-back)': { scrollDir: 'down left' },
        'basic-attack': {},
        'cast-ability': {},
        'hurt': {},
        '(knockedout-start)': {},
        'knockedout-loop': {},
    }
});
