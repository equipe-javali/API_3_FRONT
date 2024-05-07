export default function getLocalToken() {
    return localStorage.getItem("token") || "SEM TOKEN";
}