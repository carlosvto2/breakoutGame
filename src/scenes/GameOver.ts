import Phaser, { GameObjects, Physics } from 'phaser'


export default class GameOver extends Phaser.Scene
{
    private gameOverText?: Phaser.GameObjects.Text
    private score?: integer
	private scoreText?: Phaser.GameObjects.Text

    constructor()
    {
        super('GameOver')
        // get the variables passed to this scene
        Phaser.Scene.call(this, { key: 'GameOver' });
    }

    init(data)
    {
        // save the score
        this.score = data.score
    }

    create()
    {
        // game over text
        this.gameOverText = this.add.text(90, 150, 'Game Over', {
            color: 'black',
            font:'130px Poppins bold'
        });
        this.gameOverText.setStroke('red', 7)

        // score text
        this.scoreText = this.add.text(15, 15, 'Score: '+this.score, {
            color: 'yellow',
            font:'32px Poppins bold'
        });
        this.scoreText.setStroke('black', 7)

        // button settings to replay the game
        const button = this.add.text(400, 400, "Replay")
            .setOrigin(0.5)
            .setPadding(40, 20)
            .setFont('30px bold')
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.startGame())
            .on('pointerover', () => button.setStyle({ fill: '#f39c12', font:'30px bold' }))
            .on('pointerout', () => button.setStyle({ fill: '#FFF', font:'30px bold' }));
    }

    private startGame()
    {
        this.scene.start('Breakout')
    }
}