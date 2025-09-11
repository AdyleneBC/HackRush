// IntroScene.js - Versión más simple para debugging
export class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  preload() {
    // Cargar video con diferentes eventos
    this.load.video('intro', 'Assets/intro.mp4');
    
    // Preload event listener para debug
    this.load.on('filecomplete-video-intro', () => {
      console.log('Video cargado correctamente');
    });
    
    this.load.on('loaderror', (file) => {
      console.error('Error cargando archivo:', file.key, file.url);
    });
  }

  create() {
    const { width, height } = this.scale;

    // Crear video más simple
    const video = this.add.video(width / 2, height / 2, 'intro');
    video.setDisplaySize(width, height);
    
    // Debug
    console.log('¿Existe la textura del video?', this.textures.exists('intro'));
    console.log('Video object:', video);

    // Overlay inicial
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);
    const playText = this.add.text(width / 2, height / 2, 'CLIC PARA REPRODUCIR VIDEO', {
      fontFamily: 'Arial', // Fuente más básica para debug
      fontSize: '24px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Botón de saltar
    const skipBtn = this.add.text(width - 20, height - 20, 'SALTAR', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#cc0000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true });

    // Función para iniciar video
    const startVideo = () => {
      console.log('Iniciando reproducción...');
      
      // Remover overlay
      overlay.destroy();
      playText.destroy();
      
      // Intentar reproducir
      try {
        video.play();
        console.log('Video.play() llamado');
        
        // Verificar si está reproduciéndose después de un momento
        this.time.delayedCall(1000, () => {
          console.log('¿Se está reproduciendo?', video.isPlaying());
        });
        
      } catch (error) {
        console.error('Error al iniciar video:', error);
        this.scene.start('EscenaJuego');
      }
    };

    // Event listeners
    this.input.once('pointerdown', startVideo);
    
    skipBtn.on('pointerdown', () => {
      console.log('Saltando intro...');
      this.scene.start('EscenaJuego');
    });

    // Video events
    video.on('play', () => console.log('✅ Video playing'));
    video.on('complete', () => {
      console.log('Video completado');
      this.scene.start('EscenaJuego');
    });
    video.on('error', (error) => {
      console.error('❌ Video error:', error);
      this.scene.start('EscenaJuego');
    });
  }
  .
}