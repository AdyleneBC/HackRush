// Archivo: main.js
import { Escena } from './Escenas.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [Escena], // Añade tu escena al array
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Establece la gravedad a 0 para que el personaje no caiga
      debug: true // Cambia a true para ver los cuerpos de las físicas
    }
  }
};

const game = new Phaser.Game(config);