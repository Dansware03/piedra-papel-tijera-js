function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function eleccion(jugada) {
  const opciones = ["Piedra", "Papel", "Tijera"];
  return opciones[jugada - 1] || "Opción inválida";
}

let historial = JSON.parse(localStorage.getItem("historial")) || { ganadas: 0, perdidas: 0 };
let historialJugador = [];

// Función para detectar patrones en las elecciones del jugador
function eleccionComputadora() {
  // Añadir la última jugada del jugador al historial
  const ultimaJugada = parseInt(document.getElementById("jugador1").value);
  if (!isNaN(ultimaJugada)) {
    historialJugador.push(ultimaJugada);
  }

  // Analizar el patrón de las últimas jugadas
  if (historialJugador.length < 3) {
    // No suficiente información para detectar patrón
    return aleatorio(1, 3); // Elegir aleatoriamente
  }

  // Detectar patrón simple basado en las últimas 2 jugadas
  const patrones = {
    1: { 1: 2, 2: 3, 3: 1 },
    2: { 1: 3, 2: 1, 3: 2 },
    3: { 1: 1, 2: 2, 3: 3 }
  };

  const ultima = historialJugador[historialJugador.length - 1];
  const penultima = historialJugador[historialJugador.length - 2];

  if (patrones[penultima] && patrones[penultima][ultima]) {
    return patrones[penultima][ultima];
  }

  // Si no se detecta un patrón, elegir aleatoriamente
  return aleatorio(1, 3);
}

function eleccionComputadoraConProbabilidades() {
  const probabilidades = [0.3, 0.4, 0.3]; // Probabilidades para Piedra, Papel, Tijera
  const rand = Math.random();
  let acumulado = 0;

  for (let i = 0; i < probabilidades.length; i++) {
    acumulado += probabilidades[i];
    if (rand < acumulado) {
      return i + 1; // Retorna 1, 2 o 3 basado en el índice
    }
  }
  return 1; // Valor predeterminado en caso de error
}

function jugar() {
  const modoJuego = document.getElementById("modoJuego").value;
  let jugador1 = parseInt(document.getElementById("jugador1").value);
  let jugador2;

  if (modoJuego === "pc") {
    // Elegir entre estrategia de detección de patrones o carga de jugadas
    jugador2 = Math.random() < 0.5 ? eleccionComputadora() : eleccionComputadoraConProbabilidades();
  } else {
    jugador2 = parseInt(document.getElementById("jugador2").value);
  }

  let resultado = document.getElementById("resultado");

  if (jugador1 < 1 || jugador1 > 3 || isNaN(jugador1) || (modoJuego === "2jugadores" && (jugador2 < 1 || jugador2 > 3 || isNaN(jugador2)))) {
    resultado.textContent = "Por favor, elige una opción válida.";
    return;
  }

  document.getElementById("eleccionJugador1").textContent = eleccion(jugador1);
  document.getElementById("eleccionPc").textContent = eleccion(jugador2);

  if (jugador1 === jugador2) {
    resultado.textContent = "Empate";
  } else if (
    (jugador1 === 1 && jugador2 === 3) ||
    (jugador1 === 2 && jugador2 === 1) ||
    (jugador1 === 3 && jugador2 === 2)
  ) {
    resultado.textContent = "Ganaste";
    historial.ganadas++;
  } else {
    resultado.textContent = "Perdiste";
    historial.perdidas++;
  }

  actualizarHistorial();
  guardarHistorial();
}

function cambiarModo() {
  const modoJuego = document.getElementById("modoJuego").value;
  const jugador2 = document.getElementById("jugador2");
  const labelJugador2 = document.getElementById("labelJugador2");

  if (modoJuego === "2jugadores") {
    jugador2.style.display = "block";
    labelJugador2.style.display = "block";
  } else {
    jugador2.style.display = "none";
    labelJugador2.style.display = "none";
  }
}

function actualizarHistorial() {
  const historialJugadas = document.getElementById("historialJugadas");
  historialJugadas.innerHTML = `<li>Ganadas: ${historial.ganadas}, Perdidas: ${historial.perdidas}</li>`;
}

function guardarHistorial() {
  localStorage.setItem("historial", JSON.stringify(historial));
}

function borrarHistorial() {
  historial = { ganadas: 0, perdidas: 0 };
  actualizarHistorial();
  localStorage.removeItem("historial");
}

function enviarWhatsApp() {
  const mensaje = `Jugador ganó ${historial.ganadas} veces y perdió ${historial.perdidas} veces.`;
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

window.onload = () => {
  actualizarHistorial();
};
