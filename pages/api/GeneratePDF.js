
var fs = require("fs");
import { createPDF } from '../../helpers/generatePDF/GeneratePDF';
import { analizeCSV } from '../../controller/ProcessCVSController';


export default async (req, res) => {
    const { csvCode } = req.body;
    let response = await analizeCSV(csvCode);
    console.log({ response });

    let pdfPath = await createPDF(response.result);
    return res.json({ done: response.done, json: response.json, pdfPath });
}