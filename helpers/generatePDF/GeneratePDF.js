//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");


const GeneratePDF = {};

GeneratePDF.createPDF = async (data) => {
    let name = Date.now();
    // console.log({ data })
    // Read HTML Template
    var html = fs.readFileSync('./helpers/generatePDF/template.html', "utf8");

    var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
    };

    let datos = {
        result: 'Excelente',
        fecha: '16 marzo 2020',
        caracteristicas: {
            discoDuro: {
                valor: '1TB',
                puntaje: '8 puntos'
            },
            microprocesador: {
                hilo: {
                    valor: '4 hilos',
                    puntaje: '2 puntos'
                },
                velocidad: {
                    valor: '3000MHz',
                    puntaje: '4 puntos'
                },
                puntaje: '6 puntos'
            },
            memoriaRAM: {
                valor: '8GB',
                puntaje: '4 puntos'
            },
            puntaje: '16 puntos'
        }
    };

    var document = {
        html: html,
        data: datos,
        path: `./public/files/${name}.pdf`,
        type: "",
    };

    let result = await pdf.create(document, options);
    return `/files/${name}.pdf`;
}

module.exports = GeneratePDF;