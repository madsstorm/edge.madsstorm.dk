addEventListener('fetch', event => {
    event.passThroughOnException();
    event.respondWith(handle2(handle1(event.request)));
});

async function handle1(request) {
    let response = await fetch(request);
    response = new Response(response.body, response); 
    response.headers.set('Mads', 'Madsen');  
    return response;
};
  
async function handle2(request) {
    let response = await fetch(request);
    response = new Response(response.body, response); 
    response.headers.set('Hans', 'Hansen');
    return response;
};