export class LocalizedContent {
    async CreateResponse({event}) {
        const expiration = 3600;
        let country = 'DK';
        if(event && event.request && event.request.cf) {
            country = event.request.cf.country;
        }
        const countryCacheKey = `country-${country}`;
        let datacenterCode = 'AMS';
        if(event && event.request && event.request.cf) {
            datacenterCode = event.request.cf.colo;
        }

        // Try get country details from KV (JSON string) as object
        let countryDetails = await EDGE_STORE.get(countryCacheKey, "json");
        if(countryDetails == null) {
            // "Expensive" external call that we want to cache in KV
            let response = await fetch(`https://restcountries.eu/rest/v2/alpha/${country}`);
            if(response != null && response.ok) {
                countryDetails = await response.json();
                if(countryDetails != null) {
                    // Store country details in KV (JSON string)
                    event.waitUntil(EDGE_STORE.put(countryCacheKey, JSON.stringify(countryDetails), { expirationTtl: expiration}));
                }
            }
        }
        
        let greetings = [];
        for(const language of countryDetails.languages) {
            const languageCode = language.iso639_1;
            const greetingCacheKey = `greeting-${languageCode}-${datacenterCode}`;

            // Try get greeting from KV (string)
            let greeting = await EDGE_STORE.get(greetingCacheKey);

            if(greeting == null || greeting == '') {
                greeting = `Hello ${countryDetails.name}. Greetings from ${datacenterCode} data center`;

                if(languageCode != 'en') {

                    let translationUrl = `https://translation.googleapis.com/language/translate/v2?q=${greeting}&source=en&target=${languageCode}&key=${cloudTranslationApiKey}`;
                    let translationResponse = await fetch(translationUrl);

                    if(translationResponse != null && translationResponse.ok) {
                        let translation = await translationResponse.json();
                        if(translation != null && translation != '') {
                            let translatedGreeting = translation.data.translations[0].translatedText;
                            if(translatedGreeting != null && translatedGreeting != '') {
                                greeting = translatedGreeting;
                            }
                        }
                    }
                }
                // Store greeting in KV (string)
                event.waitUntil(EDGE_STORE.put(greetingCacheKey, greeting, { expirationTtl: expiration}));
            }

            greetings.push(greeting);
        };

        let body = '';
        greetings.forEach(greet => {
            body += `<h1>${greet}</h1>`;
        });
        body += `<a href="/"><div><img src="${countryDetails.flag}" /></div></a>`;
 
        const responseInit = { headers: {'content-type':'text/html; charset=UTF-8'} };
        return new Response(body, responseInit);       
    }
}
