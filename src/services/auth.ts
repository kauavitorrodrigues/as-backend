import { getCurrentDate } from "../utils/getCurrentDate"

export const validatePassword = (password: string) => {
    const currentPassword = getCurrentDate().split("/").join("");
    console.log(currentPassword);
    console.log(password);
    console.log(password === currentPassword);
    return password === currentPassword;
}

export const createToken = () => {
    const currentPassword = getCurrentDate().split("/").join("");
    return `${process.env.DEFAULT_TOKEN}${currentPassword}`;
}

export const validadeToken = (token: string) => {
    const currentToken = createToken();
    return token === currentToken;
}