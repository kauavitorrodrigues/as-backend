import { RequestHandler } from "express";

export const requestInterceptor: RequestHandler = (req, res, next) => {

    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;
    const body = JSON.stringify(req.body, null, 2);

    console.log(`
        ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
        ┃                 Request Log                  ┃
        ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
        ┃ Date   : ${new Date().toLocaleString()}                           
        ┃ Method : ${method}                           
        ┃ URL    : ${url}                              
        ┃ IP     : ${ip}                               
        ┃ Body                                     
        ┃ ➡️ ${body.replace(/\n/g, '\n┃        ')}        
        ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    `);
    
    next();

}