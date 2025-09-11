// Archivo: main.js
import { Escena, Mazmorra1 } from './Escenas.js';
// ⬇️ Nuevo: import de la escena de introducción (video)
import { IntroScene } from './IntroScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [Escena, Mazmorra1], // Añade tu escena al array
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Establece la gravedad a 0 para que el personaje no caiga
      debug: true // Cambia a true para ver los cuerpos de las físicas
    }
  },
  parent: 'phaser-game', // opcional si tienes un div
  dom: {
    createContainer: true   // 🔥 esto habilita DOM Elements
  }
};

const game = new Phaser.Game(config);


// ⬇️ Nuevo: lógica para mostrar el tutorial de inicio una sola vez (localStorage)
(() => {
  // lee la marca (true si ya se vio)
  const seen = (() => {
    try { return localStorage.getItem('hr_seen_intro') === '1'; }
    catch { return false; }
  })();

  if (!seen) {
    // registra y lanza la Intro por encima de la escena actual
    game.scene.add('IntroScene', IntroScene, true);

    // si tu escena principal ya está activa, la pausamos mientras corre la intro
    if (game.scene.isActive('Escena')) {
      game.scene.pause('Escena');
    }
    // Importante: dentro de IntroScene, al terminar el video/skip, haz:
    // localStorage.setItem('hr_seen_intro', '1');
    // this.scene.stop(); this.scene.resume('Escena');  // o this.scene.start('Escena');
  }
  // Si ya se vio, no hacemos nada: el juego entra directo a tu escena por defecto.
})();
