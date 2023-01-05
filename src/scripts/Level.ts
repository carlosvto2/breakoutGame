import Phaser, { GameObjects, Physics, Scene } from 'phaser'
import BallClass from './Ball'
import BrickClass from './Brick'
import PaddleClass from './Paddle'
import BuffClass from './Buff'

const HIT = 'hit'
const BALL = 'ball'
const BALL2 = 'ball2'
const BALL3 = 'ball3'

export default class Level
{
	// Level variables
	private levelNumber: integer
	private levelInfo

	private scene: Scene
	private brickGroup: Phaser.Physics.Arcade.StaticGroup
	public paddleGroup: Phaser.Physics.Arcade.Group
	public ballGroup: Phaser.Physics.Arcade.Group
	public ballObj?: BallClass
	private assetsJson: string

	// UI variables
	private score: integer
	private scoreText: Phaser.GameObjects.Text
	private lives: integer
	private liveText: Phaser.GameObjects.Text

	// Brick Information Variables
	private brickScale: integer
	private oneHitBrickPoints: integer
	private twoHitBrickPoints: integer

	// Audio Variables
	private hitAudio

	// Walls
	private walls: Phaser.Physics.Arcade.StaticGroup

	public gameOver: boolean

	constructor(scene: Phaser.Scene, assets: string, score: integer, scoreText: Phaser.GameObjects.Text)
	{
		this.gameOver = false

		this.scene = scene
		this.levelNumber = 0

		this.assetsJson = assets
		this.score = score
		this.scoreText = scoreText

		// group of bricks with the classType "BrickClass"
		this.brickGroup = this.scene.physics.add.staticGroup({
			classType: BrickClass,
			runChildUpdate: true
		})

		// group of paddles with the classType "PaddleClass" and immovable set to "true"
		this.paddleGroup = this.scene.physics.add.group({
			classType: PaddleClass,
			immovable: true
		})

		// group of balls with the classType "BallClass"
		this.ballGroup = this.scene.physics.add.group({
			classType: BallClass,
			bounceX: 1,
			bounceY: 1,
			velocityX: 300,
			velocityY: -300
		})

		this.walls = scene.physics.add.staticGroup()

		// define the live text
		this.lives = 0
		this.liveText = this.scene.add.text(650, 15, 'Lives: 0', {
            color: 'yellow',
            font:'32px Poppins bold'
        });
		this.liveText.setStroke('black', 7)

		// define the brick settings
		this.brickScale = 0.8
		this.oneHitBrickPoints = 10
		this.twoHitBrickPoints = 30

		// define hit audio and adapt the volume
		this.hitAudio = this.scene.sound.add(HIT, {volume: 0.3})
	}

	/**
    	* Function to create a new level
    */
	public createLevel()
	{
		// read the json file for the levels
        var jsonLevels = this.scene.cache.json.get('levels')
		this.levelInfo = jsonLevels.levels[this.levelNumber]
		this.destroyExistingBalls()

		this.createBall(true)
		
        // generate the bricks for the next level
        this.generateBricks()
		this.setLives()
		this.createPaddles()
		this.setWalls()

		if(!this.paddleGroup)
			return
     
		// reset the ball --> the parameter is null, because in this case we dont need to reduce the lives
        this.ballObj?.resetBall(this, true)
        this.levelNumber++
	}

	/**
        * Create a random ball
		* @param {boolean} setOnPaddle - Boolean to specify if the ball needs to be generated on the paddle
    */
	private createBall(setOnPaddle: boolean)
	{
		var randomNumber = Math.floor(Math.random() * ((3 - 1) - 0 + 1))
		var ball

		switch(randomNumber)
		{
			case 0:
				ball = BALL
				break;
			case 1:
				ball = BALL2
				break;
			case 2:
				ball = BALL3
				break;
		}
		// create the ball and add it to the ballGroup
        this.ballObj = new BallClass(this.scene, 400, 450, ball, setOnPaddle)
		this.ballGroup.add(this.ballObj)
	}

	/**
        * Create paddles for the current level in the correct position
    */
    private createPaddles()
    {
		// get the paddles from the json file
		var paddlesInfo = this.levelInfo.paddles
		var paddlesLength = Object.keys(paddlesInfo).length
		
		for(var i=0; i<paddlesLength; i++)
		{
			// get paddle position and limits
			var posX = paddlesInfo[i].posX
			var posY = paddlesInfo[i].posY
			var screenLimitLeft = paddlesInfo[i].screenLimitLeft
			var screenLimitRight = paddlesInfo[i].screenLimitRight
			var texture = paddlesInfo[i].texture
			var movement = paddlesInfo[i].movement
			var scaleX = paddlesInfo[i].scaleX
			var scaleY = paddlesInfo[i].scaleY

			// create paddle in the correspondent position and add it to the paddle group
			let paddleObj = new PaddleClass(this.scene, posX, posY, screenLimitLeft, screenLimitRight, movement, texture, scaleX, scaleY)
			this.paddleGroup.add(paddleObj, true)
		}
			
        // set the collider to trigger the "paddleHit" function when the ball hits the paddle
        this.scene.physics.add.collider(this.ballGroup, this.paddleGroup, this.paddleHit, undefined, this)
    }

	/**
    * set the walls for the current level
    */
	private setWalls()
	{
		// get the walls from the json file
		var wallsInfo = this.levelInfo.walls
		var wallsLength = Object.keys(wallsInfo).length
		
		for(var i = 0; i < wallsLength; i++)
		{
			// get wall position, texture and scale
			var posX = wallsInfo[i].posX
			var posY = wallsInfo[i].posY
			var texture = wallsInfo[i].texture
			var scaleX = wallsInfo[i].scaleX
			var scaleY = wallsInfo[i].scaleY

			this.walls.create(posX, posY, texture).setScale(scaleX,scaleY).refreshBody()
		}

		this.scene.physics.add.collider(this.ballGroup, this.walls)
		this.scene.physics.add.collider(this.paddleGroup, this.walls)
	}

	/**
    	* Set the lives for the current level
    */
	private setLives()
	{
		this.lives = this.levelInfo.lives
		this.liveText.setText(`Lives: ${this.lives}`)
	}
	/**
    	* Reduces the lives by 1
    */
	public reduceLives()
	{
		this.lives--
		this.liveText.setText(`Lives: ${this.lives}`)
		if(this.lives == 0)
		{
			this.gameOver = true
			this.scene.scene.start('GameOver', { score: this.score})
		}
	}
	
	/**
    * Function to generate the bricks for the current level
    */
	private generateBricks()
	{
		// get the number of rows reading the length of brickPosition
        var rows = Object.keys(this.levelInfo.brickPosition).length
        var maxColumns = 13
        var firstBrickPosX = 90
        var firstBrickPosY = 70
        var xOffset = 64 * this.brickScale
        var yOffset = 32 * this.brickScale


        for(var y = 0; y < rows; y++)
        {
            var rowBricks = this.levelInfo.brickPosition[y]
            for(var x = 0; x < maxColumns; x++)
            {
                if(rowBricks[x] == 1)
                {
					var numHitsBrick = 1
					var brickPoints = this.oneHitBrickPoints
                    // get the color for the block
                    var brickColor = this.levelInfo.brickColor[y][x]

					// get a random number to set the duravility of the brick
					var randomNumber = Math.floor(Math.random() * ((5 - 1) - 0 + 1))
					// if the random number is 2 we set the duravility to 2 (20%) and use the dark brick as texture
					if(randomNumber == 2)
					{
						numHitsBrick = 2
						brickColor = brickColor + '2'
						brickPoints = this.twoHitBrickPoints
					}

					// create new brick and add it to the staticGroup
					var block = new BrickClass(this.scene, firstBrickPosX, firstBrickPosY, this.assetsJson, brickColor, numHitsBrick, brickPoints)
                    
					// change the block scale and add it to the brick group
					block.scale = this.brickScale
					this.brickGroup.add(block, true)
                }

                firstBrickPosX += xOffset
            }
            firstBrickPosY += yOffset
            firstBrickPosX = 90
        }


        // set the collider to trigger the "brickHit" function when the ball hits a brick
        this.scene.physics.add.collider(this.ballGroup, this.brickGroup, this.brickHit, undefined, this)
	}


	/**
		* Function called when the ball hits a brick
		* @param {object} ball - Ball hitting the brick
		* @param {object} brick - Brick hit by the ball
    */
    private brickHit(ball: Phaser.GameObjects.GameObject, brick: Phaser.GameObjects.GameObject){
        const brickObj = brick as BrickClass

		// if the number of hits for this brick is 1, disable it
		if(brickObj.hits == 1)
		{

			// create a small particle effect where the brick was destroyed, make an animation and destroy it at the end
			var image = this.scene.add.image(brickObj.x, brickObj.y, this.assetsJson, 'particle1')
			this.scene.tweens.add({
				targets: image,
				scale: 2,
				duration: 300,
				ease: 'linear',
				yoyo: true,
				onComplete:function(){
                    image.destroy()
                },
			})
			// play the hit audio
			
			this.hitAudio.play()

			// get brick points and add it to the current score
			this.score += brickObj.getBrickPoints()
			this.scoreText?.setText(`Score: ${this.score}`)

			// spawn an extra ball buff
			this.extraBallBuff(brickObj.x, brickObj.y)

			// destroy the brick
			brickObj.destroy()
		}
		else
		{
			// if the number of hits is bigger than 1, reduce it
			brickObj.reduceHits()
		}

        // if the number of bricks is 0, finish the level
		if(this.brickGroup?.getLength() == 0){
            this.finishLevel()
        }
    }


	/**
		* Function called when the ball hits the paddle
		* @param {object} ball - Ball hitting the paddle
		* @param {object} paddle - Paddle hit by the ball
    */
    private paddleHit(ball: Phaser.GameObjects.GameObject, paddle: Phaser.GameObjects.GameObject){
        var difference = 0

        const ballSprite = ball as Phaser.Physics.Arcade.Sprite
        const paddleSprite = paddle as Phaser.Physics.Arcade.Sprite

        if(ballSprite.x < paddleSprite.x)
        {
            // if the ball is on the left hand side of the paddle
            difference = paddleSprite.x - ballSprite.x
            ballSprite.setVelocityX(-10 * difference)
        }
        else if (ballSprite.x > paddleSprite.x)
        {
            // if the ball is on the right hand side of the paddle
            difference = ballSprite.x - paddleSprite.x;
            ballSprite.setVelocityX(10 * difference);
        }
        else
        {
            // ball is in the middle, add a little random number
            ballSprite.setVelocityX(2 + Math.random() * 8);
        }
    }

	/**
    	* Destroy the walls, paddles and ball from the current level and prepare for the next level
    */
	private finishLevel()
	{
		// destroy the ball from the old level
		this.ballObj?.destroy()

		// destroy the paddles from the old level
		for(var i=this.paddleGroup.getLength()-1; i>=0; i--)
		{
			this.paddleGroup.children.entries[i].destroy()
		}

		// destroy the walls from the old level
		for(var i=this.walls.getLength()-1; i>=0; i--)
		{
			this.walls.children.entries[i].destroy()
		}

		this.checkNextLevel()
	}

	/**
    	* Check if another level is left, or the player has won
    */
	private checkNextLevel()
	{
		// check if there is another level (the "levelNumber" variable has the number of next level saved)
		var jsonLevels = this.scene.cache.json.get('levels')
		var nextLevelExist = jsonLevels.levels[this.levelNumber]

		if(!nextLevelExist)
		{
			this.gameOver = true
			this.scene.scene.start('Victory', { score: this.score})
		}
		else
		{
			this.createLevel()
		}
	}

	/**
    	* Spawns a buff
		* @param {integer} posX - X Position where the brick was broken
		* @param {integer} posY - Y Position where the brick was broken
    */
	private extraBallBuff(posX: integer, posY: integer)
	{
		
		// get a random number to get a Buff
		var randomNumber = Math.floor(Math.random() * ((10 - 1) - 0 + 1))

		// if the random number is 1 we get a buff (10%)
		if(randomNumber == 1)
		{
			// create the buff for the ball spawn
			var buff = new BuffClass(this.scene, posX, posY, "buff")
			// destroy the buff after 3 seconds
			this.scene.time.delayedCall(3000, buff.destroy, [], buff)
			// collision between the buff and the paddle
			this.scene.physics.add.collider(buff, this.paddleGroup, this.buffHit, undefined, this)
		}
		
	}

	/**
		* Function called when the buff hits the paddle to create a new ball
		* @param {object} paddle - paddle
		* @param {object} buff - buff
    */
	private buffHit(buff: Phaser.GameObjects.GameObject, paddle: Phaser.GameObjects.GameObject){
		buff.destroy()
		this.createBall(false)
	}


	/**
		* Destroy all the balls in the scene
    */
	private destroyExistingBalls()
	{
		var ballGroupLength = this.ballGroup.getLength()
		
        // get all the balls in the scene
        for(var i = ballGroupLength - 1; i >= 0; i--)
        {
			this.ballGroup.children.entries[i].destroy()
		}
	}
}