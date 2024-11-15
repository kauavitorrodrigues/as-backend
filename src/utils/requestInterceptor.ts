import { RequestHandler } from "express";

export const requestInterceptor: RequestHandler = (req, res, next) => {

    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;
    const body = JSON.stringify(req.body);
    const authorization = JSON.stringify(req.headers.authorization);

    console.log(`

        ------------------------------------------------

        ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
        ┃                 Request Log                  ┃
        ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
        ┃ Date   : ${new Date().toLocaleString()}                           
        ┃ Method : ${method}                           
        ┃ URL    : ${url}                              
        ┃ IP     : ${ip} 
        ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛                              
        
        Headers                                     
        ➡️ Authorization: ${authorization} 

        Body                                     
        ➡️ ${body}        

        ------------------------------------------------
        
    `);
    
    next();

}