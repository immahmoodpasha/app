import axios from "axios";

const BACKEND = process.env.BACKEND_URL || "http://localhost:3113/";

const apiClient = axios.create({
    baseURL: BACKEND,
    headers: {
        'Content-Type': 'application/json',
        //Authorization you can put if needed
    }
});

export default apiClient;

//import apiClient and then use apiClient.get('{your endpoint path}') for GET request
//use apiClient.post('{your endpoint path}', data) for POST request