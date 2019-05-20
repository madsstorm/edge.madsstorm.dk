/**
 * Cloudflare workers implement the service worker spec
 * See: https://developers.cloudflare.com/workers/about/ for an intro
 *
 * Binding an event handler to the fetch event allows your worker to intercept a request for your zone
 */
addEventListener('fetch', event => {

    // In the event of an uncaught exception, fail open as if the worker did not exist
    event.passThroughOnException()
   
    event.respondWith(handle(event))
})
  
async function handle(event) {
    const responseInit = { headers: {'content-type':'text/html','mads':'hansen'}}  
    let response = new Response(getBody(event.request.cf.country), responseInit)
    return response
}

function getBody(country) {
    let body = '<h1>The Edge</h1><img src="https://www.countryflags.io/' + country + '/shiny/64.png" />'

    return body
}