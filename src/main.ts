import Phaser from 'phaser'

import Breakout from './scenes/Breakout'
import GameOver from './scenes/GameOver'
import Victory from './scenes/Victory'
import MainMenu from './scenes/MainMenu'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		// set gravity to 0
		arcade: {
			gravity: { y: 0 }
			// debug: true
		}
	},
	scene: [MainMenu, Breakout, GameOver, Victory]
}

export default new Phaser.Game(config)
