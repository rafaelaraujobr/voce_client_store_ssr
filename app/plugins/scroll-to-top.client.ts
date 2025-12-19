export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {

    window.scrollTo({ top: 0, behavior: 'instant' });
    
    const pageContainer = document.querySelector('.q-page-container');
    if (pageContainer) {
      pageContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
});

