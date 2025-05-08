import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API;
export default axios;
