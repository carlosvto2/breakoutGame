import Phaser, { Physics } from 'phaser'

export default class Paddle extends Phaser.Physics.Arcade.Sprite
{
    public screenLimitRight = 733
    public screenLimitLeft = 67
    public movement

	constructor(scene: Phaser.Scene, x: number, y: number, limitLeft: number, limitRight:number, movement: string, texture: string, scaleX: number, scaleY: number)
	{
        super(scene, x, y, texture)
        scene.physics.world.enable(this, 0)

        this.screenLimitLeft = limitLeft
        this.screenLimitRight = limitRight
        this.movement = movement
        this.scaleX = scaleX
        this.scaleY = scaleY
	}
}