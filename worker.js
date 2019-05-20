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
    const responseInit = { headers: {'content-type':'text/html'} }
    let body = await getBody(event.request.cf.country)
    let response = new Response(body, responseInit)
    return response
}

async function getBody(country) {
    const response = await fetch('https://restcountries.eu/rest/v2/alpha/' + country)
    let details = await response.json()

    let body = '<a href="/"><h1>The Edge</h1></a><img src="' + details.flag + '" />'
    return body
}