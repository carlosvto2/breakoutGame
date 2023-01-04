import Phaser, { GameObjects, Physics } from 'phaser'

export default class Brick extends Phaser.Physics.Arcade.Sprite
{
	public hits = 1
	private textureString
	private frameString
	private points
	constructor(scene: Phaser.Scene, x: integer, y: integer, texture: string, frame: string, numHits: integer, brickPoints: integer)
	{
		super(scene, x, y, texture, frame)
		this.textureString = texture
		this.frameString = frame
		this.hits = numHits
		this.points = brickPoints	
	}

	/**
    * Reduce number of hits needed to destroy the brick
    */
	public reduceHits()
	{
		this.hits--
		// if the number of hits is 1, change to the normal texture
		if(this.hits == 1)
		{
			this.changeTexture()
		}
	}

	/**
    * Change brick texture to normal
    */
	public changeTexture()
	{
		this.frameString = this.frameString.replace('2','')
		this.setTexture(this.textureString, this.frameString)
	}

	/**
    * Get the number of points for this brick
    */
	public getBrickPoints()
	{
		return this.points
	}
}