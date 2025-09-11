import { Personaje, Enemigo } from './Clases.js';
import { IntroScene } from './IntroScene.js'; /*Se agregó */


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
    platforms.create(370, 100, 'camino').setScale(0.05,2).refreshBody();
    platforms.create(450, 300, 'camino').setScale(0.05,0.55).refreshBody();

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

    const botonMazmorra1 = this.add.text(400, 100, 'Mazmorra1', { 
        fontSize: '18px', 
        fill: '#fff',
        backgroundColor: '#8B0000', 
        padding: 10
    }).setOrigin(0.5);
    botonMazmorra1.setInteractive();
    botonMazmorra1.on('pointerdown', () => {
        this.scene.start('Mazmorra1', {
        personaje: this.heroe,
        });
    });


/*Se agregó */
    const btnTutorial = this.add.text(16, 16, 'Ver tutorial otra vez', {
  fontFamily: 'Arial',
  fontSize: '16px',
  color: '#ffffff',
  backgroundColor: '#00000088',
  padding: { x: 10, y: 6 }
}).setOrigin(0, 0).setInteractive({ useHandCursor: true });

btnTutorial.on('pointerdown', () => {
  try { localStorage.removeItem('hr_seen_intro'); } catch {}
  if (!this.scene.get('IntroScene')) {
    this.scene.add('IntroScene', IntroScene, true); // lanza Intro
  } else {
    this.scene.launch('IntroScene');
  }
  this.scene.pause(); // pausa la escena actual mientras corre la Intro
}); /*Termina */

  }

  update(time, delta) {
    this.heroeSprite.setVelocity(0);

    if(this.heroe.vida>0)
    {
        if (this.cursors.left.isDown) {
            this.heroeSprite.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.heroeSprite.setVelocityX(160); 
        }
        if (this.cursors.up.isDown) {
            this.heroeSprite.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.heroeSprite.setVelocityY(160);
        }    
    }
    
  }
}

export class Mazmorra1 extends Phaser.Scene {
    constructor() {
        super('Mazmorra1');
    }

    preload() {
        this.load.image('fondo', 'Assets/fondoInicio.png');
        this.load.spritesheet('duende', 'Assets/duendes.png', {
            frameWidth: 97, 
            frameHeight: 87
        });
    }

    create(data) {
        let bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondo');
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        const { personaje } = data;
        this.heroe = personaje;

        this.heroeSprite = this.physics.add.sprite(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'heroe'
        );
        this.duendes = this.physics.add.group(); 
        this.anims.create({
            key: 'AnimacionAtaqueDuende',
            frames: this.anims.generateFrameNumbers('duende', { frames: [9,15,14,13,9] }),
            frameRate: 3,
            repeat: 0
        });
        this.anims.create({
            key: 'AnimacionMuerteDuende',
            frames: this.anims.generateFrameNumbers('duende', { frames: [9,29,29] }),
            frameRate: 0.6,
            repeat: 0
        }); 

        this.time.addEvent({
            delay: 3000,
            loop: false,
            callback: () => {
                if(this.duendes.getChildren().length<1){
                    const centroX = this.heroeSprite.x;
                    const centroY = this.heroeSprite.y;
                    const angle = Phaser.Math.FloatBetween(-Math.PI / 4, Math.PI / 4);
                    const radius = Phaser.Math.Between(100, 150);

                    const x = centroX + Math.cos(angle) * radius;
                    const y = centroY + Math.sin(angle) * radius;
 
                    this.crearDuende(x, y);   
                }
                
            }
        });



        const botonComando = this.add.text(400, 500, 'Abrir libro', {
            fontSize: '18px',
            fill: '#fff',
            backgroundColor: '#333333',
            padding: 10
        }).setOrigin(0.5);
        botonComando.setInteractive();

        const textarea = this.add.dom(400, 550).createElement('div', 'background-color: #333; padding: 10px; border-radius: 8px; display: none;')
            .setHTML(
                `
                <textarea id="commandInput" 
                placeholder="Escribe un comando..." 
                style="padding: 5px; border: none; border-radius: 4px; background-color: #555; color: white; width: 250px; height: 80px; resize: none; color: white;">
                </textarea>

                <button id="sendBtn" style="padding: 5px 10px; border: none; border-radius: 4px; background-color: #4CAF50; color: white; margin-left: 10px;">Enviar</button>
                `
            );
        const AreaTexto = textarea.node.querySelector('#commandInput');
        textarea.setVisible(false); 
        const sendBtn = textarea.node.querySelector('#sendBtn');
        
        botonComando.on('pointerdown', () => {
            if (textarea.visible) {
            textarea.setVisible(false);
            } else {
                textarea.setVisible(true);
                textarea.node.querySelector('#commandInput').focus();
            } 
        });

        sendBtn.addEventListener('click', () => {
            const commandInput = textarea.node.querySelector('#commandInput');
            const command = commandInput.value.toLowerCase().trim();
            if(command == 'select * from pociones where tipo="pocion1"') {
    this.duendes.getChildren().forEach(sprite => {
        if(sprite.enemigoRef && sprite.enemigoRef.vida > 0) {
            sprite.enemigoRef.recibirAtaque('pocion1');
            console.log(`¡Has atacado a un duende! Vida restante: ${sprite.enemigoRef.vida}`);
        }
    });
}

            console.log('Comando enviado:', command);
            commandInput.value = '';
            textarea.setVisible(false); 
        });

        AreaTexto.addEventListener('focus', () => {
            this.input.keyboard.enabled = false;
            this.input.keyboard.manager.enabled = false;
        });

        AreaTexto.addEventListener('blur', () => {
            this.input.keyboard.enabled = true;
            this.input.keyboard.manager.enabled = true;
        });

        
        

        this.heroeSprite.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        this.heroeSprite.setVelocity(0);
        if (this.heroe.vida > 0) {
            if (this.cursors.left.isDown) {
                this.heroeSprite.setVelocityX(-160);
            } else if (this.cursors.right.isDown) {
                this.heroeSprite.setVelocityX(160);
            }
            if (this.cursors.up.isDown) {
                this.heroeSprite.setVelocityY(-160);
            } else if (this.cursors.down.isDown) {
                this.heroeSprite.setVelocityY(160);
            }
        }
    }

    crearDuende(x, y) {
    const duende = new Enemigo('Duende', 10, 'tierra', 10, 'pocion1');
    const sprite = this.physics.add.sprite(x, y, 'duende', 9);
    sprite.setCollideWorldBounds(true);

    duende.sprite = sprite;
    sprite.enemigoRef = duende; 
    this.duendes.add(sprite);

    // 🔴 Estado para evitar múltiples muertes
    sprite.estaMuerto = false;

    // Ataque automático
    duende.attackEvent = this.time.addEvent({
        delay: 3000,  
        loop: true,
        callback: () => {
            if (duende.vida > 0 && !sprite.estaMuerto) {
                duende.atacar(this.heroe);
                sprite.play('AnimacionAtaqueDuende');
            }
        }
    });

    // 👉 REVISAR vida periódicamente
    this.time.addEvent({
        delay: 200,
        loop: true,
        callback: () => {
            if (duende.vida <= 0 && !sprite.estaMuerto) {
                sprite.estaMuerto = true; // marcar como muerto
                sprite.play('AnimacionMuerteDuende');
                
                // Esperar a que acabe la animación y luego eliminarlo
                sprite.once('animationcomplete', (anim) => {
                    if (anim.key === 'AnimacionMuerteDuende') {
                        sprite.destroy(); // ahora sí lo borramos del juego
                        console.log("💀 Duende eliminado");
                    }
                });
            }
        }
    });

    return duende;
}



}

