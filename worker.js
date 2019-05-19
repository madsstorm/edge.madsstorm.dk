addEventListener('fetch', event => {

    let countryCode = event.request.headers.get('CF-IPCountry');
  
    let result = '<html><h1>The Edge</h1><span>';
    
    if(countryCode === 'DK') {
      result = result + 'Velkommen!';
    } else if(countryCode === 'DE') {
    result = result + 'Willkommen!';
    } else if(countryCode === 'ES') {
    result = result + 'Hola!';
    } else {
     result = result + 'Welcome!'; 
    }
  
    result = result + '</span></html>';
  
    let response = new Response(result);
  
    const responseInit = {
        headers: {'Content-Type': 'text/html'}
      }
    event.respondWith(new Response(result, responseInit));
});