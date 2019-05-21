import { getLocalBody } from './localContent'

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
    const responseInit = { headers: {'content-type':'text/html; charset=UTF-8'} };

    let body = await getLocalBody(event.request.headers.get('CF-IPCountry'));

    return new Response(body, responseInit);
};

// async function getBody(country) {
//     const expiration = 3600;
//     const countryKey = 'country' + country;
//     const greetingKey = 'greeting' + country;

//     // Try get country details from KV (JSON string) as object
//     let details = await kvStorage.get(countryKey, "json");

//     if(!details) {
//         // "Expensive" external call that we want to cache in KV
//         let response = await fetch('https://restcountries.eu/rest/v2/alpha/' + country);
//         details = await response.json();

//         // Store country details in KV (JSON string)
//         kvStorage.put(countryKey, JSON.stringify(details), { expirationTtl: expiration});
//     }

//     // Try get greeting from KV (string)
//     let greeting = await kvStorage.get(greetingKey);

//     if(!greeting) {
//         greeting = 'Hello';
//         let language = details.languages[0].iso639_1;

//         if(language != 'en'){
//             let translationUrl = 'https://translation.googleapis.com/language/translate/v2?q=' + greeting + '&source=en&target=' + language + '&source=en&key=' + cloudTranslationApiKey;

//             let translationResponse = await fetch(translationUrl);
//             let translation = await translationResponse.json();
//             if(translation) {
//                 let translatedGreeting = translation.data.translations[0].translatedText;
//                 if(translatedGreeting) {
//                     greeting = translatedGreeting;
//                 }
//             }
//         }

//         // Store greeting in KV (string)
//         kvStorage.put(greetingKey, greeting, { expirationTtl: expiration});
//     }

//     let body = '<a href="/"><div><img src="' + details.flag + '" style="width:100px;" /></div></a><span>' + greeting + '</span>';
//     return body;
// };