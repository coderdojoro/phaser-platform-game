/// <reference path="../../typings/phaser.d.ts" />
// @ts-check
import Fireball from '../entities/Fireball';

class Hero extends Phaser.GameObjects.Sprite {

    static HeroTypes = Object.freeze({
        MAGE: "mage",
        ROGUE: "rogue",
        KNIGHT: "knight"
    });

    keyLeft;
    keyRight;
    keyShift;
    keySpace;
    keyX;

    heroState = 'fall';
    animState = 'idle';
    lastFire = 0;

    heroType;

    constructor(scene, x, y, heroType) {
        super(scene, x, y, 'idle-spritesheet');

        this.scene = scene;
        this.heroType = heroType;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            throw "Not body";
        }

        if (this.heroType == Hero.HeroTypes.MAGE) {
            this.sizeX = 33;
            this.sizeY = 54;
            this.offsetX = 70;
            this.offsetY = 57;
            this.projectileY = 0;
        } else if (this.heroType == Hero.HeroTypes.ROGUE) {
            this.sizeX = 31;
            this.sizeY = 52;
            this.offsetX = 72;
            this.offsetY = 58;
            this.projectileY = 8;
        } else if (this.heroType == Hero.HeroTypes.KNIGHT) {
            this.sizeX = 32;
            this.sizeY = 50;
            this.offsetX = 73;
            this.offsetY = 58;
            this.projectileY = +1;
        }

        this.body.setSize(this.sizeX, this.sizeY);
        this.body.setOffset(this.offsetX, this.offsetY);

        this.body.setCollideWorldBounds(true);
        this.body.setDragX(2000);//1150
        this.body.setMaxVelocity(200, 400);

        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyShift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyX = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.updateHeroState();
        this.updateAnimationState();
        // console.log("hero: " + this.heroState + ", animation: " + this.animState); 
    }

    updateHeroState() {
        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }

        let isOnFloor = this.body.velocity.y == 0 && this.body.onFloor();

        if (this.keyLeft.isUp && this.keyRight.isUp && isOnFloor && this.heroState != 'landing') {
            this.body.setAccelerationX(0);
            if (this.heroState == 'jump' || this.heroState == 'double-jump' || this.heroState == 'fall') {
                this.heroState = 'landing';
            } else {
                this.heroState = 'idle';
            }
        }

        if (this.keyLeft.isDown && this.keyShift.isUp && isOnFloor) {
            this.body.setMaxVelocity(200, 400);
            this.body.setAccelerationX(-500);
            this.body.setOffset(171 - this.offsetX - this.sizeX, this.offsetY);
            this.setFlipX(true);
            this.heroState = 'walk';
        }

        if (this.keyLeft.isDown && this.keyShift.isDown && isOnFloor) {
            this.body.setMaxVelocity(400, 400);
            this.body.setAccelerationX(-500);
            this.body.setOffset(171 - this.offsetX - this.sizeX, this.offsetY);
            this.setFlipX(true);
            this.heroState = 'run';
        }

        if (this.keyRight.isDown && this.keyShift.isUp && isOnFloor) {
            this.body.setMaxVelocity(200, 400);
            this.body.setAccelerationX(500);
            this.body.setOffset(this.offsetX, this.offsetY);
            this.setFlipX(false);
            this.heroState = 'walk';

        }

        if (this.keyRight.isDown && this.keyShift.isDown && isOnFloor) {
            this.body.setMaxVelocity(400, 400);
            this.body.setAccelerationX(500);
            this.body.setOffset(this.offsetX, this.offsetY);
            this.setFlipX(false);
            this.heroState = 'run';
        }

        var justDown = Phaser.Input.Keyboard.JustDown(this.keySpace);

        if (justDown && this.heroState != 'jump' && this.heroState != 'double-jump' && this.heroState != 'fall') {
            this.body.setVelocityY(-250);
            justDown = false;
            this.heroState = 'jump';
        }
        if (justDown && this.heroState == 'jump') {
            this.body.setVelocityY(-400);
            this.heroState = 'double-jump';
        }
        if (!this.body.onFloor() && !(this.heroState == 'jump' || this.heroState == 'double-jump') && this.body.velocity.y > 0 && this.heroState != 'fall' && this.animState != 'attack') {
            this.heroState = 'fall';
        }
        if (this.heroState == 'jump' || this.heroState == 'double-jump' || this.heroState == 'fall') {
            if (this.keyRight.isDown) {
                this.setFlipX(false);
                this.body.setAccelerationX(500);
            }
            if (this.keyLeft.isDown) {
                this.setFlipX(true);
                this.body.setAccelerationX(-500);
            }
        }

        // if (this.heroState == 'landing') {
        //     if(this.animState != 'landing') {
        //         this.langingAnimTimer = Date.now();
        //     } else {
        //         if(Date.now() - this.langingAnimTimer > 1000) {
        //             this.heroState = 'idle';
        //         }
        //     }
        // }
    }

    updateAnimationState() {
        if (this.heroState == 'idle' && this.animState != 'idle' && this.animState != 'attack') {
            this.anims.play('hero-idle');
            this.animState = 'idle';
        }

        if (this.keyX.isDown && Date.now() - this.lastFire > 600) {
            this.anims.play('hero-attack');
            this.animState = 'attack';
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                this.animState = 'after-attack';
                let y = this.y + this.projectileY;
                new Fireball(this.scene, this.x, y, this.flipX);
            }, this.scene);
            this.lastFire = Date.now();
        }

        if (this.heroState == 'walk' && this.animState != 'walk' && this.animState != 'attack') {
            this.animState = 'walk';
            this.anims.play('hero-walk');
        }

        if (this.heroState == 'run' && this.animState != 'run' && this.animState != 'attack') {
            this.animState = 'run';
            this.anims.play('hero-run');
        }

        if (this.heroState == 'jump' && this.animState != 'jump' && this.animState != 'attack') {
            this.animState = 'jump';
            this.anims.play('hero-jump');
        }
        if (this.heroState == 'double-jump' && this.animState != 'double-jump' && this.animState != 'attack') {
            this.animState = 'double-jump';
            this.anims.play('hero-double-jump');
        }
        if (this.heroState == 'fall' && this.animState != 'fall' && this.animState != 'attack') {
            this.animState = 'fall';
            this.anims.play('hero-fall');
        }
        if (this.heroState == 'landing' && this.animState != 'landing') {
            this.animState = 'landing';
            this.anims.play('hero-landing');
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                this.heroState = 'idle';
            })
        }
    }

}

export default Hero;