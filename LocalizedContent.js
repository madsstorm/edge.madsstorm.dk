export class LocalizedContent {
    async CreateResponse({event}) {
        const expiration = 3600;
        const country = event.request.headers.get('CF-IPCountry');
        const countryKey = 'country-' + country;
        const datacenterCode = event.request.cf.colo;
        const datacenterKey = 'datacenter-' + datacenterCode;

        // Try get country details from KV (JSON string) as object
        let countryDetails = await EDGE_STORE.get(countryKey, "json");
        if(countryDetails == null) {
            // "Expensive" external call that we want to cache in KV
            let response = await fetch('https://restcountries.eu/rest/v2/alpha/' + country);
            countryDetails = await response.json();

            // Store country details in KV (JSON string)
            event.waitUntil(EDGE_STORE.put(countryKey, JSON.stringify(countryDetails), { expirationTtl: expiration}));
        }

        // Try get datacenter name from KV (string)
        let datacenterName = await EDGE_STORE.get(datacenterKey);
        if(datacenterName == null) {
            // "Expensive" external call that we want to cache in KV
            let response = await fetch('https://iatacodes.org/api/v6/airports?api_key=' + iataCodesApiKey + '&code=' + datacenterCode);
            let datacenterDetails = await response.json();

            datacenterName = datacenterDetails.response.name;
                
            // Store datacenterName in KV (string)
            event.waitUntil(EDGE_STORE.put(datacenterKey, datacenterName, { expirationTtl: expiration}));
        }      
        
        let greetings = [];
        for(const language of countryDetails.languages) {
            const languageCode = language.iso639_1;
            const greetingKey = 'greeting-' + languageCode;

            // Try get greeting from KV (string)
            let greeting = await EDGE_STORE.get(greetingKey);

            if(greeting == null) {
                greeting = 'Hello from ' + datacenterName;
                if(languageCode != 'en'){
                    let translationUrl = 'https://translation.googleapis.com/language/translate/v2?q=' + greeting + '&source=en&target=' + languageCode + '&source=en&key=' + cloudTranslationApiKey;

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

            greetings.push(greeting);
        };

        let body = '';
        greetings.forEach(g => {
            body += '<h1>' + g + '</h1>';
        });
        body += '<a href="/"><div><img src="' + countryDetails.flag + '" /></div></a>';

        const responseInit = { headers: {'content-type':'text/html; charset=UTF-8'} };
        return new Response(body, responseInit);       
    }
}