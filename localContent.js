export async function getLocalBody(country) {
    const expiration = 3600;
    const countryKey = 'country' + country;
    const greetingKey = 'greeting' + country;

    // Try get country details from KV (JSON string) as object
    let details = await kvStorage.get(countryKey, "json");

    if(!details) {
        // "Expensive" external call that we want to cache in KV
        let response = await fetch('https://restcountries.eu/rest/v2/alpha/' + country);
        details = await response.json();

        // Store country details in KV (JSON string)
        kvStorage.put(countryKey, JSON.stringify(details), { expirationTtl: expiration});
    }

    // Try get greeting from KV (string)
    let greeting = await kvStorage.get(greetingKey);

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
        kvStorage.put(greetingKey, greeting, { expirationTtl: expiration});
    }

    let body = '<a href="/"><div><img src="' + details.flag + '" style="width:100px;" /></div></a><span>' + greeting + '</span>';
    return body;
}