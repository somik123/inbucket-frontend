import axios from "axios";

// URL for backend API
const API_HOST = "https://example.com"; // Do not end with trailing slash
const API_BASE_URL = API_HOST + "/api/v1/mailbox/";

class EmailDataService{
    async getEmailList(email){
        return await axios.get(API_BASE_URL + email);
    }
    async getEmailById(email,id){
        return await axios.get(API_BASE_URL + email + "/" + id);
    }
    async getEmailSourceById(email,id){
        return await axios.get(API_BASE_URL + email + "/" + id + "/source");
    }
    async deleteEmailById(email,id){
        return await axios.delete(API_BASE_URL + email + "/" + id);
    }
    async purgeEmailList(email){
        return await axios.delete(API_BASE_URL + email);
    }
    async markEmailAsRead(email,id, data){
        return await axios.patch(API_BASE_URL + email + "/" + id, data);
    }
    async getNameList(){
        return await axios.get("https://raw.githubusercontent.com/somik123/random-names/main/names.txt");
    }
}

export default new EmailDataService();
