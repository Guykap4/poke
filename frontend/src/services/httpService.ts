import Axios from 'axios';
import {HttpData} from '../types/httpData';


const axios = Axios.create({
	withCredentials: true
});

const BASE_URL = '//localhost:5000/api/'

export const httpService = {
	get(endpoint:string, data?:HttpData) {
		return ajax(endpoint, 'GET', data)
	},
	post(endpoint:string, data?:HttpData) {
		return ajax(endpoint, 'POST', data)
	},
	put(endpoint:string, data?:HttpData) {
		return ajax(endpoint, 'PUT', data)
	},
	delete(endpoint:string, data?:HttpData) {
		return ajax(endpoint, 'DELETE', data)
	}
}

async function ajax(endpoint:string, method:string = 'GET', data?:HttpData) {
	try {
		const res = await axios({
			url: `${BASE_URL}${endpoint}`,
			method,
			data,
			params: (method === 'GET') ? data : null
		});
		return res.data;
	} catch (err) {
		console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: ${data}`);
		console.dir(err);
	}
}