import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-b5fdc.firebaseio.com/'
});

export default instance;