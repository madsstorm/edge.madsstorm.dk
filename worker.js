/**
 * Cloudflare workers implement the service worker spec
 * See: https://developers.cloudflare.com/workers/about/ for an intro
 *
 * Binding an event handler to the fetch event allows your worker to intercept a request for your zone
 */
addEventListener('fetch', event => {

    // In the event of an uncaught exception, fail open as if the worker did not exist
    event.passThroughOnException()
   
    event.respondWith(handle(event.request));
})
  
async function handle(request) {
    let response = await fetch(request);
    response = new Response(response.body, response);
    response.headers.set('Mads', 'Madsen2');
    response.headers.set('Hans', 'Hansen5');
    return response;
}