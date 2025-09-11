// Archivo: Menu.js (estilo pixel dungeon)
export class Menu extends Phaser.Scene {
  constructor() { super('Menu'); }

  preload() {
    this.load.image('fondo', 'Assets/menu.png'); // tu fondo
  }

  create() {
    const { width, height } = this.cameras.main;

    // Fondo escalado a pantalla
    const bg = this.add.image(width / 2, height / 2, 'fondo');
    const scale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(scale).setScrollFactor(0);

    // Oscurecer bordes para look de mazmorra
    const vignette = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.25);
    vignette.setDepth(1);

    // Estilos base
    const GOLD = '#E4B33F';
    const GOLD_DIM = '#D19A2B';
    const STROKE = '#3b220f';
    const fontTitle = { fontFamily: 'Press Start 2P, system-ui, monospace', fontSize: '36px', color: GOLD, stroke: STROKE, strokeThickness: 8 };
    const fontItem  = { fontFamily: 'Press Start 2P, system-ui, monospace', fontSize: '24px', color: GOLD, stroke: STROKE, strokeThickness: 6 };
    const fontSmall = { fontFamily: 'Press Start 2P, system-ui, monospace', fontSize: '12px', color: GOLD_DIM };

    // Título
    this.add.text(width / 2, 110, 'GROUP BY\nLEGENDS', fontTitle).setOrigin(0.5).setDepth(2);

    // Helper de botón estilo pixel con fondo + borde + hover (para el menú principal)
    const makeButton = (y, label, onClick) => {
      const GOLD_HEX = 0xE4B33F;
      const FILL_UP  = 0x5a0000; // vino oscuro
      const FILL_OV  = 0x8b0000; // hover

      // Texto
      const txt = this.add.text(0, 0, label, fontItem).setOrigin(0.5);

      // Tamaño con padding
      const padX = 28, padY = 16;
      const w = Math.ceil(txt.width  + padX * 2);
      const h = Math.ceil(txt.height + padY * 2);
      const R = 10;

      // Fondo + borde
      const bg = this.add.graphics();
      const draw = (fill) => {
        bg.clear();
        bg.fillStyle(fill, 1);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, R);
        bg.lineStyle(4, GOLD_HEX, 1);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, R);
      };
      draw(FILL_UP);

      // Contenedor interactivo
      const btn = this.add.container(width / 2, y, [bg, txt]).setDepth(2);
      btn.setSize(w, h).setInteractive(
        new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
        Phaser.Geom.Rectangle.Contains
      );

      // Estados
      btn.on('pointerover', () => {
        draw(FILL_OV);
        btn.setScale(1.03);
        txt.setColor('#fff4d1');
      });
      btn.on('pointerout', () => {
        draw(FILL_UP);
        btn.setScale(1.00);
        txt.setColor(GOLD);
      });
      btn.on('pointerdown', () => btn.setScale(0.98));
      btn.on('pointerup', () => {
        btn.setScale(1.03);
        onClick();
      });

      return btn;
    };

    const gap = 64;
    let y0 = 260;
    makeButton(y0 + gap * 0, 'Jugar',    () => this.scene.start('EscenaJuego'));
    makeButton(y0 + gap * 1, 'Opciones', () => this.togglePanel(this.optionsPanel));
    makeButton(y0 + gap * 2, 'Créditos', () => this.togglePanel(this.creditsPanel));
    makeButton(y0 + gap * 3, 'Salir',    () => this.quitGame());

    // Subtítulo
    this.add.text(width / 2, height - 36, 'Los Joins del Maíz', fontSmall).setOrigin(0.5).setDepth(2);

    // Paneles
    this.buildPanels();

    // ENTER para jugar
    this.input.keyboard.on('keydown-ENTER', () => this.scene.start('Escena'));
    // ESC para cerrar paneles
    this.input.keyboard.on('keydown-ESC', () => {
      if (this.optionsPanel.visible) this.togglePanel(this.optionsPanel);
      if (this.creditsPanel.visible) this.togglePanel(this.creditsPanel);
    });
  }

  buildPanels() {
    const { width, height } = this.cameras.main;

    // Helper para botones dentro de paneles (coordenadas relativas al container)
    const makePanelButton = (container, y, label, onClick) => {
      const GOLD_HEX = 0xE4B33F;
      const FILL_UP  = 0x5a0000;
      const FILL_OV  = 0x8b0000;
      const fontBtn  = { fontFamily: 'Press Start 2P, system-ui, monospace', fontSize: '14px', color: '#F9E4B7' };

      const txt = this.add.text(0, 0, label, fontBtn).setOrigin(0.5);
      const padX = 18, padY = 10;
      const w = Math.ceil(txt.width  + padX * 2);
      const h = Math.ceil(txt.height + padY * 2);
      const R = 8;

      const bg = this.add.graphics();
      const draw = (fill) => {
        bg.clear();
        bg.fillStyle(fill, 1);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, R);
        bg.lineStyle(3, GOLD_HEX, 1);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, R);
      };
      draw(FILL_UP);

      const btn = this.add.container(0, y, [bg, txt]).setDepth(6);
      btn.setSize(w, h).setInteractive(
        new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
        Phaser.Geom.Rectangle.Contains
      );

      btn.on('pointerover', () => {
        draw(FILL_OV);
        btn.setScale(1.03);
        txt.setColor('#fff4d1');
      });
      btn.on('pointerout', () => {
        draw(FILL_UP);
        btn.setScale(1.00);
        txt.setColor('#F9E4B7');
      });
      btn.on('pointerdown', () => btn.setScale(0.98));
      btn.on('pointerup', () => {
        btn.setScale(1.03);
        onClick();
      });

      container.add(btn);
      return btn;
    };

// ===== Opciones =====
this.optionsPanel = this.add.container(width / 2, 50).setVisible(false).setDepth(5); 
// lo pongo en el centro horizontal, pero 50px desde arriba

const p1bg = this.add.rectangle(0, 0, 560, 500, 0x000000, 0.7).setStrokeStyle(3, 0xE4B33F)
  .setOrigin(0.5, 0);  // el rectángulo empieza desde arriba

const p1t  = this.add.text(0, 20, 'Opciones', { 
  fontFamily: 'Press Start 2P, system-ui, monospace', 
  fontSize: '18px', 
  color: '#FFFFFF' 
}).setOrigin(0.5, 0);  // texto anclado arriba

const p1b  = this.add.text(0, 60,
  '1) Entra al juego\n\n' +
  'Haz clic en el botón "Jugar".\n\n' +
  'La primera vez verás un video de historia que presenta el mundo y tu misión.\n\n' +
  'Puedes saltarlo si quieres.\n\n' +
  'El video solo se mostrará una vez; después irás directo al mapa.\n\n\n' +

  '2) Elige tu mazmorra\n\n' +
  'Si eres jugador nuevo, te aparecerá la primera mazmorra desbloqueada: es el tutorial.\n\n' +
  'Si ya tienes avance, podrás elegir cualquier mazmorra desbloqueada en el mapa.\n\n\n' +

  '3) Primer nivel (tutorial)\n\n' +
  'Sigue las instrucciones en pantalla: aprenderás los básicos del juego y del SQL que usarás para vencer enemigos.\n\n' +
  '¡No dejes que los monstruos te atrapen! Avanza resolviendo los retos y presta atención a las pistas.\n\n' +
  'Cada reto te pedirá una consulta SQL. Al acertar, dañarás al enemigo y abrirás camino.\n\n\n' +


  '5) Consejos rápidos\n\n' +
  '- Lee el reto con calma: fíjate en los nombres de tablas y columnas.\n' +
  '- Empieza simple: SELECT + WHERE. Luego prueba JOIN, GROUP BY, etc.\n' +
  '- Si te atoras, usa las pistas y revisa ejemplos parecidos.\n' +
  '- Mantente en movimiento y evita a los monstruos mientras resuelves.',
  { 
    fontFamily: 'Press Start 2P, system-ui, monospace', 
    fontSize: '10px', 
    color: '#F9E4B7', 
    align: 'center', 
    wordWrap: { width: 520 } 
  }
).setOrigin(0.5, 0);  // también anclado arriba

this.optionsPanel.add([p1bg, p1t, p1b]);


    // Botón estilizado "Cerrar"
    makePanelButton(this.optionsPanel, 110, 'Cerrar', () => this.togglePanel(this.optionsPanel));

    // ===== Créditos =====
    this.creditsPanel = this.add.container(width / 2, height / 2).setVisible(false).setDepth(5);
    const p2bg = this.add.rectangle(0, 0, 560, 320, 0x000000, 0.7).setStrokeStyle(3, 0xE4B33F);
    const p2t  = this.add.text(0, -120, 'Créditos', { fontFamily: 'Press Start 2P, system-ui, monospace', fontSize: '18px', color: '#FFFFFF' }).setOrigin(0.5);
    const p2b  = this.add.text(0, -60,
      'Equipo: Los Joins del Maíz\nDiseño y Código: Angel + team\nArte: estilo pixel dungeon',
      { fontFamily: 'Press Start 2P, system-ui, monospace', fontSize: '12px', color: '#F9E4B7', align: 'center' }
    ).setOrigin(0.5);
    this.creditsPanel.add([p2bg, p2t, p2b]);

    // Botón estilizado "Volver"
    makePanelButton(this.creditsPanel, 110, 'Volver', () => this.togglePanel(this.creditsPanel));
  }

  togglePanel(panel) { panel.setVisible(!panel.visible); }

  quitGame() {
    // En web window.close sólo funciona si la pestaña fue abierta por script.
    // Mostramos un mensaje como fallback.
    const ok = window.close();
    if (!ok) {
      alert('Gracias por jugar Group By Legends!');
    }
  }
}
