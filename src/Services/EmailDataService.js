import axios from "axios";

// Use environment vars for backend API URL. Example: "https://example.com" (do not end with trailing slash)
const API_HOST = process.env.REACT_APP_API_HOST;

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
    async getNameList(gender){
        if(gender=="Male"){
            return await axios.get("https://raw.githubusercontent.com/somik123/random-names/main/male_names.txt");
        }
        else if(gender=="Female"){
            return await axios.get("https://raw.githubusercontent.com/somik123/random-names/main/female_names.txt");
        }
        else if(gender=="Username"){
            return await axios.get("https://raw.githubusercontent.com/somik123/random-names/main/usernames.txt");
        }
    }
}

export default new EmailDataService();
