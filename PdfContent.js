const PDFDocument = require('pdfkit');

export class PdfContent {
    async CreateResponse({event}) {

        const doc = new PDFDocument;

        const responseInit = { headers: {'content-type':'application/pdf'} };
        return new Response('pdf', responseInit);
    }
}