
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '1031604326543'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Your BoardinPass for';
  const notificationOptions = {
    body: 'Checkin completed & boarding pass is ready',
    icon: '/images/Ebp.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});
