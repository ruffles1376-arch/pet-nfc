// Variable global
let mascota;

// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Contenedor
const contenedor = document.getElementById("contenido");

// Cargar base de datos (anti-cache)
fetch("data.json?v=" + new Date().getTime())
  .then(res => res.json())
  .then(data => {

    mascota = data.find(m => m.id == id);

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

          <button class="mapa" onclick="compartirUbicacion()">📍 Ver mi ubicación</button>

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
  .catch(() => {
    contenedor.innerHTML = "<p>❌ Error al cargar datos</p>";
  });


// 📍 Ver ubicación (solo abre mapa)
function compartirUbicacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {

      const link = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
      window.open(link, "_blank");

    }, () => {
      alert("No se pudo obtener la ubicación");
    });
  }
}


// 🚨 Reportar encontrada (envía SMS)
function reportar() {
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(pos => {

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const link = `https://maps.google.com/?q=${lat},${lon}`;

      const telefono = mascota.telefono;

      const mensaje = `🚨 Hola, encontré a ${mascota.nombre}. Estoy aquí: ${link}`;

      const url = `sms:${telefono}?body=${encodeURIComponent(mensaje)}`;

      window.open(url);

    }, () => {
      alert("No se pudo obtener la ubicación");
    });

  } else {
    alert("Tu dispositivo no soporta geolocalización");
  }
}