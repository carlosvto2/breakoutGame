import Phaser, { Physics } from 'phaser'

export default class Buff extends Phaser.Physics.Arcade.Sprite
{

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
	{
        super(scene, x, y, texture)
        scene.physics.world.enable(this, 0)
        scene.add.existing(this)

        this.setVelocity(0, 300)
	}
}