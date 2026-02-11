import axios from "axios";
import { getToken, clearToken } from "../services/authenticationService"; 

const http = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

http.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const redirectState = {hasRedirected: false};

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (redirectState.hasRedirected) return Promise.reject(error);
        const status = error.response?.status;
        const url = error.config?.url || "";
        if (!getToken()) {
            return Promise.reject(error);
        }        
        if (status === 404 && url.includes("/conversations/")) {
            redirectState.hasRedirected = true;
            console.warn("Conversation ou ressource inexistante - redirection");
            alert("Cette conversation n'existe plus");
            window.location.href = "/"
        }

        if (status === 401) {
            redirectState.hasRedirected = true;
            console.warn("Session invalide - déconnexion");
            clearToken();
            window.location.href = "/"
        }
        return Promise.reject(error);
    }
);

export default http;