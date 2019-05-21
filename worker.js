import { Router } from 'service-worker-router'
import { localizedHandler } from './localContent'

addEventListener('fetch', event => {
    const router = new Router();
    router.get('/', localizedHandler);   
    router.get('/*', notFoundHandler);

    router.handleEvent(event)   
})

const notFoundHandler = async ({ request, params }) => {
    return new Response('Page not found')
}