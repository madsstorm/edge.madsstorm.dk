class LocalizedContent {
    async CreateResponse({event}) {
        const body = await getLocalBody(event);
        const responseInit = { headers: {'content-type':'text/html; charset=UTF-8'} };
        return new Response(body, responseInit);
    }

async getLocalBody(event) {
    const expiration = 3600;
    const country = event.request.headers.get('CF-IPCountry')
    const countryKey = 'country' + country;
    const greetingKey = 'greeting' + country;

    // Try get country details from KV (JSON string) as object
    let details = await EDGE_STORE.get(countryKey, "json");

    if(!details) {
        // "Expensive" external call that we want to cache in KV
        let response = await fetch('https://restcountries.eu/rest/v2/alpha/' + country);
        details = await response.json();

        // Store country details in KV (JSON string)
        event.waitUntil(EDGE_STORE.put(countryKey, JSON.stringify(details), { expirationTtl: expiration}));
    }

    // Try get greeting from KV (string)
    let greeting = await EDGE_STORE.get(greetingKey);

    if(!greeting) {
        greeting = 'Hello';
        let language = details.languages[0].iso639_1;

        if(language != 'en'){
            let translationUrl = 'https://translation.googleapis.com/language/translate/v2?q=' + greeting + '&source=en&target=' + language + '&source=en&key=' + cloudTranslationApiKey;

            let translationResponse = await fetch(translationUrl);
            let translation = await translationResponse.json();
            if(translation) {
                let translatedGreeting = translation.data.translations[0].translatedText;
                if(translatedGreeting) {
                    greeting = translatedGreeting;
                }
            }
        }

        // Store greeting in KV (string)
        event.waitUntil(EDGE_STORE.put(greetingKey, greeting, { expirationTtl: expiration}));
    }

    let body = '<a href="/"><div><img src="' + details.flag + '" /></div></a><span><h1>' + greeting + '</h1></span>';
    return body;
}
}