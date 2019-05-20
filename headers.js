addEventListener('fetch', event => {
    event.passThroughOnException();
    event.respondWith(handle1(event.request));
});

addEventListener('fetch', event => {
    event.passThroughOnException();
    event.respondWith(handle2(event.request));
});

async function handle1(request) {
    let response = await fetch(request);
    response = new Response(response.body, response); 
    response.headers.set('Mads', 'Storm');  
    return response;
};
  
async function handle2(request) {
    let response = await fetch(request);
    response = new Response(response.body, response); 
    response.headers.set('Hansen', 'Hansen');
    return response;
};