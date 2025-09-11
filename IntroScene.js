// Archivo: IntroScene.js

import { IntroScene } from './IntroScene.js'; /*Se agregó */

export class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  preload() {
    // Asegúrate de poner el archivo en tu carpeta de Assets
    this.load.video('intro', 'Assets/intro.mp4', 'loadeddata', false, true);
  }

  create() {
    const { width, height } = this.scale;

    // Añadir el video centrado y ajustado a pantalla
    const video = this.add.video(width / 2, height / 2, 'intro')
      .setOrigin(0.5)
      .setDisplaySize(140, 150);

    // Reproducir el video (no en loop)
    video.play(false);

    // Botón "Saltar"
    const skip = this.add.text(width - 20, 20, 'Saltar ▷', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });

    const finish = () => {
      try {
        localStorage.setItem('hr_seen_intro', '1'); // Marca que ya se vio
      } catch {}
      this.scene.stop();         // Detiene la Intro
      this.scene.resume('Escena'); // Reanuda tu escena principal
    };

    // Cuando termine el video
    video.once('complete', finish);

    // Si el jugador hace click en cualquier parte
    this.input.once('pointerdown', finish);

    // Si pulsa en el botón "Saltar"
    skip.on('pointerdown', finish);
  }
}