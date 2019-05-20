addEventListener('fetch', event => {
    let response = handle(event.request);
    response = setHeader(response);
    response = setAnotherHeader(response);
    event.respondWith(response);
})
  
async function handle(request) {
    let response = await fetch(request);
    return response;
}

function setHeader(response) {
    response = new Response(response.body, response);
    response.headers.set('Mads', 'Madsen2');
    return response;
}

function setAnotherHeader(response) {
    response = new Response(response.body, response);
    response.headers.set('Hans', 'Hansen5');
    return response;
}