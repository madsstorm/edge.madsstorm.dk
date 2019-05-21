import { Router } from 'service-worker-router'
import { getLocalBody } from './localContent'

addEventListener('fetch', event => {
    event.passThroughOnException();

    event.respondWith(handle(event));
})
  
async function handle(event) {
    const body = await getLocalBody(event);
    const responseInit = { headers: {'content-type':'text/html; charset=UTF-8'} };

    return new Response(body, responseInit);
};