const jwt = require('jsonwebtoken');
const JWTSECRET = process.env.JWTSECRET|| "JWT@123password";
const EXPIRESIN = process.env.EXPIRESIN|| "1h";
module.exports = async function authMiddleware(req,res,next){
    console.log(`Request comming from : ${req.originalUrl}`);
    next()
}
module.exports = async function tokenVerify(req,res,next){
    const token = req.headers.authorization;
    if (token !== undefined){
        const authToken = token.split(' ');
        req.authToken = authToken[1];
        var tokenResponse = {};
        await jwt.verify(req.authToken,JWTSECRET,(error,authData)=>{
            if (!error){
                tokenResponse =  {status:"Success",message:"Authenticated successfully",data:authData};
            }
            else{
                tokenResponse = {status:"Failed",message:"Invalid auth token..!"}
            }
        })
        if(tokenResponse.status == "Success"){
            req.isAuthenticated = true;
            req.user = tokenResponse.data;
            next();
        }
        else{
            return res.status(400).json(tokenResponse);
        }
    }
    else{
        res.status(400).json({message:"Authentication Token Missing"});
    }
}