import { Router } from 'service-worker-router'
import { LocalizedContent } from './LocalizedContent'
import { SentryLogger } from './SentryLogger'

addEventListener('fetch', event => {
    const localized = new LocalizedContent();

    const router = new Router();   
    router.get('/', localized.CreateResponse);
    router.get('/*', notFoundHandler);

    router.handleEvent(event);
})

const notFoundHandler = async ({ request, params }) => {
    const logger = new SentryLogger();
    await logger.promisifiedSentryLog('Page not found');
    
    return new Response('Page not found :o(')
}