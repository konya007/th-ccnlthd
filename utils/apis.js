import axios from "axios";
import { BASE_URL } from "../configs/config";

const myAPI = axios.create({
    baseURL: BASE_URL
})

export { myAPI }