addEventListener('fetch', event => {
    event.passThroughOnException();

    let response = await fetch(request);

    response = new Response(response.body, response); 
    response.headers.set('Mads', 'Madsen');  

    event.respondWith(reponse);
});
