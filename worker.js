/**
 * Cloudflare workers implement the service worker spec
 * See: https://developers.cloudflare.com/workers/about/ for an intro
 *
 * Binding an event handler to the fetch event allows your worker to intercept a request for your zone
 */
addEventListener('fetch', event => {

    // In the event of an uncaught exception, fail open as if the worker did not exist
    event.passThroughOnException();
   
    event.respondWith(handle(event));
})
  
async function handle(event) {
    const responseInit = { headers: {'content-type':'text/html; charset=UTF-8', 'the-key': cloudTranslationApiKey} };

    let body = await getBody(event.request.headers.get('CF-IPCountry'));

    return new Response(body, responseInit);
};

async function getBody(country) {
    const countryKey = 'country' + country;

    // Try get country details from KV (JSON string) as object
    let details = await kvStorage.get(countryKey, "json");

    if(!details) {
        // "Expensive" external call that we want to cache in KV
        let response = await fetch('https://restcountries.eu/rest/v2/alpha/' + country);
        details = await response.json();

        // Store country details in KV (JSON string)
        kvStorage.put(countryKey, JSON.stringify(details), { expirationTtl: 60});
    }

    let body = '<a href="/"><div><img src="' + details.flag + '" style="width:100px;" /><span></div>' + details.nativeName + '</span></a>';
    return body;
};