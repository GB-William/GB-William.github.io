// coi-serviceworker — Cross-Origin Isolation for GitHub Pages
// Enables SharedArrayBuffer required by FFmpeg.wasm
const isServiceWorker = typeof ServiceWorkerGlobalScope !== 'undefined';

if (isServiceWorker) {
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
  self.addEventListener('fetch', e => {
    if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') return;
    e.respondWith(
      fetch(e.request).then(response => {
        if (response.status === 0) return response;
        const headers = new Headers(response.headers);
        headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }).catch(() => Response.error())
    );
  });
} else {
  (async () => {
    if (!('serviceWorker' in navigator)) return;
    const reg = await navigator.serviceWorker.register(document.currentScript.src);
    await navigator.serviceWorker.ready;
    if (!crossOriginIsolated) location.reload();
  })();
}
