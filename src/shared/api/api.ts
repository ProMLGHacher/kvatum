import axios from "axios";

export const $baseURL = "https://kvatum.store";
// export const $baseURL = "https://8f5b-194-104-136-111.ngrok-free.app";

export const $api = axios.create({
    baseURL: $baseURL,
    headers: {
        "ngrok-skip-browser-warning": "69420"
    }
});

