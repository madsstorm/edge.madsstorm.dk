import { Router } from 'service-worker-router'
// import { getLocalBody } from './localContent'

const router2 = new Router();
// router.get('/', littleHandler);

addEventListener('fetch', event => {
    // event.passThroughOnException();
    const router = new Router();
    router.get('/', littleHandler);

    router.handleEvent(event)   
    // event.respondWith(handle(event));
})

const littleHandler = async ({ request, params }) => {
    return new Response('Hello')
}

// async function handle(event) {
//     const body = await getLocalBody(event);
//     const responseInit = { headers: {'content-type':'text/html; charset=UTF-8'} };

//     return new Response(body, responseInit);
// };