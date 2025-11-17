export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    // Scroll da janela principal
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Scroll do container do Quasar (se existir)
    const pageContainer = document.querySelector('.q-page-container');
    if (pageContainer) {
      pageContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
    
    // Scroll do body
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
});

