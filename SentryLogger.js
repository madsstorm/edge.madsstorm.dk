export class SentryLogger {
    async promisifiedSentryLog(ex) {

        const data = {
            project: sentryProjectId,
            logger: "javascript",
            platform: "javascript",
            exception: {
                values: [
                    { type: "Error", value: ((ex) && (ex.message)) ? ex.message : 'Unknown' }
                ]
            }
        }

        let sentryUrl = `https://sentry.io/api/${sentryProjectId}/store/?sentry_version=7&sentry_client=raven-js%2F3.24.2&sentry_key=${sentryAPIKey}&sentry_secret=${sentrySecretKey}`
        
        return fetch(sentryUrl, { body: JSON.stringify(data), method: 'POST' })
    }
}