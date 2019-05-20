addEventListener('fetch', event => {
    let response = handle(event.request);
    event.respondWith(response);
})
  
async function handle(request) {
    let response = await fetch(request);
    response = new Response(response.body, response);
    response.headers.set('Mads', 'Madsen');
    return response;
}