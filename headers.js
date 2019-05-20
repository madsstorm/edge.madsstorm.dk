addEventListener('fetch', event => {
    event.passThroughOnException();

    let response = handleRequest(event.request);

    event.respondWith(handleReponse(response));
});

async function handleRequest(request)
{
    return await fetch(request);
}

async function handleReponse(response) {
    response = new Response(response.body, response); 
    response.headers.set('Mads', 'Madsen');  
    return response;
};