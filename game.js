const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 300,
    backgroundColor: '#ffffff',
    physics: { default: 'arcade', arcade: { gravity: { y: 500 }, debug: false } },
    scene: { preload, create, update }
};

let player, cursors, obstacles, gameOver, ground, scoreText, score = 0;

function preload() {}

function create() {
    this.add.rectangle(400, 150, 800, 300, 0xffffff);
    
    ground = this.add.rectangle(400, 290, 800, 20, 0x000000);
    this.physics.add.existing(ground, true);
    
    player = this.physics.add.sprite(100, 250, null).setOrigin(0.5, 1);
    player.setDisplaySize(30, 30).setTint(0x00ff00).setCollideWorldBounds(true);
    
    this.physics.add.collider(player, ground);
    
    obstacles = this.physics.add.group();
    this.physics.add.collider(obstacles, ground);
    
    cursors = this.input.keyboard.createCursorKeys();
    
    // Texto de pontuação
    scoreText = this.add.text(16, 16, 'Pontos: 0', { fontSize: '32px', fill: '#000' });
    
    // Gerar obstáculos a cada 1 segundo
    this.time.addEvent({ delay: 1000, loop: true, callback: spawnObstacle, callbackScope: this });
    this.physics.add.overlap(player, obstacles, hitObstacle, null, this);
}

function update() {
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-250); // Pulo pequeno e rápido
    }

    // Atualizar a pontuação mais rapidamente
    if (!gameOver) {
        score += 1;
        scoreText.setText('Pontos: ' + score);
    }
}

function spawnObstacle() {
    if (gameOver) return;
    let obstacle = obstacles.create(800, 260, null).setOrigin(0.5, 1);
    obstacle.setDisplaySize(30, 30).setTint(0x0000ff);
    obstacle.setVelocityX(-300); // Aumento a velocidade dos obstáculos
    obstacle.body.allowGravity = false;
}

function hitObstacle() {
    if (gameOver) return;
    this.physics.pause();
    player.setTint(0xff0000);
    scoreText.setText('Game Over! Pontos: ' + score);
    gameOver = true;
}

const game = new Phaser.Game(config);
