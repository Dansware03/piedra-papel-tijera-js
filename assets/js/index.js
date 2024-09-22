function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function eleccion(jugada) {
    const opciones = ["Piedra", "Papel", "Tijera"];
    return opciones[jugada - 1] || "Opción inválida";
  }

  function jugar() {
    let jugador = parseInt(document.getElementById("jugador").value);
    let resultado = document.getElementById("resultado");

    if (jugador < 1 || jugador > 3 || isNaN(jugador)) {
      resultado.textContent =
        "Por favor, elige una opción válida: 1 = Piedra, 2 = Papel, 3 = Tijera.";
      return;
    }

    let pc = aleatorio(1, 3);

    document.getElementById("eleccionPc").textContent = eleccion(pc);
    document.getElementById("eleccionJugador").textContent =
      eleccion(jugador);

    if (jugador === pc) {
      resultado.textContent = "Empate";
    } else if (
      (jugador === 1 && pc === 3) ||
      (jugador === 2 && pc === 1) ||
      (jugador === 3 && pc === 2)
    ) {
      resultado.textContent = "Ganaste";
    } else {
      resultado.textContent = "Perdiste";
    }
  }