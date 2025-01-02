import axios from "axios";

export const $baseURL = "https://kvatum.api.araik.dev";
// export const $baseURL = "https://dbc0-85-26-164-236.ngrok-free.app";

export const $api = axios.create({
    baseURL: $baseURL,
    headers: {
        "ngrok-skip-browser-warning": "69420"
    }
});

