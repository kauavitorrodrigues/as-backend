import { RequestHandler } from "express";
import { loginSchema } from "../schemas/login";
import * as auth from "../services/auth";

/**
 * Handles the login request.
 *
 * This function validates the request body against the login schema and checks the password.
 * If the validation fails, it responds with an error message.
 * If the password is invalid, it responds with a 403 status and an error message.
 * If both validations pass, it responds with a 201 status and a token.
 *
 * @param req - The request object.
 * @param res - The response object.
 */
export const login: RequestHandler = (req, res) => {

    const data = loginSchema.safeParse(req.body);

    if (!data.success) {
        res.json({ error: "Dados Inválidos" });
        return;
    }

    if(!auth.validatePassword(data.data.password)) {
        res.status(403).json({ error: "Acesso negado" });
        return
    }

    res.status(201).json({
        token: auth.createToken() 
    });    

}

/**
 * Handles the ping request to check if the user is authenticated.
 * 
 * This function checks for the presence of an authorization header in the request.
 * If the authorization header is missing or the token is invalid, it responds with a 403 status code and an error message.
 * If the token is valid, it responds with a JSON object indicating that the user is logged in.
 * 
 * @param req - The request object from the client.
 * @param res - The response object to send the response.
 * 
 * @returns void
 */
export const ping: RequestHandler = (req, res) => {

    if (!req.headers.authorization) {
        res.status(403).json({ error: "Acesso Negado" })
        return
    }

    const token = req.headers.authorization.split(" ")[1]

    if (!auth.validadeToken(token)) {
        res.status(403).json({ error: "Acesso negado" });
        return;
    }

    res.json({ logged: true });

}

/**
 * Middleware to validate the authorization token in the request headers.
 * 
 * This function checks if the `Authorization` header is present in the request.
 * If the header is missing or the token is invalid, it responds with a 403 status code
 * and an error message "Acesso Negado" (Access Denied). If the token is valid, it calls
 * the `next` middleware function.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 * 
 * @returns void
 */
export const validade: RequestHandler = (req, res, next) => {

    if (!req.headers.authorization) {
        res.status(403).json({ error: "Acesso Negado" })
        return
    }

    const token = req.headers.authorization.split(" ")[1]

    if (!auth.validadeToken(token)) {
        res.status(403).json({ error: "Acesso negado" });
        return
    }

    next();

}