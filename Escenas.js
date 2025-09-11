import { Personaje, Enemigo } from './Clases.js';

////////////////////////////////////////////////////////////////////////////////////
export class EscenaInicio extends Phaser.Scene {
    constructor() {
        super('EscenaInicio');
    }

    preload() {
        // Aquí cargas tu imagen de inicio
        this.load.image('imagenInicio', 'Assets/Inicio.png');
    }

    create() {
    // Fondo principal
    let bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'imagenInicio');
    bg.displayWidth = this.sys.game.config.width;
    bg.displayHeight = this.sys.game.config.height;

    // Posición del botón (esquina superior derecha)
    const x = this.sys.game.config.width - 120;
    const y = 60;
    const buttonWidth = 160;
    const buttonHeight = 60;

    // === CREAR TEXTURA MEDIEVAL (Gradiente rojo vino) ===
    let rt = this.textures.createCanvas('gradienteBtn', buttonWidth, buttonHeight);
    let ctx = rt.getContext();

    let grd = ctx.createLinearGradient(0, 0, 0, buttonHeight);
    grd.addColorStop(0, '#8b0000'); // vino oscuro
    grd.addColorStop(1, '#5a0000'); // rojo profundo

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, buttonWidth, buttonHeight);

    rt.refresh();

    // Fondo del botón (imagen con gradiente)
    let buttonBg = this.add.image(x, y, 'gradienteBtn').setOrigin(0.5);

    // Borde dorado medieval
    let border = this.add.graphics();
    border.lineStyle(4, 0x8b0000, 1); // dorado
    border.strokeRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 8);

    // Texto estilo medieval
    const botonIniciar = this.add.text(x, y, 'COMENZAR', {
        fontSize: '26px',
        fontFamily: 'Cinzel Decorative, serif', // fuente medieval (cárgala en index.html)
        color: '#f5e6c4', // tono pergamino
        fontStyle: 'bold'
    }).setOrigin(0.5);

    // === Zona interactiva ===
    let buttonZone = this.add.zone(x, y, buttonWidth, buttonHeight).setOrigin(0.5).setInteractive();

    // Hover medieval
    buttonZone.on('pointerover', () => {
        let ctx2 = rt.getContext();
        let grd2 = ctx2.createLinearGradient(0, 0, 0, buttonHeight);
        grd2.addColorStop(0, '#cc0000'); // rojo encendido
        grd2.addColorStop(1, '#8b0000'); // vino oscuro
        ctx2.fillStyle = grd2;
        ctx2.fillRect(0, 0, buttonWidth, buttonHeight);
        rt.refresh();

        botonIniciar.setColor('#fff4d1'); // texto más brillante
    });

    buttonZone.on('pointerout', () => {
        let ctx3 = rt.getContext();
        let grd3 = ctx3.createLinearGradient(0, 0, 0, buttonHeight);
        grd3.addColorStop(0, '#8b0000'); 
        grd3.addColorStop(1, '#5a0000'); 
        ctx3.fillStyle = grd3;
        ctx3.fillRect(0, 0, buttonWidth, buttonHeight);
        rt.refresh();

        botonIniciar.setColor('#f5e6c4'); // vuelve al tono pergamino
    });

    // Click para iniciar
    buttonZone.on('pointerdown', () => {
        this.scene.start('IntroScene');
    });
}


}


//////////////////////////////////////////////////////////////////////////////////////////

export class Escena extends Phaser.Scene {
  constructor() {
    super('EscenaJuego');
  }

  preload() {
    this.load.image('fondo', 'Assets/fondoInicio.png'); 
    this.load.image('camino', 'Assets/camino.png');
    this.load.spritesheet('heroe_abajo', 'Assets/abajo_heroe.png', {
        frameWidth: 135, 
        frameHeight: 200
    });
    this.load.spritesheet('heroe_arriba', 'Assets/arriba_heroe.png', {
        frameWidth: 135, 
        frameHeight: 200
    });
    this.load.spritesheet('heroe_derecha', 'Assets/derecha_heroe.png', {
        frameWidth: 135, 
        frameHeight: 200
    });
    this.load.spritesheet('heroe_izquierda', 'Assets/izquierda_heroe.png', {
        frameWidth: 135, 
        frameHeight: 200
    });
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
    this.heroeSprite = this.physics.add.sprite(400, 250, 'heroe_abajo', 0);
    this.heroeSprite.setScale(0.5);

    this.heroeSprite.setCollideWorldBounds(true);
    this.anims.create({
        key: 'caminar_abajo',
        frames: this.anims.generateFrameNumbers('heroe_abajo', { frames: [1,2,3]}),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'caminar_arriba',
        frames: this.anims.generateFrameNumbers('heroe_arriba', { frames: [1,2,3]}),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'caminar_derecha',
        frames: this.anims.generateFrameNumbers('heroe_derecha', { frames: [0,2,3]}),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'caminar_izquierda',
        frames: this.anims.generateFrameNumbers('heroe_izquierda', { frames: [0,1,3]}),
        frameRate: 8,
        repeat: -1
    });

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
  }

  update(time, delta) {
    this.heroeSprite.setVelocity(0);

    if(this.heroe.vida>0)
    {
        if(this.cursors.left.isDown) {
            this.heroeSprite.setVelocityX(-160);
            this.heroeSprite.anims.play('caminar_izquierda', true);
        } else if(this.cursors.right.isDown) {
            this.heroeSprite.setVelocityX(160);
            this.heroeSprite.anims.play('caminar_derecha', true);
        } else if(this.cursors.up.isDown) {
            this.heroeSprite.setVelocityY(-160);
            this.heroeSprite.anims.play('caminar_arriba', true);
        } else if(this.cursors.down.isDown) {
            this.heroeSprite.setVelocityY(160);
            this.heroeSprite.anims.play('caminar_abajo', true);
        } else {
        this.heroeSprite.anims.stop(); 
        }  
    }
    
  }
}

export class Mazmorra1 extends Phaser.Scene {
    constructor() {
        super('Mazmorra1');
    }

    preload() {
        this.load.image('mazmorra1', 'Assets/mazmorra1.jpg');
        this.load.spritesheet('duende', 'Assets/duende_ataque.png', {
            frameWidth: 80, 
            frameHeight: 84
        });
        this.load.spritesheet('duende_muerte', 'Assets/duendes.png', {
            frameWidth: 97, 
            frameHeight: 87
        });
    }

    create(data) {
        let bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'mazmorra1');
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        const { personaje } = data;
        this.heroe = personaje;

        this.heroeSprite = this.physics.add.sprite(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'heroe_abajo',0
        );
        this.heroeSprite.setScale(0.5);

        this.duendes = this.physics.add.group(); 
        this.anims.create({
            key: 'AnimacionAtaqueDuende',
            frames: this.anims.generateFrameNumbers('duende', { frames: [0,1,2,3] }),
            frameRate: 3,
            repeat: 0
        });
        this.anims.create({
            key: 'AnimacionMuerteDuende',
            frames: this.anims.generateFrameNumbers('duende_muerte', { frames: [29,29] }),
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

    if(this.heroe.vida>0)
    {
        if(this.cursors.left.isDown) {
            this.heroeSprite.setVelocityX(-160);
            this.heroeSprite.anims.play('caminar_izquierda', true);
        } else if(this.cursors.right.isDown) {
            this.heroeSprite.setVelocityX(160);
            this.heroeSprite.anims.play('caminar_derecha', true);
        } else if(this.cursors.up.isDown) {
            this.heroeSprite.setVelocityY(-160);
            this.heroeSprite.anims.play('caminar_arriba', true);
        } else if(this.cursors.down.isDown) {
            this.heroeSprite.setVelocityY(160);
            this.heroeSprite.anims.play('caminar_abajo', true);
        } else {
        this.heroeSprite.anims.stop(); 
        }  
    }
    
  }

    crearDuende(x, y) {
    const duende = new Enemigo('Duende', 10, 'tierra', 10, 'pocion1');
    const sprite = this.physics.add.sprite(x, y, 'duende', 0);
    sprite.setCollideWorldBounds(true);
    sprite.setScale(1.3);

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

