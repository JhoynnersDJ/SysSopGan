import PDFDocument from 'pdfkit'

//funcion para crar el reporte Pdf
export function crearPDF(dataCallback, endCallback) {
    const doc = new PDFDocument()

    //data recibe los dato
    doc.on('data', dataCallback)
    //end entrega los datos
    doc.on('end', endCallback)

    doc.end()
}