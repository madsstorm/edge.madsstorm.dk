import { Router } from 'service-worker-router'
import { LocalizedContent } from './LocalizedContent'
import { PdfContent } from './PdfContent'

addEventListener('fetch', event => {
    const localized = new LocalizedContent();
    const pdf = new PdfContent();

    const router = new Router();   
    router.get('/', localized.CreateResponse);
    router.get('/pdf', pdf.CreateResponse);
    router.get('/*', notFoundHandler);

    router.handleEvent(event);
})

const notFoundHandler = async ({ request, params }) => {
    return new Response('Page not found :(')
}