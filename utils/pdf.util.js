const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
 
async function getPdfData(pdfPath) {
    try {
      //  const resolvedPath = path.resolve(__dirname, '../public', pdfPath);
    //const resolvedPath = path.resolve(__dirname, '../public', pdfPath);

        let resolvedPath = path.resolve("./" + 'public' + pdfPath);

        const dataBuffer = fs.readFileSync(resolvedPath);

        const data = await pdf(dataBuffer);

        console.log({
            pages: data.numpages,
            renderedPages: data.numrender,
            info: data.info,
            metadata: data.metadata,
            version: data.version,
            text: data.text
        });

        const cleanedText = data.text
            .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with a single space
            .replace(/Page \d+ of \d+/g, '') // Remove page numbers if included in text
            .trim(); // Remove leading/trailing spaces

        data.cleanedText = cleanedText;    
        return data;
    } catch (error) {
        console.error('Error reading PDF:', error);
        throw error;
    }
}


module.exports = { getPdfData };