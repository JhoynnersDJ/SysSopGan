import puppeteer from 'puppeteer';
import date from 'date-and-time';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { generarHTML } from "./PDF/FuncionPdf.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function crearPDF(id, project) {
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const imagePath = path.resolve(__dirname, 'PDF/images/Bytecreativos.png');
    const now = new Date();
    const fecha = date.format(now, 'YYYY-MM-DD');
    const fecha2 = date.format(now, 'YYYY-MM-DD');

    // Generar el HTML
    const html = generarHTML(project,fecha2);

    // Cargar el HTML en Puppeteer
    await page.setContent(html, {waitUntil: 'networkidle0'});

    // Crear el nombre del archivo con la fecha y la ID del proyecto
    const pdfPath = `report_${id}_${fecha}.pdf`;
    
    // Crear el PDF
    await page.pdf({path: pdfPath, 
                    format: 'A4',
                    displayHeaderFooter: true,

    });

    await browser.close();

    // Devolver la ruta del archivo PDF
    return pdfPath;
}
