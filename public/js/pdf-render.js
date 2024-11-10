/**
 * Renders the first page of a PDF file in a container.
 * @param {string} pdfUrl - The URL or file path of the PDF to render.
 */
async function renderPDF(pdfUrl) {

    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    const container = document.getElementById('pdf-render-container');
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(1);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: 1 });
    canvas.width = viewport.width;  // Set canvas width based on scaled viewport
    canvas.height = viewport.height;  // Set canvas height to maintain aspect ratio
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    container.appendChild(canvas);
}