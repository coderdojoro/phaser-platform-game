/// <reference path="../../typings/phaser.d.ts" />
// @ts-check

import Phaser from 'phaser';

class Game extends Phaser.Scene {
  
  preload() {
    this.load.image('knight', 'assets/mage/mage.png');
    this.load.spritesheet('idle-spritesheet', 'assets/mage/idle/idle.png', { frameWidth: 85, frameHeight: 128 });
    this.load.spritesheet('walk-spritesheet', 'assets/mage/walk/walk.png', { frameWidth: 85, frameHeight: 128 });
    this.load.spritesheet('jump-spritesheet', 'assets/mage/jump/jump.png', { frameWidth: 85, frameHeight: 128 });
    this.load.spritesheet('high-jump-spritesheet', 'assets/mage/high_jump/high_jump.png', { frameWidth: 85, frameHeight: 128 });
    this.load.spritesheet('run-spritesheet', 'assets/mage/run/run.png', { frameWidth: 85, frameHeight: 128 });
    this.load.spritesheet('fall-spritesheet', 'assets/mage/fall/fall.png', { frameWidth: 85, frameHeight: 128 });

    this.load.tilemapTiledJSON('level1', 'assets/tilemaps.json');
    this.load.image('level1-sheet', 'assets/tiles/tiles.png ');
    this.load.image('brush-sheet', 'assets/tiles/brush-and-trees.png');

    this.load.image('background4', 'assets/backgrounds/background4.png');
    this.load.image('background3', 'assets/backgrounds/background3.png');
    this.load.image('background2', 'assets/backgrounds/background2.png');
    this.load.image('background1', 'assets/backgrounds/background1.png');
    
  }
  
  keyLeft;
  keyRight;
  keyShift;
  keySpace;

  create(data) {
    
    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.anims.create({
      key: 'hero-idle',
      frames:[
      { frame: 0, key: 'knight', duration: 5000 }, 
        ...this.anims.generateFrameNumbers('idle-spritesheet', {})
      ],
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'hero-walk',
      frames: this.anims.generateFrameNumbers('walk-spritesheet', {}),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'hero-jump',
      frames: this.anims.generateFrameNumbers('jump-spritesheet', {}),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'hero-high-jump',
      frames: this.anims.generateFrameNumbers('high-jump-spritesheet', {}),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: 'hero-run',
      frames: this.anims.generateFrameNumbers('run-spritesheet', {}),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'hero-fall',
      frames: this.anims.generateFrameNumbers('fall-spritesheet', {}),
      frameRate: 10,
      repeat: 0,
    });
  

    this.addMap();

    this.hero = this.physics.add.sprite(400, 300, 'idle-spritesheet');
    this.hero.anims.play('hero-idle');

    this.children.moveTo(this.hero, this.children.getIndex(this.map.getLayer('foreground').tilemapLayer));

    this.physics.add.collider(this.hero, this.groudLayer);

    if(this.hero.body instanceof Phaser.Physics.Arcade.Body) {
      this.hero.body.setSize(33, 54);
      this.hero.body.setOffset(27,57);
      this.hero.body.setCollideWorldBounds(true);
      this.hero.body.setDragX(2000);//1150
      this.hero.body.setMaxVelocity(200, 400);
    }

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.hero);

    // const platform = this.add.rectangle(220, 500, 260, 10, 0x4BCB7C);
    // this.physics.add.existing(platform, true);
    // this.physics.add.collider(this.hero, platform);
    
    // const platform2 = this.add.rectangle(320, 300, 260, 10, 0x4BCB7C);
    // this.physics.add.existing(platform2, true);
    // this.physics.add.collider(this.hero, platform2);

    // const platform3 = this.add.rectangle(520, 400, 260, 10, 0x4BCB7C);
    // this.physics.add.existing(platform3, true);
    // this.physics.add.collider(this.hero, platform3);

    // const platform4 = this.add.rectangle(520, 600, 260, 10, 0x4BCB7C);
    // this.physics.add.existing(platform4, true);
    // this.physics.add.collider(this.hero, platform4);

  }

  addMap() {
    this.map = this.make.tilemap({key: 'level1'});
    this.groundTiles = this.map.addTilesetImage('level1' /*tileset name from jsom*/, 'level1-sheet');
    this.groundTiles2 = this.map.addTilesetImage('bushes', 'brush-sheet');
    
    this.background4 = this.map.addTilesetImage('background4', 'background4');
    this.background3 = this.map.addTilesetImage('background3', 'background3');
    this.background2 = this.map.addTilesetImage('background2', 'background2');
    this.background1 = this.map.addTilesetImage('background1', 'background1');

    this.battlegroundLayer1 = this.map.createStaticLayer('background1' /*layer name from json*/, this.background1);
    this.battlegroundLayer1.setScrollFactor(0.0, 1);
    this.battlegroundLayer2 = this.map.createStaticLayer('background2' /*layer name from json*/, this.background2);
    this.battlegroundLayer2.setScrollFactor(0.2, 1);
    this.battlegroundLayer3 = this.map.createStaticLayer('background3' /*layer name from json*/, this.background3);
    this.battlegroundLayer3.setScrollFactor(0.4, 1);
    this.battlegroundLayer4 = this.map.createStaticLayer('background4' /*layer name from json*/, this.background4);
    this.battlegroundLayer4.setScrollFactor(0.6, 1);

    this.map.createStaticLayer('background' /*layer name from json*/, [this.groundTiles, this.groundTiles2]);

    this.groudLayer = this.map.createStaticLayer('ground' /*layer name from json*/, this.groundTiles);
    this.groudLayer.setCollisionBetween(1, 150, true); //64

    this.map.createStaticLayer('foreground' /*layer name from json*/, [this.groundTiles, this.groundTiles2]);
    
    
    // var debug = this.add.graphics();
    // this.groudLayer.renderDebug(debug, {});

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    //ca să nu dea cu capul de cer
    this.physics.world.setBoundsCollision(true, true, false, true);

  }

  state = 'idle';

  update() {
    if(!(this.hero.body instanceof Phaser.Physics.Arcade.Body)) {
      return;
    }
    if(this.keyLeft.isUp && this.keyRight.isUp && this.hero.body.onFloor() && this.state != 'idle') {
      this.state = 'idle';
      this.hero.body.setAccelerationX(0);
      this.hero.anims.play('hero-idle');
    }
    
    if(this.keyLeft.isDown && this.hero.body.onFloor() && this.keyShift.isUp) {
      this.hero.body.setMaxVelocity(200, 400);
      this.hero.body.setAccelerationX(-500);
      this.hero.body.setOffset(85-27-33,57);
      this.hero.setFlipX(true);
      if(this.state != 'walk') {
        this.hero.anims.play('hero-walk');
      }
      this.state = 'walk';
    } 
    
    if(this.keyLeft.isDown && this.hero.body.onFloor() && this.keyShift.isDown) {
      this.hero.body.setMaxVelocity(400, 400);
      this.hero.body.setAccelerationX(-500);
      this.hero.body.setOffset(85-27-33, 57);
      this.hero.setFlipX(true);
      if(this.state != 'run') {
        this.hero.anims.play('hero-run');
      }
      this.state = 'run';
    }

    if(this.keyRight.isDown && this.hero.body.onFloor() && this.keyShift.isUp) {
      this.hero.body.setMaxVelocity(200, 400);
      this.hero.body.setAccelerationX(500);
      this.hero.body.setOffset(27,57);
      this.hero.setFlipX(false);
      if(this.state != 'walk') {
        this.hero.anims.play('hero-walk');
      }
      this.state = 'walk';
    }

    if(this.keyRight.isDown && this.hero.body.onFloor() && this.keyShift.isDown) {
      this.hero.body.setMaxVelocity(400, 400);
      this.hero.body.setAccelerationX(500);
      this.hero.body.setOffset(27,57);
      this.hero.setFlipX(false);
      if(this.state != 'run') {
        this.hero.anims.play('hero-run');
      }
      this.state = 'run';
    }

    var justDown = Phaser.Input.Keyboard.JustDown(this.keySpace);

    if(justDown && this.state != 'jump' && this.state != 'high-jump') {
      this.hero.body.setVelocityY(-250);
      this.state = 'jump';
      justDown = false;
      this.hero.anims.play('hero-jump');
    }

    if(justDown && this.state == 'jump') {
      this.hero.body.setVelocityY(-400);
      this.state = 'high-jump';
      this.hero.anims.play('hero-high-jump');
    }

    if(!this.hero.body.onFloor() && !(this.state == 'jump' || this.state == 'high-jump') && this.hero.body.velocity.y > 0 && this.state != 'fall') {
      this.state = 'fall';
      this.hero.anims.play('hero-fall');
    }

    if(this.state == 'jump' || this.state == 'high-jump' || this.state == 'fall') {
      if(this.keyRight.isDown) {
        this.hero.setFlipX(false);
        this.hero.body.setAccelerationX(500);
      }
      if(this.keyLeft.isDown) {
        this.hero.setFlipX(true);
        this.hero.body.setAccelerationX(-500);
      }
    }


    //console.log(this.state);

  }

}

export default Game;