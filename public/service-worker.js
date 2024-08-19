if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/joi.how/service-worker.js')
      .catch(registrationError => {
        console.error('SW registration failed: ', registrationError);
      });
  });
}
