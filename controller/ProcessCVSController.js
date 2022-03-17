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
            speed:  parseInt(cpuArray[5].split('MHz')[0]) 
        },
        hardDrive: {
            capacity: totalHardDriveCapacity
        },
        memory: {
            capacity: parseInt(RAMArray[2].split('MB')[0])
        }
    }

}

/**
 * Evalua los datos de interes en base a las reglas de asociación
 * @param {} data Datos de interes previamente filtrados del csv 
 */
const evalueData =(data)=>{

    var puntajeDiscoDuro= (data.hardDrive.capacity>931000?8:(data.hardDrive.capacity<465000?2:4));
    var puntajeHiloProcesador= (data.cpu.thread>4?4:(data.cpu.thread<4?1:2));
    var puntajeVelocidadProcesador=(data.cpu.speed>2500?4:(data.cpu.speed<2000?1:2));
    var puntajeMemoriaRam= (data.memory.capacity>8192?8:(data.memory.capacity<8000?2:4));
    let puntajeTotal=puntajeDiscoDuro + puntajeHiloProcesador + puntajeVelocidadProcesador + puntajeMemoriaRam;

    let datos = {
        result: (puntajeTotal>17?'Excelente':(puntajeTotal<10?'Deficiente':'Regular')),
        fecha: '17 marzo 2020',
        caracteristicas: {
            discoDuro: {
                valor: data.hardDrive.capacity + ' MB',
                puntaje: puntajeDiscoDuro + ' Puntos'
            },
            microprocesador: {
                hilo: {
                    valor: data.cpu.thread + ' hilos',
                    puntaje: puntajeHiloProcesador + ' Puntos'
                },
                velocidad: {
                    valor: data.cpu.speed + ' MHz',
                    puntaje: puntajeVelocidadProcesador + ' Puntos'
                },
                puntaje: (puntajeHiloProcesador + puntajeVelocidadProcesador) + ' Puntos'
            },
            memoriaRAM: {
                valor: data.memory.capacity + ' MB',
                puntaje: puntajeMemoriaRam + ' Puntos'
            },
            puntaje: puntajeTotal + ' Puntos'
        }
    };

    return datos;
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

    /* Llamar al metodo que evalua los datos y retornarlo */
    let result= evalueData(data);

    return {
        done, message, result, json
    }
}

module.exports = ProcessCSVController;