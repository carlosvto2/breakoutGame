import Phaser, { GameObjects, Physics } from 'phaser'
import BallClass from '../scripts/Ball'

const BACKGROUND = 'background'
const BALL = 'ball'
const MUSIC = 'mainMenu'

export default class GameOver extends Phaser.Scene
{
    private MainMenuText?: Phaser.GameObjects.Text
	public ballObj?: BallClass
    private music

    constructor()
    {
        super('MainMenu')
    }

    preload()
    {
        // load the images
        this.load.image(BACKGROUND, 'assets/images/background.png')
        this.load.image(BALL, 'assets/images/planet1.png')

        // load the sounds
        this.load.audio(MUSIC, 'assets/audio/mainMenu.wav')
    }

    create()
    {
        this.add.image(400, 300, BACKGROUND)
        this.ballObj = new BallClass(this, 200, 550, BALL, false)
        this.ballObj.setVelocity(300)
        this.ballObj.setCollideWorldBounds(true)
        this.ballObj.setBounce(1)

        // define hit audio and adapt the volume
		this.music = this.sound.add(MUSIC, {volume: 0.3})
        this.music.loop = true
        this.music.play()

        // victory text
        this.MainMenuText = this.add.text(100, 150, 'Breakout', {
            color: '#6391c0',
            font:'150px Arial bold'
        });
        this.MainMenuText.setShadow(-10, 10, '#0a4d89', 15)
        this.MainMenuText.setStroke('#4eabfd', 7)

        // button settings to replay the game
        const button = this.add.text(400, 400, "Play")
            .setOrigin(0.5)
            .setPadding(40, 20)
            .setFont('30px bold')
            .setColor('#6391c0')
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.startGame())
            .on('pointerover', () => button.setStyle({ fill: '#f39c12', font:'30px bold' }))
            .on('pointerout', () => button.setStyle({ fill: '#6391c0', font:'30px bold' }));
    }

    update()
    {
        if(!this.ballObj)
            return
        this.ballObj.rotation+=.05
    }

    private startGame()
    {
        this.scene.start('Breakout')
    }
}