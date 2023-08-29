const express = require('express');
const app = express();
const authMiddleware = require("./app/middleware/authMiddleware");
const authRouter = require("./app/router/authRouters");
const serverHost = process.env.HOST || "localhost";
const serverPort = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//app.use(authMiddleware);
app.use(authRouter);
app.listen(serverPort,serverHost,()=>console.log(`Server is running on http://${serverHost}:${serverPort}/`))

