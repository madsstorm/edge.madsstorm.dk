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
    let body = await getBody(event.request.headers['CF-IPCountry'])
    let response = new Response(body, responseInit)
    return response
}

async function getBody(country) {
    const flagUrlKey = "flagUrl-" + country;
    const nativeNameKey = "nativeName-" + country;

    let flagUrl = await kvStorage.get(flagUrlKey);
    let nativeName = await kvStorage.get(nativeNameKey);

    if(!flagUrl || !nativeName) {
        const response = await fetch('https://restcountries.eu/rest/v2/alpha/' + country)
        details = await response.json()

        flagUrl = details.flag;
        nativeName = details.nativeName;

        kvStorage.put(flagUrlKey, flagUrl, { expirationTtl: 60 })
        kvStorage.put(nativeNameKey, nativeName, { expirationTtl: 60 })
    }

    let body = '<a href="/"><div><img src="' + flagUrl + '" style="width:100px;" /><span></div>' + nativeName + '</span></a>'
    return body
}