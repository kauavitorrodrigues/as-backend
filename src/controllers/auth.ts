import { RequestHandler } from "express";
import { loginSchema } from "../schemas/login";
import * as auth from "../services/auth";

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

export const validade: RequestHandler = (req, res, next) => {

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

    next();

}