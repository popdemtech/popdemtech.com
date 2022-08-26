// Sprite dimensions
var groundDim = { x: 400, y: 32 };
var photonDim = { x: 14, y: 13 };

// Game Configuration
var gameHeight = 480;
var areaTop = groundDim.y * 2;
var areaBottom = gameHeight - (groundDim.y * 2);
var playableHeight = areaBottom - areaTop;

var phaserConfig = {
    type: Phaser.AUTO,
    parent: "game",
    width: 400,
    height: gameHeight,
    backgroundColor: "#000000",
    scene: {
        init: initScene,
        preload: preloadScene,
        create: createScene,
        update: updateScene
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
};

var game = new Phaser.Game(phaserConfig);
var platforms;
var photons;
var star;
var scoreText;

var gameOver = false;
var timeSinceSpawn = 0;
var timeBetweenSpawn = 3000;
var timeElapsed = 0;
var maxBeamLength = 20;
var isClicking = false;
var swipeDirection;
var gameWidth;
var screenCenterX, screenCenterY;

function initScene() { }

function preloadScene() {
    this.load.svg("star", "/assets/img/games/white-star.svg");
    this.load.image("ground", "/assets/img/games/white-platform.png");
    this.load.image("photon", "/assets/img/games/photon.png");
}

function createScene() {
    gameWidth = this.sys.game.scale.gameSize.width;
    screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    platforms = this.physics.add.staticGroup();
    platforms.create(groundDim.x, groundDim.y, 'ground').setScale(2).refreshBody();
    platforms.create(groundDim.x, gameHeight - groundDim.y, 'ground').setScale(2).refreshBody();

    star = this.physics.add.sprite(gameWidth / 2, 240, 'star');
    star.displayWidth = star.displayWidth * .05;
    star.scaleY = star.scaleX;

    photons = this.physics.add.group();

    this.physics.add.collider(star, platforms);
    this.physics.add.overlap(star, photons, collectPhoton, null, this);
}

function updateScene(time, delta) {
    if (gameOver) {
        return;
    }

    // Generate photons
    timeSinceSpawn += delta;
    timeElapsed += delta;
    if (timeSinceSpawn >= timeBetweenSpawn) {
        var photon;
        var beamY = areaTop + Math.ceil(Math.random() * playableHeight);
        var beamLength = Math.ceil(Math.random() * maxBeamLength);

        for (var i = 0; i < beamLength; i++) {
            photon = photons.create(gameWidth + i*photonDim.x, beamY, 'photon');
            photon.setVelocityX(-100);
        }
        timeSinceSpawn = 0;
    }

    // End game if star is full
    if (star.displayHeight >= playableHeight) {
        this.physics.pause();
        var totalTime = parseFloat(timeElapsed / 1000).toFixed(2);
        scoreText = this.add.text(screenCenterX, screenCenterY, 'Win. Total time: ' + totalTime).setOrigin(0.5);
        scoreText.setBackgroundColor('black');
        gameOver = true;
    }

    // Update star movement
    var movementDirection;
    if(!this.input.activePointer.isDown && isClicking == true) {
        // Swipe
        if(Math.abs(this.input.activePointer.upY - this.input.activePointer.downY) >= 50) {
            movementDirection = this.input.activePointer.upY < this.input.activePointer.downY ? 'up' : 'down';
        // Click
        } else {
            movementDirection = this.input.activePointer.position.y > star.y ? 'down' : 'up';
        }
        isClicking = false;
    } else if(this.input.activePointer.isDown && isClicking == false) {
        isClicking = true;
    }
    if(movementDirection == "down") {
        star.setVelocityY(100);
    } else if(movementDirection == "up") {
        star.setVelocityY(-100)
    }
}

function collectPhoton(star, photon) {
    photon.disableBody(true, true);
    star.displayWidth = star.displayWidth * 1.05;
    star.scaleY = star.scaleX;
}