import axios from "axios";

const DEV = true;
const devURL = "https://localhost:7151/";
const prodURL = "https://mymovies-task.azurewebsites.net/";

axios.defaults.baseURL = DEV ? devURL : prodURL;
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

export const axiosReq = axios.create();
export const axiosRes = axios.create();
