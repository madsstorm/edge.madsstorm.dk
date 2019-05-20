addEventListener('fetch', event => {
    event.passThroughOnException();

    let response = await fetch(request);

    event.respondWith(handle2(handle1(response)));
});

async function handleReponse1(response) {
    response = new Response(response.body, response); 
    response.headers.set('Mads', 'Madsen');  
    return response;
};
  
async function handleReponse2(response) {
    response = new Response(response.body, response); 
    response.headers.set('Hans', 'Hansen');
    return response;
};