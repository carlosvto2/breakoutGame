import Phaser, { GameObjects, Physics } from 'phaser'
import Level from './Level'

export default class Ball extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, onPaddle: boolean)
	{
		super(scene, x, y, texture)
		this.setScale(0.08)
        scene.physics.world.enable(this)
        scene.add.existing(this)
		this.initialize(onPaddle)
	}

	private initialize(onPaddle)
	{
		// set the world bounds for the ball
		this.setCollideWorldBounds(true)
		this.setBounce(1)
		// at the beginning, the ball is on the paddle, so it is set to true
		this.setData('onPaddle', onPaddle)
	}

	/**
    * Function to place the ball on the paddle
		* @param {Level} level - current level
		* @param {boolean} gameBegins - if the game begins
    */
	public resetBall(level: Level, gameBegins: boolean)
	{			
		this.setVelocity(0)
		// set the ball in the position of the first paddle
        this.setPosition(level.paddleGroup.children.entries[0].body.gameObject.x , 540)
        this.setData('onPaddle', true)

		// if the reset of the ball is not at the beginning of the game, reducelives
		if(!gameBegins)
			level.reduceLives()
	}

}