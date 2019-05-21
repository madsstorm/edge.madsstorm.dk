import { getLocalBody } from './localContent'
import { Router } from 'service-worker-router'

addEventListener('fetch', event => {
    event.passThroughOnException();

    event.respondWith(handle(event));
})
  
async function handle(event) {
    const body = await getLocalBody(event);
    const responseInit = { headers: {'content-type':'text/html; charset=UTF-8'} };

    return new Response(body, responseInit);
};