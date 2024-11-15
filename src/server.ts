import express, { urlencoded } from "express";
import cors from "cors";
import http from "http";
import https from "https";
import router from "./routes/main";
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

    // TODO: Configure SSL certificate
    // TODO: Run server in PORT 80 and 443

} else {
    const port: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;
    run(port, httpServer);
};