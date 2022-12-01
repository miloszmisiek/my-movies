import axios from "axios";

const DEV = false;
const devURL = "https://localhost:7151/";
const prodURL = "https://mymovies-task.azurewebsites.net/";

DEV ? (axios.defaults.baseURL = devURL) : prodURL;
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

export const axiosReq = axios.create();
export const axiosRes = axios.create();
