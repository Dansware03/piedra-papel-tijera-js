let historial = JSON.parse(localStorage.getItem("historial")) || { ganadas: 0, perdidas: 0 };
let historialJugador = [];
let jugador1Jugada = null;
let jugador2Jugada = null;

function seleccionarJugada(jugada, jugador) {
  if (jugador === "jugador1") {
    jugador1Jugada = jugada;
    document.getElementById("eleccionJugador1").textContent = eleccion(jugada);
  } else if (jugador === "jugador2") {
    jugador2Jugada = jugada;
    document.getElementById("eleccionPc").textContent = eleccion(jugada);
  }
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function eleccion(jugada) {
  const opciones = ["Piedra", "Papel", "Tijera"];
  return opciones[jugada - 1] || "Opción inválida";
}

// Función para detectar patrones en las elecciones del jugador
function eleccionComputadora() {
  if (historialJugador.length < 3) {
    return aleatorio(1, 3);
  }
  const patrones = { 1: { 1: 2, 2: 3, 3: 1 }, 2: { 1: 3, 2: 1, 3: 2 }, 3: { 1: 1, 2: 2, 3: 3 } };
  const ultima = historialJugador[historialJugador.length - 1];
  const penultima = historialJugador[historialJugador.length - 2];
  return patrones[penultima]?.[ultima] || aleatorio(1, 3);
}

function eleccionComputadoraConProbabilidades() {
  const probabilidades = [0.3, 0.4, 0.3];
  const rand = Math.random();
  let acumulado = 0;
  for (let i = 0; i < probabilidades.length; i++) {
    acumulado += probabilidades[i];
    if (rand < acumulado) return i + 1;
  }
  return 1;
}

function jugar() {
  const modoJuego = document.getElementById("modoJuego").value;
  let jugador2;

  if (!jugador1Jugada) {
    alert("Jugador 1 debe elegir una jugada.");
    return;
  }

  if (modoJuego === "pc") {
    jugador2 = Math.random() < 0.5 ? eleccionComputadora() : eleccionComputadoraConProbabilidades();
    document.getElementById("eleccionPc").textContent = eleccion(jugador2);
  } else if (!jugador2Jugada) {
    alert("Jugador 2 debe elegir una jugada.");
    return;
  } else {
    jugador2 = jugador2Jugada;
  }

  if (jugador1Jugada === jugador2) {
    document.getElementById("resultado").textContent = "Empate";
  } else if (
    (jugador1Jugada === 1 && jugador2 === 3) ||
    (jugador1Jugada === 2 && jugador2 === 1) ||
    (jugador1Jugada === 3 && jugador2 === 2)
  ) {
    document.getElementById("resultado").textContent = "Ganaste";
    historial.ganadas++;
  } else {
    document.getElementById("resultado").textContent = "Perdiste";
    historial.perdidas++;
  }

  actualizarHistorial();
  guardarHistorial();
  jugador1Jugada = null;
  jugador2Jugada = null;
}

function cambiarModo() {
  const modoJuego = document.getElementById("modoJuego").value;
  document.getElementById("jugador2-eleccion").style.display = modoJuego === "2jugadores" ? "block" : "none";
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