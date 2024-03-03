// Names of the caches
const CACHE_NAME = 'v1';
const urlsToCache = [
	'/',
	'/index.html',
	'/static/js/bundle.js', // Adjust according to your app's file structure
	// Add other resources you want to cache, such as CSS files, images, etc.
];

// Install a service worker
self.addEventListener('install', event => {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => {
				console.log('Opened cache');
				return cache.addAll(urlsToCache);
			})
	);
});

// Cache and return requests
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(response => {
				// Cache hit - return response
				if (response) {
					return response;
				}
				return fetch(event.request).then(
					response => {
						// Check if we received a valid response
						if (!response || response.status !== 200 || response.type !== 'basic') {
							return response;
						}

						// IMPORTANT: Clone the response. A response is a stream
						// and because we want the browser to consume the response
						// as well as the cache consuming the response, we need
						// to clone it so we have two streams.
						var responseToCache = response.clone();

						caches.open(CACHE_NAME)
							.then(cache => {
								cache.put(event.request, responseToCache);
							});

						return response;
					}
				);
			})
	);
});

// Update a service worker
self.addEventListener('activate', event => {
	var cacheAllowlist = ['v1'];

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
