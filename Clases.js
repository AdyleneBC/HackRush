export class Personaje {
  constructor(nivel, vida) {
    this.nombre;
    this.nivel = nivel;
    this.vida = vida;
    this.medallas;
    this.ataque;
    this.defensa=0;
  }
  subirNivel() {
    this.nivel += 1;
    console.log(`${this.nombre} ha subido al nivel ${this.nivel}!`);
  }
  AgregarNombre(nombre) {
    this.nombre = nombre;
    console.log(`El nombre del personaje es ${this.nombre}`);
  }
  atacar(Objetivo){
    Objetivo.recibirDanio(this.ataque);
    console.log(`${this.nombre} ataca a ${Objetivo.nombre}`);
  }
  defenderse() {
    this.defensa+=10;
    console.log(`${this.nombre} ha aumentado su defensa en ${this.defensa}`);
  }
  recibirDanio(cantidad) {
    let danio= cantidad;
    if (this.defensa>0 && this.defensa<danio){
        danio-=this.defensa;
        this.vida -= danio;
    } else {
        this.vida-=danio
        if(this.vida<=0){
            console.log(`${this.nombre} ha sido derrotado.`);
        }
    }
  }

  mostrarEstado() {
    console.log(`--- Estado del Personaje ---`);
    console.log(`Nombre: ${this.nombre}`);
    console.log(`Nivel: ${this.nivel}`);
    console.log(`Vida: ${this.vida}`);
    console.log(`Medallas: ${this.medallas}`);
    console.log(`----------------------------`);
  }
}
