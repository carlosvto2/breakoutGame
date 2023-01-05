import Phaser, { GameObjects, Physics } from 'phaser'
import LevelClass from '../scripts/Level'

const BALL = 'ball'
const BALL2 = 'ball2'
const BALL3 = 'ball3'
const BACKGROUND = 'background'
const ASSETS = 'assets'
const WALL = 'wall'
const WALLRIGHT = "wallRight"
const WALLLEFT = "wallLeft"
const HIT = "hit"

export default class Breakout extends Phaser.Scene
{
    private initVelocityX = 300
    private initVelocityY = -300
    private level?: LevelClass
    public score = 0
    private scoreText?: Phaser.GameObjects.Text

    constructor()
    {
        super('Breakout')
    }

	preload()
    {
        // load the images
        this.load.image(BACKGROUND, 'assets/images/background.png')
        this.load.image(WALL, 'assets/images/wall.png')
        this.load.image(WALLRIGHT, 'assets/images/wall_right.png')
        this.load.image(WALLLEFT, 'assets/images/wall_left.png')
        this.load.image(BALL, 'assets/images/planet1.png')
        this.load.image(BALL2, 'assets/images/planet2.png')
        this.load.image(BALL3, 'assets/images/planet3.png')
        this.load.image("paddle", 'assets/images/paddle.png')
        this.load.image("buff", 'assets/images/ufo.png')
        this.load.image("paddleRotated", 'assets/images/paddleRotated.png')

        // load the json files for the levels
        this.load.json('levels', 'assets/json/levels.json')
        this.load.atlas(ASSETS, 'assets/images/breakout.png', 'assets/json/breakout.json')

        // load the sounds
        this.load.audio(HIT, 'assets/audio/hit.mp3')
    }

    create()
    {
        this.physics.world.setBoundsCollision(false, false, false, false)
        this.add.image(400, 300, BACKGROUND)


        this.scoreText = this.add.text(15, 15, 'Score: 0', {
            color: 'yellow',
            font:'32px Poppins bold'
        });
        this.scoreText.setStroke('black', 7)

        // create a new Level Object and create a level
        this.level = new LevelClass(this, ASSETS, this.score, this.scoreText)

        this.level.createLevel()

        this.setMouseEvents()
    }


    update()
    {
        if(!this.level)
            return

        var ballGroupLength = this.level.ballGroup.getLength()
        // get all the balls in the scene
        for(var i = ballGroupLength - 1; i >= 0; i--)
        {
            var ball = this.level.ballGroup.children.entries[i]
            // rotate the balls
            ball.body.gameObject.rotation+=.02
            if(ball.body.gameObject.y > 600 || ball.body.gameObject.y < 0 || ball.body.gameObject.x > 790 || ball.body.gameObject.x < 0)
            {
                // if the ball is out of bounds
                if(ballGroupLength > 1)
                {
                    //if there is more than one ball in the scene, destroy it
                    ball.destroy()
                }
                else
                {
                    //if there is just one ball, reset it
                    ball.body.gameObject.resetBall(this.level, false)
                }
            }
        }
    }

    
    /**
        * Configure the mouse events to make the paddle move with the mouse
    */
    private setMouseEvents()
    {
        // use the mouse to move the paddle
        onmousemove = (event: MouseEvent) => {
            // if the game is not over, continue
            if(this.level?.gameOver == true)
                return
            // if the paddleGroup and the ball exist
            if(!this.level?.paddleGroup || !this.level.ballGroup)
                return
            
            // get all the available paddles and move them along with the mouse movement
            for(var i=0; i<this.level.paddleGroup.getLength(); i++)
            {
                var paddleSprite = this.level.paddleGroup.children.entries[i].body.gameObject

                // if the paddle can move horizontally, then it will be moved with the x axys
                if(this.level.paddleGroup?.children.entries[i].body.gameObject.movement == "horizontal")
                {
                    // keep paddle within the screen
                    paddleSprite.x = Phaser.Math.Clamp(event.x, paddleSprite.screenLimitLeft, paddleSprite.screenLimitRight)
    
                    // if the ball is still on the paddle, move the ball with it
                    if(this.level.ballGroup.children.entries[0].getData('onPaddle'))
                    {
                        this.level.ballGroup.children.entries[0].body.gameObject.x = this.level.paddleGroup.children.entries[i].body.gameObject.x
                    }
                }
                else
                {
                    // keep paddle within the screen
                    paddleSprite.y = Phaser.Math.Clamp(event.y, paddleSprite.screenLimitLeft, paddleSprite.screenLimitRight)
                }
                
            }
        }

        // event to trigger the ball when the mouse button is pressed
        onmousedown = (event: MouseEvent) => {
            if(!this.level?.ballGroup.children)
                return
            if(this.level.ballGroup.children.entries[0].getData('onPaddle')){
                this.level.ballGroup.children.entries[0].body.gameObject.setVelocity(this.initVelocityX, this.initVelocityY)
                this.level.ballGroup.children.entries[0].setData('onPaddle', false)
            }
        }
    }
}
