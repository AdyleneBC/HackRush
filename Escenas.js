import { Personaje, Enemigo } from './Clases.js';

export class Escena extends Phaser.Scene {
  constructor() {
    super('EscenaJuego');
  }

  preload() {
    this.load.image('fondo', 'Assets/fondoInicio.png'); 
    this.load.image('camino', 'Assets/camino.png');
    this.load.image('heroe', 'Assets/Personaje principal.jpg');
    this.load.image('enemigo', 'Assets/Personaje principal.jpg');
   

  }

  create() {
    let bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondo');
    bg.displayWidth = this.sys.game.config.width;
    bg.displayHeight = this.sys.game.config.height;

    ///delimitantes
    const platforms = this.physics.add.staticGroup();
    platforms.create(370, 100, 'camino').setScale(0,2).refreshBody();
    platforms.create(450, 300, 'camino').setScale(0,0.55).refreshBody();

    this.heroe = new Personaje(100, 20);
    this.heroeSprite = this.physics.add.sprite(400, 250, 'heroe');
    this.heroeSprite.setCollideWorldBounds(true);
    console.log(`El héroe ${this.heroe.nombre} está listo en la escena.`);

    this.enemigo = new Enemigo('Orco', 50, 'tierra', 15, 'pocion1');
    this.enemigoSprite = this.physics.add.sprite(500, 400, 'enemigo');
    this.enemigoSprite.setCollideWorldBounds(true);
    console.log(`El enemigo ${this.enemigo.nombre} está listo en la escena.`);

    this.cursors = this.input.keyboard.createCursorKeys();
     this.physics.add.collider(this.heroeSprite, platforms);

    const botonatacar = this.add.text(400, 100, 'Enemigo ataca heroe', { 
        fontSize: '32px', 
        fill: '#fff',
        backgroundColor: '#8B0000', 
        padding: 10
    }).setOrigin(0.5);
    botonatacar.setInteractive();
    botonatacar.on('pointerdown', () => {
        this.enemigo.atacar(this.heroe);
        console.log(`Vida actual del héroe: ${this.heroe.vida}`);
    });
  }

  update(time, delta) {
    this.heroeSprite.setVelocity(0);

    if(this.heroe.vida!=0)
    {
        if (this.cursors.left.isDown) {
            this.heroeSprite.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.heroeSprite.setVelocityX(160); 
        }
        if (this.cursors.up.isDown) {
            this.heroeSprite.setVelocityY(-160); // Mueve hacia arriba
        } else if (this.cursors.down.isDown) {
            this.heroeSprite.setVelocityY(160); // Mueve hacia abajo
        }    
    }
    
  }
}


export class Mazmorra1 extends Phaser.Scene {
  constructor() {
    super('EscenaJuego');
  }

  preload() {
    this.load.image('fondo', 'Assets/fondoInicio.png'); 
    this.load.image('camino', 'Assets/camino.png');
    this.load.image('heroe', 'Assets/Personaje principal.jpg');
    this.load.image('enemigo', 'Assets/Personaje principal.jpg');
   

  }

  create() {
    let bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondo');
    bg.displayWidth = this.sys.game.config.width;
    bg.displayHeight = this.sys.game.config.height;

    ///delimitantes
    const platforms = this.physics.add.staticGroup();
    platforms.create(370, 100, 'camino').setScale(0,2).refreshBody();
    platforms.create(450, 300, 'camino').setScale(0,0.55).refreshBody();

    this.heroe = new Personaje(100, 20);
    this.heroeSprite = this.physics.add.sprite(400, 250, 'heroe');
    this.heroeSprite.setCollideWorldBounds(true);
    console.log(`El héroe ${this.heroe.nombre} está listo en la escena.`);

    this.enemigo = new Enemigo('Orco', 50, 'tierra', 15, 'pocion1');
    this.enemigoSprite = this.physics.add.sprite(500, 400, 'enemigo');
    this.enemigoSprite.setCollideWorldBounds(true);
    console.log(`El enemigo ${this.enemigo.nombre} está listo en la escena.`);

    this.cursors = this.input.keyboard.createCursorKeys();
     this.physics.add.collider(this.heroeSprite, platforms);

    const botonatacar = this.add.text(400, 100, 'Enemigo ataca heroe', { 
        fontSize: '32px', 
        fill: '#fff',
        backgroundColor: '#8B0000', 
        padding: 10
    }).setOrigin(0.5);
    botonatacar.setInteractive();
    botonatacar.on('pointerdown', () => {
        this.enemigo.atacar(this.heroe);
        console.log(`Vida actual del héroe: ${this.heroe.vida}`);
    });
  }

  update(time, delta) {
    this.heroeSprite.setVelocity(0);

    if(this.heroe.vida!=0)
    {
        if (this.cursors.left.isDown) {
            this.heroeSprite.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.heroeSprite.setVelocityX(160); 
        }
        if (this.cursors.up.isDown) {
            this.heroeSprite.setVelocityY(-160); // Mueve hacia arriba
        } else if (this.cursors.down.isDown) {
            this.heroeSprite.setVelocityY(160); // Mueve hacia abajo
        }    
    }
    
  }
}

