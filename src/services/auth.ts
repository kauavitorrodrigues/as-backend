import { getCurrentDate } from "../utils/getCurrentDate"

/**
 * Validates if the provided password matches the current date formatted as "ddMMyyyy".
 *
 * @param password - The password to validate.
 * @returns `true` if the password matches the current date formatted as "ddMMyyyy", otherwise `false`.
 */
export const validatePassword = (password: string) => {
    const currentPassword = getCurrentDate().split("/").join("");
    return password === currentPassword;
}

/**
 * Creates a token by appending the current date to a default token.
 * 
 * The current date is obtained by calling `getCurrentDate()`, which is expected to return a date string
 * in the format "DD/MM/YYYY". The slashes in the date string are removed before appending it to the default token.
 * 
 * @returns {string} The generated token, which is a combination of the `DEFAULT_TOKEN` environment variable and the current date.
 */
export const createToken = (): string => {
    const currentPassword = getCurrentDate().split("/").join("");
    return `${process.env.DEFAULT_TOKEN}${currentPassword}`;
}

/**
 * Validates if the provided token matches the current token.
 *
 * @param token - The token to be validated.
 * @returns A boolean indicating whether the provided token is valid.
 */
export const validadeToken = (token: string) => {
    const currentToken = createToken();
    return token === currentToken;
}