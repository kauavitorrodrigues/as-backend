import express, { urlencoded } from "express";
import cors from "cors";
import http from "http";
import https from "https";
import router from "./routes/main";
import fs from "fs";
import { requestInterceptor } from "./utils/requestInterceptor";

const server = express();

server.use(cors());
server.use(express.json());
server.use(urlencoded({ extended: true }));

server.all("*", requestInterceptor);

server.use(router);

const run = (port: number, server: http.Server) => {
    server.listen(port, () => {
        console.log(`🚀 Server is running at PORT ${port}`);
    });
};

const httpServer = http.createServer(server);

if(process.env.NODE_ENV === "production") {

    const options = {
        key: fs.readFileSync(process.env.SSL_KEY as string),
        cert: fs.readFileSync(process.env.SSL_CERT as string)
    };

    const httpsServer = https.createServer(options, server);

    run(80, httpServer);
    run(443, httpsServer);

} else {
    const port: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;
    run(port, httpServer);
};