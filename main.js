// Archivo: main.js
import { EscenaInicio, Escena, Mazmorra1 } from './Escenas.js';
import { IntroScene } from './IntroScene.js';  

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [EscenaInicio, IntroScene, Escena, Mazmorra1], // Añade tu escena al array
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Establece la gravedad a 0 para que el personaje no caiga
      debug: true// Cambia a true para ver los cuerpos de las físicas
    }
  },
  parent: 'phaser-game', // opcional si tienes un div
  dom: {
    createContainer: true   // 🔥 esto habilita DOM Elements
  }
};

const game = new Phaser.Game(config);