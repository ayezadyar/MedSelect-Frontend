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
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('failedRequests', 1);

        request.onerror = function(event) {
            console.error('IndexedDB error:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['requests'], 'readwrite');
            const objectStore = transaction.objectStore('requests');
            const getRequest = objectStore.getAll();

            getRequest.onerror = function(event) {
                console.error('Error retrieving failed requests:', event.target.error);
                reject(event.target.error);
            };

            getRequest.onsuccess = function(event) {
                const failedRequests = event.target.result;

                const retryPromises = failedRequests.map(request => {
                    return fetch(request.url, request.options)
                        .then(response => {
                            objectStore.delete(request.id);
                        })
                        .catch(error => {
                            console.error('Error retrying request:', error);
                        });
                });

                Promise.all(retryPromises)
                    .then(() => {
                        console.log('All failed requests retried successfully');
                        resolve();
                    })
                    .catch(error => {
                        console.error('Error retrying failed requests:', error);
                        reject(error);
                    });
            };
        };

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            const objectStore = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('url', 'url', { unique: false });
            objectStore.createIndex('options', 'options', { unique: false });
        };
    });
}

self.addEventListener('push', event => {
    const payload = event.data ? event.data.text() : 'Default push notification message';
    event.waitUntil(
        self.registration.showNotification('Push Notification', {
            body: payload,
        })
    );
});
