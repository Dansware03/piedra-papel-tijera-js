function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function eleccion(jugada) {
  const opciones = ["Piedra", "Papel", "Tijera"];
  return opciones[jugada - 1] || "Opción inválida";
}

let historial = JSON.parse(localStorage.getItem("historial")) || { ganadas: 0, perdidas: 0 };

function jugar() {
  const modoJuego = document.getElementById("modoJuego").value;
  let jugador1 = parseInt(document.getElementById("jugador1").value);
  let jugador2 = modoJuego === "pc" ? aleatorio(1, 3) : parseInt(document.getElementById("jugador2").value);
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
