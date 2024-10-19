import axios from "axios";

const BASE_URL = "https://decentralithation-gemini-server.onrender.com/chat"; //Replace with System PC IP address

const getBardApi = (userMsg: any) => axios.get(BASE_URL + "?ques=" + userMsg);

export default {
  getBardApi,
};
