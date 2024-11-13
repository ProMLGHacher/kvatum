import axios from "axios";

export const $baseURL = "https://kvatum.store";
// export const $baseURL = "https://d83b-92-62-153-74.ngrok-free.app";

export const $api = axios.create({
    baseURL: $baseURL,
    headers: {
        "ngrok-skip-browser-warning": "69420"
    }
});

