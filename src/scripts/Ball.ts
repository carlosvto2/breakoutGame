import Phaser, { GameObjects, Physics } from 'phaser'
import Level from './Level'

export default class Ball extends Phaser.Physics.Arcade.Sprite
{
	private paddleGroup?: Phaser.Physics.Arcade.Group
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
	{
		super(scene, x, y, texture)
        scene.physics.world.enable(this)
        scene.add.existing(this)
		this.initialize()
	}

	private initialize()
	{
		this.setScale(0.08)
		// set the world bounds for the ball
		this.setCollideWorldBounds(true)
		this.setBounce(1)
		// at the beginning, the ball is on the paddle, so it is set to true
		this.setData('onPaddle', true)
	}

	/**
    * Function to place the ball on the paddle
	* @param {Level} level - current level
    */
	public resetBall(level)
	{
		if(!this.paddleGroup)
			return
			
		this.setVelocity(0)
		// set the ball in the position of the first paddle
        this.setPosition(this.paddleGroup.children.entries[0].body.gameObject.x , 540)
        this.setData('onPaddle', true)

		if(level == null)
			return;
		
		// if the level is not null, it means we have already start playing, and we reduce the lives
		level.reduceLives()
	}

	/**
    * Function to set the group of paddles
	* @param {Phaser.Physics.Arcade.Group} paddleGroup - group object of paddles
    */
	public setPaddle(paddleGroup: Phaser.Physics.Arcade.Group)
	{
		this.paddleGroup = paddleGroup
	}
}