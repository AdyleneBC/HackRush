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