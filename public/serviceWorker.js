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
  setInterval(() => {
    console.log("sending...")
    function showNotification() {
      Notification.requestPermission(function(result) {
        if (result === 'granted') {
          navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification('Vibration Sample', {
              body: 'Buzz! Buzz!',
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              tag: 'vibration-sample'
            });
          });
        }
      });
    }
    showNotification()
  }, 5000)
});

self.addEventListener('fetch', (e) => {
  // console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});

// export function soda () {
//   console.log("SODA")
// }

// export function register () {
//   console.log("regsoda")
// }