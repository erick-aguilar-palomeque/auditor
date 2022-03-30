import style from '../css/index.module.css';
import { Upload, message, Card, PageHeader } from 'antd';
const { Dragger } = Upload;
import { InboxOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
const { Title } = Typography;
import axios from 'axios';

/* Importaciones controller */
import { analizeCSV } from '../controller/ProcessCVSController';


const index = () => {

    const downloadPDF = (pdfPath) => {
        let a = document.createElement('a');
        a.href = pdfPath;
        a.target = '_blank';
        a.click();
    }

    const getResult = async (csvCode) => {
        // console.log({ csvCode });
        let response = await axios.post('/api/GeneratePDF', { csvCode });
        console.log({ response });
        if (response.data.done) {
            downloadPDF(response.data.pdfPath);
        }
        else {
            message.error(response.data.message);
        }
        // import MyPDF from '../public/files/output.pdf';

    }

    const props = {
        name: 'file',
        accept: '.csv',
        multiple: true,
        maxCount: 1,
        onChange: (info) => {
            console.log({ info })
            if (info.file.status !== 'uploading') {
                let reader = new FileReader();
                reader.onload = (e) => {
                    getResult(e.target.result);
                }
                reader.readAsText(info.file.originFileObj);
            }

            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
            <div className={style.pageHeader}>
                <Title level={3}>PROGRAMA DIAGNOSTICADOR DE COMPUTADORAS</Title>
            </div>
            <div className={style.pageContainer}>
                <Title>Cargue al archivo csv a analizar</Title>
                <Card className={style.cardUploader}>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Haz clic o arrastra el archivo .csv</p>
                        <p className="ant-upload-hint">

                        </p>
                    </Dragger>
                </Card>
            </div>
        </>
    );
}

export default index;