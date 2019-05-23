import { Router } from 'service-worker-router'
import { LocalizedContent } from './LocalizedContent'

addEventListener('fetch', event => {
    const localized = new LocalizedContent();

    const router = new Router();   
    router.get('/', localized.CreateResponse);
    router.get('/*', notFoundHandler);

    router.handleEvent(event);
})

const notFoundHandler = async ({ request, params }) => {
    return new Response('Page not found :o(')
}