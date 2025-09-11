import { Personaje, Enemigo } from './Clases.js';

export class Escena extends Phaser.Scene {
  constructor() {
    super('EscenaJuego');
  }

  preload() {
    this.load.image('fondo', 'Assets/fondo_inicial.jpg'); 
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
    platforms.create(370, 100, 'camino').setScale(0,0).refreshBody();
    platforms.create(450, 300, 'camino').setScale(0,0).refreshBody();

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
    this.cursors = this.input.keyboard.createCursorKeys();
     this.physics.add.collider(this.heroeSprite, platforms);

    const botonMazmorra1 = this.add.text(130, 250, 'Mazmorra1', { 
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
this.duendesActivos = []; // array para guardar todos los duendes
this.limiteDuendes = 3;  // máximo de duendes que pueden aparecer
this.totalDuendesCreados = 0; // contador de duendes creados


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

        /*this.time.addEvent({
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
        });*/

        // Modal de introducción
// 1️⃣ Modal inicial
// Estado del tutorial
let tutorialStep = 0; // 0 = mostrar primer modal, 1 = crear tabla, 2 = agregar pocion, 3 = select

let duendeCongelado = null;

// 1️⃣ Modal inicial: bienvenido
const modalIntro = this.add.dom(this.cameras.main.width/2, this.cameras.main.height/2)
    .createElement('div', 'background-color: rgba(0,0,0,0.8); padding:20px; border-radius:10px; color:white; width:400px; text-align:center;')
    .setHTML(`
        <p>¡Esta es la Mazmorra 1! Prepárate para enfrentarte a un duende.</p>
        <button id="btnSiguiente">Siguiente</button>
    `);

const btnSiguiente = modalIntro.node.querySelector('#btnSiguiente');
btnSiguiente.addEventListener('click', () => {
    modalIntro.destroy();

    // Crear duende congelado
    const centroX = this.heroeSprite.x + 100;
    const centroY = this.heroeSprite.y;
    duendeCongelado = this.crearDuende(centroX, centroY, true);

    // Paso siguiente: mostrar modal de instrucciones para crear la tabla
    showNextModal();
});

// Crear textarea y botón
const textarea = this.add.dom(400, 550).createElement('div', 'background-color:#333; padding:10px; border-radius:8px; display:none;')
    .setHTML(`
        <textarea id="commandInput" placeholder="Escribe un comando..." style="padding:5px; border:none; border-radius:4px; background-color:#555; color:white; width:250px; height:80px; resize:none;"></textarea>
        <button id="sendBtn" style="padding:5px 10px; border:none; border-radius:4px; background-color:#4CAF50; color:white; margin-left:10px;">Enviar</button>
    `);

const AreaTexto = textarea.node.querySelector('#commandInput');
const sendBtn = textarea.node.querySelector('#sendBtn');

// Mostrar/ocultar textarea al presionar "Abrir libro"
const botonComando = this.add.text(400, 500, 'Abrir libro', { fontSize:'18px', fill:'#fff', backgroundColor:'#333', padding:10 }).setOrigin(0.5);
botonComando.setInteractive();
botonComando.on('pointerdown', () => {
    textarea.setVisible(!textarea.visible);
    if(textarea.visible) AreaTexto.focus();
});

// Bloquear controles del teclado mientras escribes
AreaTexto.addEventListener('focus', () => { this.input.keyboard.enabled = false; });
AreaTexto.addEventListener('blur', () => { this.input.keyboard.enabled = true; });

// Listener único de comando
sendBtn.addEventListener('click', () => {
    const command = AreaTexto.value.toLowerCase().trim();

    if(tutorialStep === 1 && command === 'create table pociones (tipo nvarchar(50))') {
        // Segundo modal: indica que agregues pocion
        showNextModal();
    } else if(tutorialStep === 2 && command === 'insert into pociones values ("pocion1")') {
        // Tercer modal: indica que hagas select
        this.heroe.agregarpocion('pocion1')
        showNextModal();
    } else if(tutorialStep === 3 && command === 'select * from pociones where tipo="pocion1"') {
        // Activar duende
        if(duendeCongelado) duendeCongelado.congelado = false;
        console.log("¡Duende activado!");
    }

    // Ejecutar ataque a duendes si comando es select
     // Ejecutar ataque a duendes si comando es select
    if(command === 'insert into pociones values ("pocion1")') {
        // Tercer modal: indica que hagas select
        this.heroe.agregarpocion('pocion1')

    }
if(command === 'select * from pociones where tipo="pocion1"') {
    if(this.heroe.buscarPocion('pocion1')) { 
        // Eliminar la poción usada
        this.heroe.usarPocion('pocion1');

        // Atacar a todos los duendes vivos
        this.duendes.getChildren().forEach(sprite => {
            if(sprite.enemigoRef && sprite.enemigoRef.vida > 0) {
                sprite.enemigoRef.recibirAtaque('pocion1');
                alert(`¡Rapido inserta mas pociones con el comando insert into pociones values ("pocion1")`);
                setTimeout(() => {
                    alert(`¡De prisa mata a los duendes con el comando select * from pociones where tipo="pocion1"`);
                }, 5000); // 1000 ms = 1 segundo
                
            }
        });
    } else {
        alert("No tienes esa poción para usar. Inserta una poción primero.");
        
    }
}
    

    AreaTexto.value = '';
    textarea.setVisible(false);
});

// Función para mostrar el siguiente modal según tutorialStep
const showNextModal = (step) => {
    let htmlContent = '';
    tutorialStep++;

    if(tutorialStep === 1)
        htmlContent = `<p>Primero, crea la tabla de pociones:</p><p>Usa: create table pociones (tipo nvarchar(50))</p><button id="btnNext">Continuar</button>`;
    if(tutorialStep === 2)
        htmlContent = `<p>Ahora, agrega una pocion:</p><p>Usa: insert into pociones values ("pocion1")</p><button id="btnNext">Continuar</button>`;
    if(tutorialStep === 3)
        htmlContent = `<p>Finalmente, haz un SELECT para atacar al duende:</p><p>Usa: select * from pociones where tipo="pocion1"</p><button id="btnNext">Continuar</button>`;

    const modal = this.add.dom(this.cameras.main.width/2, this.cameras.main.height/2)
        .createElement('div', 'background-color: rgba(0,0,0,0.8); padding:20px; border-radius:10px; color:white; width:400px; text-align:center;')
        .setHTML(htmlContent);

    const btnNext = modal.node.querySelector('#btnNext');
    btnNext.addEventListener('click', () => {
        modal.destroy();
        if(tutorialStep === 3) textarea.setVisible(true); // activar textarea para el SELECT
    });
};


        
        
        AreaTexto.addEventListener('focus', () => { this.input.keyboard.enabled = false; });
AreaTexto.addEventListener('blur', () => { this.input.keyboard.enabled = true; });

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

    crearDuende(x, y, congelado = false) {
    const duende = new Enemigo('Duende', 10, 'tierra', 10, 'pocion1');
    const sprite = this.physics.add.sprite(x, y, 'duende', 0);
    sprite.setCollideWorldBounds(true);
    sprite.setScale(1.3);

    duende.sprite = sprite;
    sprite.enemigoRef = duende;
    this.duendes.add(sprite);
    this.duendesActivos.push(duende);

    sprite.estaMuerto = false;
    duende.congelado = congelado;

    duende.attackEvent = this.time.addEvent({
        delay: 8000,
        loop: true,
        callback: () => {
            if (duende.vida > 0 && !sprite.estaMuerto && !duende.congelado) {
                duende.atacar(this.heroe);
                sprite.play('AnimacionAtaqueDuende');
            }
        }
    });

    this.time.addEvent({
        delay: 200,
        loop: true,
        callback: () => {
            if (duende.vida <= 0 && !sprite.estaMuerto) {
                sprite.estaMuerto = true;
                sprite.play('AnimacionMuerteDuende');
                sprite.once('animationcomplete', () => {
    sprite.destroy();

    // Remover duende del array
    const index = this.duendesActivos.indexOf(duende);
    if (index > -1) this.duendesActivos.splice(index, 1);

    // Verificar si ya no quedan duendes activos y ya se crearon todos
    if (this.duendesActivos.length === 0 && this.totalDuendesCreados >= this.limiteDuendes) {
        this.finalizarNivel(); // función que muestra mensaje y botón
    }

    // Generar un nuevo duende si no se alcanzó el límite total
    if (this.totalDuendesCreados < this.limiteDuendes) {
        const newX = Phaser.Math.Between(100, 700);
        const newY = Phaser.Math.Between(100, 500);
        this.crearDuende(newX, newY);
        this.totalDuendesCreados++;
    }
});

            }
        }
    });

    return duende;
}

// Método para mostrar mensaje de nivel completado
finalizarNivel() {
    const modal = this.add.dom(this.cameras.main.width/2, this.cameras.main.height/2)
        .createElement('div', 'background-color: rgba(0,0,0,0.8); padding:20px; border-radius:10px; color:white; width:400px; text-align:center;')
        .setHTML(`
            <p>¡Felicidades! Has terminado el nivel.</p>
            <button id="btnSalir">Volver al menú</button>
        `);

    const btnSalir = modal.node.querySelector('#btnSalir');
    btnSalir.addEventListener('click', () => {
        modal.destroy();
        this.scene.start('EscenaJuego'); // vuelve a la escena principal
    });
}






}

