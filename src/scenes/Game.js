/// <reference path="../../typings/phaser.d.ts" />
// @ts-check

import Phaser from 'phaser';
import Hero from '../entities/Hero';

class Game extends Phaser.Scene {
  
  preload() { 
    this.load.image('knight', 'assets/mage/mage.png');
    this.load.spritesheet('idle-spritesheet', 'assets/mage/idle/idle.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('walk-spritesheet', 'assets/mage/walk/walk.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('jump-spritesheet', 'assets/mage/jump/jump.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('high-jump-spritesheet', 'assets/mage/high_jump/high_jump.png', { frameWidth: 171, frameHeight: 128 });//43 added to the left
    this.load.spritesheet('run-spritesheet', 'assets/mage/run/run.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('fall-spritesheet', 'assets/mage/fall/fall.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('attack-spritesheet', 'assets/mage/attack/attack.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('fire-move-spritesheet', 'assets/mage/fire_extra/fire-move.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('fire-explosion-spritesheet', 'assets/mage/fire_extra/fire-explosion.png', { frameWidth: 128, frameHeight: 128 });

    this.load.tilemapTiledJSON('level1', 'assets/tilemaps.json');
    this.load.image('level1-sheet', 'assets/tiles/tiles.png ');
    this.load.image('brush-sheet', 'assets/tiles/brush-and-trees.png');

    this.load.image('background4', 'assets/backgrounds/background4.png');
    this.load.image('background3', 'assets/backgrounds/background3.png');
    this.load.image('background2', 'assets/backgrounds/background2.png');
    this.load.image('background1', 'assets/backgrounds/background1.png');

    this.load.image('keys-text', 'assets/keys.png');
  }
  
  
  create(data) {
    
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
      frameRate: 10,//5
      repeat: 0,
    });

    this.anims.create({
      key: 'hero-high-jump',
      frames: this.anims.generateFrameNumbers('high-jump-spritesheet', {}),
      frameRate: 20,//7
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
      frameRate: 10,//5
      repeat: 0,
    });

    this.anims.create({
      key: 'hero-attack',
      frames: this.anims.generateFrameNumbers('attack-spritesheet', {}),
      frameRate: 15,//7
      repeat: 0,
    });

    this.anims.create({
      key: 'bullet-move',
      frames: this.anims.generateFrameNumbers('fire-move-spritesheet', {}),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'bullet-explosion',
      frames: this.anims.generateFrameNumbers('fire-explosion-spritesheet', {}),
      frameRate: 20,
      repeat: 0,
    });
  

    this.addMap();

    this.hero = new Hero(this, 80, 700);
 
    this.children.moveTo(this.hero, this.children.getIndex(this.map.getLayer('foreground').tilemapLayer));

    this.physics.add.collider(this.hero, this.groudLayer);

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

    var image = this.add.image(950, 10, 'keys-text');
    image.setOrigin(0, 0);
    //image.setScale(0.3);
    image.setScrollFactor(0);
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


  update() {
    

  }

}

export default Game;