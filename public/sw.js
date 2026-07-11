self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
    if (!event.data) return;

    let data;
    try {
        data = event.data.json();
    } catch {
        data = { title: 'Notifikasi', body: event.data.text(), url: '/dashboard' };
    }

    const title = data.title || 'WTS App';
    const options = {
        body: data.body || '',
        icon: '/icon.png',
        badge: '/icon.png',
        tag: `wts-${Date.now()}`,
        data: { url: data.url || '/dashboard' },
        vibrate: [200, 100, 200],
    };

    const notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title,
        body: data.body || '',
        url: data.url || '/dashboard',
        timestamp: Date.now(),
        read: false,
    };

    event.waitUntil(
        Promise.all([
            self.registration.showNotification(title, options),
            self.clients
                .matchAll({ type: 'window', includeUncontrolled: true })
                .then((clients) => clients.forEach((c) => c.postMessage({ type: 'PUSH_RECEIVED', notification }))),
        ])
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/dashboard';
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
            const existing = clients.find((c) => c.url.includes(new URL(url, self.location.origin).pathname));
            if (existing) return existing.focus();
            return self.clients.openWindow(url);
        })
    );
});