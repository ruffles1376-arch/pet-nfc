// Obtener el ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Contenedor donde se mostrará la info
const contenedor = document.getElementById("contenido");

// Cargar la base de datos (anti-cache)
fetch("data.json?v=" + new Date().getTime())
  .then(res => res.json())
  .then(data => {

    const mascota = data.find(m => m.id === id);

    if (mascota) {

      const estadoClase = mascota.estado === "perdido" ? "perdido" : "seguro";
      const estadoTexto = mascota.estado === "perdido"
        ? "🚨 Mascota Perdida"
        : "✅ Mascota Segura";

      contenedor.innerHTML = `
        <div class="card-body">

          <div class="estado ${estadoClase}">
            ${estadoTexto}
          </div>

          <h2>${mascota.nombre}</h2>
          <p><strong>${mascota.especie}</strong> • ${mascota.raza}</p>
          <p>Edad: ${mascota.edad} años</p>

          <h3>📞 Contacto</h3>
          <p>${mascota.dueno}</p>

          ${
            mascota.mostrarTelefono
            ? `<a href="tel:${mascota.telefono}">📞 Llamar</a>`
            : `<p>🔒 Teléfono oculto</p>`
          }

          <button class="mapa" onclick="compartirUbicacion()">📍 Compartir mi ubicación</button>

          <button class="alerta" onclick="reportar()">🚨 Reportar encontrada</button>

          <h3>⚠️ Información</h3>
          <p>Vacunas: ${mascota.vacunas}</p>
          <p>${mascota.notas}</p>

        </div>
      `;

    } else {
      contenedor.innerHTML = "<p>❌ Mascota no encontrada</p>";
    }

  })
  .catch(error => {
    contenedor.innerHTML = "<p>❌ Error al cargar datos</p>";
    console.error(error);
  });


// 📍 Función para compartir ubicación en tiempo real
function compartirUbicacion() {
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(posicion) {

      const lat = posicion.coords.latitude;
      const lon = posicion.coords.longitude;

      const link = `https://maps.google.com/?q=${lat},${lon}`;

      alert("Ubicación obtenida. Se abrirá el mapa.");

      window.open(link, "_blank");

    }, function(error) {
      alert("No se pudo obtener la ubicación");
    });

  } else {
    alert("Tu dispositivo no soporta geolocalización");
  }
}


// 🚨 Función de reporte
function reportar() {
  alert("¡Gracias por reportar! El dueño será notificado.");
}