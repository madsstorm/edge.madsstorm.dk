export class LocalizedContent {
    async CreateResponse({event}) {
        const expiration = 120;
        const country = event.request.headers.get('CF-IPCountry');
        const countryKey = 'country-' + country;
        const datacenterCode = event.request.cf.colo;


        let responseInit = { headers: {'content-type':'text/html; charset=UTF-8'} };


        // Try get country details from KV (JSON string) as object
        let countryDetails = await EDGE_STORE.get(countryKey, "json");
        if(countryDetails == null) {
            // "Expensive" external call that we want to cache in KV
            let response = await fetch('https://restcountries.eu/rest/v2/alpha/' + country);
            if(response != null && response.ok) {
                countryDetails = await response.json();
                if(countryDetails != null) {
                    // Store country details in KV (JSON string)
                    event.waitUntil(EDGE_STORE.put(countryKey, JSON.stringify(countryDetails), { expirationTtl: expiration}));
                }
            }
        }
        
        let greetings = [];
        for(const language of countryDetails.languages) {
            const languageCode = language.iso639_1;
            const greetingKey = 'greeting-' + languageCode;

            // Try get greeting from KV (string)
            let greeting = await EDGE_STORE.get(greetingKey);


            responseInit.headers.storedGreeting = greeting;


            if(greeting == null || greeting == '') {
                greeting = 'Hello';
                let datacenterName = '';

                let iataResponse = await fetch('https://iatacodes.org/api/v6/airports?api_key=' + iataCodesApiKey + '&code=' + datacenterCode);


                responseInit.headers.iataResponse = JSON.stringify(iataResponse);


                if(iataResponse != null && iataResponse.ok) {
                    let datacenterDetails = await iataResponse.json();

                    responseInit.headers.datacenterDetails = JSON.stringify(datacenterDetails);



                    if(datacenterDetails != null) {
                        datacenterName = datacenterDetails.response[0].name;
                    }
                }

                if(datacenterName != '') {
                    greeting = 'Hello from ' + datacenterName;    
                }

                if(languageCode != 'en') {

                    let translationUrl = 'https://translation.googleapis.com/language/translate/v2?q=' + greeting + '&source=en&target=' + languageCode + '&source=en&key=' + cloudTranslationApiKey;
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
                event.waitUntil(EDGE_STORE.put(greetingKey, greeting, { expirationTtl: expiration}));
            }

            greetings.push(greeting);
        };

        let body = '';
        greetings.forEach(g => {
            body += '<h1>' + g + '</h1>';
        });
        body += '<a href="/"><div><img src="' + countryDetails.flag + '" /></div></a>';
        
        return new Response(body, responseInit);       
    }
}