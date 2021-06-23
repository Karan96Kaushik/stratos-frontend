if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceWorker.js', {
        scope: '.' // <--- THIS BIT IS REQUIRED
    }).then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
  }
  
  self.addEventListener('install', (e) => {
    console.log("installing")
  });
  
  self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request)),
    );
  });
  
  function soda () {
    console.log("SODA")
  }
  
  function register () {
    console.log("regsoda")
  }