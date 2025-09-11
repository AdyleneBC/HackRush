// Archivo: main.js
import { EscenaInicio } from './EscenaInicio.js';
import { IntroScene } from './IntroScene.js';
import { Menu } from './menu.js';
import { Escena, Mazmorra1 } from './Escenas.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [EscenaInicio, IntroScene, Menu, Escena, Mazmorra1],
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: true }
  },
  parent: 'phaser-game',
  dom: { createContainer: true }
};

new Phaser.Game(config);
