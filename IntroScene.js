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
    // Usar dimensiones fijas del juego (800x600)
    const width = 800;
    const height = 600;

    // Crear video SIN setDisplaySize inicial
    const video = this.add.video(width / 2, height / 2, 'intro');
    
    // Debug
    console.log('¿Existe la textura del video?', this.textures.exists('intro'));
    console.log('Video object:', video);

    // Overlay inicial
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);
const playText = this.add.text(width / 2, height / 2, 'CLIC PARA REPRODUCIR VIDEO', {
  fontFamily: 'Cinzel Decorative, serif',
  fontSize: '28px',
  fontStyle: 'bold',
  color: '#f5e6c4', // tono pergamino
  align: 'center'
}).setOrigin(0.5);
playText.setShadow(0, 2, '#000000', 2);

    // Botón de saltar - posicionado dentro de los límites del juego
    // Botón SALTAR con gradiente y borde (mismo x/y y origen que usabas)
const btnW = 140, btnH = 48;
const xBtn = width - 20;
const yBtn = height - 20;

// Crear textura de gradiente tipo EscenaInicio
const rt = this.textures.createCanvas('gradienteBtnIntro', btnW, btnH);
const ctx = rt.getContext();
let grd = ctx.createLinearGradient(0, 0, 0, btnH);
grd.addColorStop(0, '#8b0000'); // vino oscuro
grd.addColorStop(1, '#5a0000'); // rojo profundo
ctx.fillStyle = grd;
ctx.fillRect(0, 0, btnW, btnH);
rt.refresh();

// Fondo y borde
const skipBg = this.add.image(xBtn, yBtn, 'gradienteBtnIntro').setOrigin(1, 1);
const skipBorder = this.add.graphics();
skipBorder.lineStyle(3, 0x8b0000, 1);
skipBorder.strokeRoundedRect(xBtn - btnW, yBtn - btnH, btnW, btnH, 8);

// Texto del botón (mantenemos el nombre skipBtn para no tocar tu lógica)
const skipBtn = this.add.text(xBtn - btnW / 2, yBtn - btnH / 2, 'SALTAR', {
  fontFamily: 'Cinzel Decorative, serif',
  fontSize: '22px',
  fontStyle: 'bold',
  color: '#f5e6c4'
}).setOrigin(0.5).setInteractive({ useHandCursor: true });

// Hover como en EscenaInicio: ilumina gradiente y texto
skipBtn.on('pointerover', () => {
  const ctx2 = rt.getContext();
  const grd2 = ctx2.createLinearGradient(0, 0, 0, btnH);
  grd2.addColorStop(0, '#cc0000');
  grd2.addColorStop(1, '#8b0000');
  ctx2.fillStyle = grd2;
  ctx2.fillRect(0, 0, btnW, btnH);
  rt.refresh();
  skipBtn.setColor('#fff4d1');
});
skipBtn.on('pointerout', () => {
  const ctx3 = rt.getContext();
  const grd3 = ctx3.createLinearGradient(0, 0, 0, btnH);
  grd3.addColorStop(0, '#8b0000');
  grd3.addColorStop(1, '#5a0000');
  ctx3.fillStyle = grd3;
  ctx3.fillRect(0, 0, btnW, btnH);
  rt.refresh();
  skipBtn.setColor('#f5e6c4');
});

    // Función para iniciar video
    const startVideo = () => {
      console.log('Iniciando reproducción...');
      
      // Remover overlay
      overlay.destroy();
      playText.destroy();
      
      // AQUÍ ES DONDE AJUSTAMOS EL TAMAÑO DESPUÉS DE CARGAR
      this.time.delayedCall(100, () => {
        // Obtener dimensiones reales del video
        const videoElement = video.video;
        if (videoElement) {
          console.log('Dimensiones originales del video:', videoElement.videoWidth, 'x', videoElement.videoHeight);
          
          // Calcular escala para que quepa exactamente en 800x600
          const scaleX = width / videoElement.videoWidth;
          const scaleY = height / videoElement.videoHeight;
          
          // Opción 1: Usar la escala menor para mantener proporción
          const scale = Math.min(scaleX, scaleY);
          video.setScale(scale);
          
          // Opción 2: Si quieres que llene toda la pantalla (puede distorsionar)
          // video.setDisplaySize(width, height);
          
          console.log('Escala aplicada:', scale);
        }
      });
      
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
}