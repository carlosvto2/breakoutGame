import Phaser, { Physics } from 'phaser'

export default class HelloWorld extends Phaser.Scene
{
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private player?: Phaser.Physics.Arcade.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private stars?: Phaser.Physics.Arcade.Group

    private score = 0
    private scoreText?: Phaser.GameObjects.Text

    private bombs?: Phaser.Physics.Arcade.Group

    private gameOver = false

	constructor()
	{
		super('hello-world')
	}

	preload()
    {
        this.load.image('bgnd', 'assets/bgnd.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create()
    {
        this.add.image(400, 300, 'bgnd')

        this.platforms = this.physics.add.staticGroup()
        const ground = this.platforms.create(400, 568, 'ground') as Phaser.Physics.Arcade.Sprite
        ground.setScale(2).refreshBody()

        this.platforms.create(600, 400, 'ground')
        this.platforms.create(50, 250, 'ground')
        this.platforms.create(750, 220, 'ground')

        // Player created as a dynamic physics body
        this.player = this.physics.add.sprite(100, 450, 'dude')
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)

        // create animation when the key 'left' is pressed. It will use the frames 0 to 3
        this.player.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNames('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // create object collider to detect a collision between the player and the platforms
        this.physics.add.collider(this.player, this.platforms);

        // create object cursors with proprerties: up, down, right and left
        this.cursors = this.input.keyboard.createCursorKeys()

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: 70}
        })

        this.stars.children.iterate(child => {
            const star = child as Phaser.Physics.Arcade.Sprite
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        })

        this.physics.add.collider(this.stars, this.platforms);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            color: '#000'
        });

        this.bombs = this.physics.add.group()

        this.physics.add.collider(this.bombs, this.platforms)
        this.physics.add.collider(this.bombs, this.player)

        this.physics.add.overlap(this.player, this.bombs, this.hitBomb, undefined, this);
    }


    update()
    {
        if(!this.cursors)
        {
            return
        }
        if(this.cursors.left.isDown)
        {
            this.player?.setVelocityX(-160);
            this.player?.anims.play('left', true);
        }
        else if(this.cursors.right.isDown)
        {
            this.player?.setVelocityX(160);
            this.player?.anims.play('right', true);
        }
        else
        {
            this.player?.setVelocityX(0);
            this.player?.anims.play('turn', true);
        }

        // if button up is pressed and the player is touching something
        if (this.cursors.up.isDown && this.player?.body.touching.down)
        {
            this.player?.setVelocityY(-330);
        }
    }
    
    private collectStar(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject)
    {
        const star = s as Phaser.Physics.Arcade.Sprite
        star.disableBody(true, true)

        this.score += 10
        this.scoreText?.setText(`Score: ${this.score}`)

        // if there are no stars
        if(this.stars?.countActive(true) === 0)
        {
            
        }
    }

    private hitBomb(player: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject)
    {
        this.physics.pause()
        this.player?.setTint(0xff0000)
        this.player?.anims.play('turn')
        this.gameOver = true
    }
}
