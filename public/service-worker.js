const CACHE_VERSION = 'v2';
const CACHE_NAME = CACHE_VERSION + ':static';

const urlsToCache = [
    '/',
    '/index.html',
    '/static/js/bundle.js', 
];

const urlsToPrecache = [
    '/styles/main.css',
    '/images/logo.png',
    
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll([...urlsToCache, ...urlsToPrecache]);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            // Optionally, serve a custom offline page
                            return caches.match('/offline.html');
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(error => {
                        // Optionally, serve a custom offline page
                        return caches.match('/offline.html');
                    });
            })
    );
});

self.addEventListener('activate', event => {
    var cacheAllowlist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-example') {
        event.waitUntil(doSync());
    }
});

function doSync() {
    // Implement your background sync logic here
}

self.addEventListener('push', event => {
    const payload = event.data ? event.data.text() : 'Default push notification message';
    event.waitUntil(
        self.registration.showNotification('Push Notification', {
            body: payload,
        })
    );
});
