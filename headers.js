addEventListener('fetch', event => {
    event.passThroughOnException();

    let resp = handleRequest(request);

    event.respondWith(handleReponse(resp));
});

async function handleRequest(req)
{
    return await fetch(req);
}

async function handleReponse(response) {
    response = new Response(response.body, response); 
    response.headers.set('Mads', 'Madsen');  
    return response;
};