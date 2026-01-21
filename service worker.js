const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png', // Alterado de .jpg para .png
  '/icon-512.png', // Alterado de .jpg para .png
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap'
];


// 1. Instalação: Cacheia os arquivos e força a ativação
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache instalado com sucesso');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); 
});

// 2. Ativação: Limpa caches de versões anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); 
});

// 3. Estratégia de Busca: Tenta Rede, se falhar, usa o Cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
