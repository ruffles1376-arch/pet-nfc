const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const contenedor = document.getElementById("contenido");

fetch("data.json?v=" + new Date().getTime())
  .then(res => res.json())
  .then(data => {

    const mascota = data.find(m => m.id == id);

    if (mascota) {

      const estadoClase = mascota.estado === "perdido" ? "perdido" : "seguro";
      const estadoTexto = mascota.estado === "perdido"
        ? "🚨 Mascota Perdida"
        : "✅ Mascota Segura";

      contenedor.innerHTML = `
        <img src="${mascota.foto}" class="foto">

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

          <button class="mapa" onclick="enviarUbicacion()">📍 Enviar ubicación al dueño</button>

          <button class="alerta" onclick="reportar()">🚨 Reportar encontrada</button>

          <h3>⚠️ Información</h3>
          <p>Vacunas: ${mascota.vacunas}</p>
          <p>${mascota.notas}</p>

        </div>
      `;

    } else {
      contenedor.innerHTML = "<p>❌ Mascota no encontrada</p>";
    }

  });

function compartirUbicacion() {
  navigator.geolocation.getCurrentPosition(pos => {
    const link = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
    window.open(link, "_blank");
  });
}

function reportar() {
  alert("¡Gracias por reportar!");
  function enviarUbicacionSMS() {
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(pos => {

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const link = `https://maps.google.com/?q=${lat},${lon}`;

      const telefono = "6271116131"; // TU número

      const mensaje = `Hola, encontré tu mascota. Aquí está mi ubicación: ${link}`;

      const url = `sms:${telefono}?body=${encodeURIComponent(mensaje)}`;

      window.open(url);

    }, () => {
      alert("No se pudo obtener la ubicación");
    });

  } else {
    alert("Tu dispositivo no soporta geolocalización");
  }
}
}