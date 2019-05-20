addEventListener('fetch', event => {

  event.passThroughOnException();

  let countryCode = event.request.headers.get('CF-IPCountry');
  
  let result = '<html><h1>The Edge</h1><span>';
    
  if(countryCode === 'DK') {
    result = result + 'Velkommen!!';
  } else if(countryCode === 'DE') {
  result = result + 'Willkommen!!';
  } else if(countryCode === 'ES') {
  result = result + 'Hola!!';
  } else {
    result = result + 'Welcome!!'; 
  }

  result = result + '</span></html>';

  const responseInit = {
      headers: {'Content-Type': 'text/html'}
    };

  event.respondWith(new Response(result, responseInit));
});