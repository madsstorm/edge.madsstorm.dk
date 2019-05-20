addEventListener('fetch', event => {
    event.passThroughOnException();

    let response = handleRequest1(releaseEvents);

    event.respondWith(handleReponse2(handleReponse1(response)));
});

async function handleRequest1(request)
{
    let response = await fetch(request);
    return response;
}

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