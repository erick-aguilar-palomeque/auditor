import moment from 'moment';

export default (value) => {
    try {
        let date = moment(new Date(value));
        return date.format("DD/MM/YYYY HH:mm:ss");
    }
    catch (e) {
        return '';
    }
}