import { Router } from 'service-worker-router'
import { getLocalBody } from './localContent'

addEventListener('fetch', event => {
    const router = new Router();
    router.get('/', localizedHandler);
    router.get('/hello', helloHandler);
    
    router.get('/*', notFoundHandler);

    router.handleEvent(event)   
})

const helloHandler = async ({ request, params }) => {
    return new Response('Hello')
}

const notFoundHandler = async ({ request, params }) => {
    return new Response('Page not found')
}

const localizedHandler = async ({ event }) => {
    const body = await getLocalBody(event);
    const responseInit = { headers: {'content-type':'text/html; charset=UTF-8'} };
    return new Response(body, responseInit);
}
