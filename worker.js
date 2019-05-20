addEventListener('fetch', event => {
    event.respondWith(handle(event.request))
})
  
async function handle(request) {
    let response = await fetch(request)
    response = new Response(response.body, response)
    response.headers.set('Mads', 'Madsen');
    return response
}