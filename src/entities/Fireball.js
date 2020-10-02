/// <reference path="../../typings/phaser.d.ts" />
// @ts-check

class Fireball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, flipped) {
        super(scene, x, y, 'fire-move-spritesheet');

        scene.add.existing(this);
        scene.physics.add.existing(this)
        this.anims.play('bullet-move');
        this.body.setAllowGravity(false);

        this.body.setSize(25, 39);
        if (flipped) {
            this.setFlipX(true);
            this.body.setVelocityX(-400);
            this.x = this.x - 50;
            this.body.setOffset(128 - 44 - 25, 54);
        } else {
            this.body.setVelocityX(400);
            this.x = this.x + 50;
            this.body.setOffset(44, 54);
        }

        var tile = scene.groudLayer.getTileAtWorldXY(this.x - (128 / 2 - this.body.offset.x), this.y - (128 / 2 - this.body.offset.y));
        var tile2 = scene.groudLayer.getTileAtWorldXY(this.x - (128 / 2 - this.body.offset.x), this.y + (this.body.offset.y + this.body.height - 128 / 2));
        if (tile || tile2) {
            this.body.setVelocityX(0);
            this.colided();
            return;
        }
        // const platform2 = this.add.rectangle(this.x - (128/2 - this.body.offset.x), this.y - (128/2 - this.body.offset.y), 10, 10, 0x4BCB7C);
        // this.physics.add.existing(platform2, true);
        // const platform = this.add.rectangle(this.x - (128/2 - this.body.offset.x) , this.y + (this.body.offset.y + this.body.height - 128/2), 10, 10, 0x0000ff);
        // this.physics.add.existing(platform, true);

        scene.physics.add.collider(this, scene.groudLayer, this.colided, null, this);

        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;

        this.body.world.on(Phaser.Physics.Arcade.Events.WORLD_BOUNDS, this.colided, this);

        if (!scene.counter) {
            scene.counter = 0;
        }
        this.name = scene.counter;
        scene.counter++;

    }

    colided(o1) {
        if (o1 instanceof Phaser.Physics.Arcade.Body) {
            if (this.name != o1.gameObject.name) {
                return;
            }
        }
        this.anims.play('bullet-explosion');
        this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
            this.setVisible(false);
            this.destroy()
        });
    }
}

export default Fireball;