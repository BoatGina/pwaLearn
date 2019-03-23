self.addEventListener('install', function(event) {
    self.skipWaiting()
    event.waitUntil(
      caches.open('swTest-v2').then(function(cache) {
        return cache.addAll([
          '/images/img1.jpg'
        ]);
      })
    );
  });

  self.addEventListener('activate', function(event) {
    self.skipWaiting()
    self.clients.claim()
  })
  
  
self.addEventListener('fetch', function(event) {
  
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (event.clientId) {
      clients.get(event.clientId).then(client => {
        client.postMessage({
            msg: "Hey I just got a fetch from you!-from sw2",
            url: event.request.url
        })
      })
    }
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        // let responseClone = response.clone();
        
        // caches.open('swTest-v1').then(function (cache) {
        //   cache.put(event.request, responseClone);
        // });
        return response;
      }).catch(function () {
        return caches.match('/images/img1.jpg');
      });
    }
  }));
});
  