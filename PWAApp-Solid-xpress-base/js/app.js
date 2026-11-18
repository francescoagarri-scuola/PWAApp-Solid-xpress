// Registrazione del service worker e messaggio di stato.
const messaggio = document.getElementById("stato-offline");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => {
        messaggio.textContent = "Service worker attivo: l'app può funzionare anche offline.";
      })
      .catch((errore) => {
        messaggio.textContent = "Service worker non attivo: " + errore.message;
      });
  });
} else {
  messaggio.textContent = "Questo browser non supporta i service worker.";
}
