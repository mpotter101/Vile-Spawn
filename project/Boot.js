// import files needed here
//import App from './Kitchen-Sink'
import App from './App'

// Create the App
// Pass in schema for app here
window.VileSpawn = new App ({
    stageQuerySelector: "#stage",
    canvasHeight: 256,
    canvasWidth: 256,
    keywords: ['beast', 'humanoid', 'fur', 'claws', 'quadroped', 'wings', 'undead', 'construct', 'aquatic', 'scales'],
    animations: [
        'idle-right', '(idle-right-back)', 'idle-left', '(idle-left-back)',
        'walk-right', '(walk-right-back)', 'walf-left', '(walk-left-back)',
        'sleep-startup', 'sleep-loop', 'sleep',
        'eat', 'working-on-something-loop',
        '(fishing-startup)', '(fishing-idle-loop)', '(fishing-catch)', '(fishing-end)',
        'fight-idle', 'fight-attack', 'fight-hurt', 'knockout',
    ]
})
