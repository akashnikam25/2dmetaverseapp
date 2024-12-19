export function createAnimation(sprite: Phaser.GameObjects.Sprite){
  const animsFrameRate = 15
  sprite?.anims.create({
            key: 'nancy_idle_right',
            frames: sprite.anims.generateFrameNames('nancy', {
            start: 0,
            end: 5,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })
        sprite?.anims.create({
            key: 'nancy_idle_up',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 6,
            end: 11,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })

        sprite?.anims.create({
            key: 'nancy_idle_left',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 12,
            end: 17,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })

        sprite?.anims.create({
            key: 'nancy_idle_down',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 18,
            end: 23,
            }),
            repeat: -1,
            frameRate: animsFrameRate * 0.6,
        })

        sprite?.anims.create({
            key: 'nancy_run_right',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 24,
            end: 29,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_run_up',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 30,
            end: 35,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_run_left',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 36,
            end: 41,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_run_down',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 42,
            end: 47,
            }),
            repeat: -1,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_sit_down',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 48,
            end: 48,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_sit_left',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 49,
            end: 49,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_sit_right',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 50,
            end: 50,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })

        sprite?.anims.create({
            key: 'nancy_sit_up',
            frames: sprite?.anims.generateFrameNames('nancy', {
            start: 51,
            end: 51,
            }),
            repeat: 0,
            frameRate: animsFrameRate,
        })
}