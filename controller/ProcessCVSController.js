const csv = require('csvtojson');

let ProcessCSVController = {};

const toJSON = async (csvCode) => {
    try {
        return await csv({ noheader: true, output: "csv" }).fromString(csvCode);
    }
    catch (e) {
        console.log('Entro al catch del toJSON');
        return null;
    }

}

const getData = (json) => {
    console.log({ json })
    let cpuArray = json.find(element => element[0] === '3200');
    let hardDriveArray = json.filter(element => element[0] === '3700');
    let RAMArray = json.find(element => element[0] === '3600');

    let totalHardDriveCapacity = 0;

    hardDriveArray.map((element) => {
        let capacity = parseInt(element[3].split('MB')[0]);
        totalHardDriveCapacity += capacity;
    });

    return {
        cpu: {
            thread: cpuArray[14],
            speed: cpuArray[5]
        },
        hardDrive: {
            capacity: totalHardDriveCapacity
        },
        memory: {
            capacity: parseInt(RAMArray[2].split('MB')[0])
        }
    }

}

ProcessCSVController.analizeCSV = async (csvCode) => {
    let done = true;
    let message = "CSV procesado correctamente";

    const json = await toJSON(csvCode);

    if (json === null) {
        return {
            done: false,
            message: "Ha ocurrido un error al procesar el CSV"
        };
    }

    /* Obtener datos */
    let data = getData(json);
    console.log('data');
    console.log(data);


    return {
        done, message, data: 'Deficiente', json
    }
}

module.exports = ProcessCSVController;