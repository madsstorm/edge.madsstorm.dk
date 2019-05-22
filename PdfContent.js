export class PdfContent {
    async CreateResponse({event}) {

        const responseInit = { headers: {'content-type':'application/pdf'} };
        return new Response('pdf', responseInit);
    }
}