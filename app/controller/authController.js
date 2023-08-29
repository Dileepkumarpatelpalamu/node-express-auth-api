const authUser = require("../modal/authModal");
const  {connectToMongo,changeMongoDB} = require("../config/dbConnection");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { request } = require("express");
const authController ={};
const JWTSECRET = process.env.JWTSECRET|| "JWT@123password";
const EXPIRESIN = process.env.EXPIRESIN|| "1h";
authController.createAccount = async function(req,res){
    try{
        const result = await createAccount(req.body);
        return result;
    }catch(error){
        return error;
    }
    async function createAccount(user){
        connectToMongo();
        const plainPassword  = user.password;
        const passwordSalt = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, passwordSalt)
        user.password = hashedPassword;
        const userObject = new authUser(user);
        await userObject.validate();
        const response = await userObject.save();
        return response;
    }
}

authController.loginAccount = async function(req,res){
    try{
        const result = await loginAccount(req.body);
        return result;
    }catch(error){
        console.log(error);
        return error;
    }
    async function loginAccount(user){
        connectToMongo();
        const email  = user.email;
        const userdb = await authUser.findOne({email:email});
        if(userdb){
            const response ={};
            const dbpassword = userdb.password;
            const userStatus = await bcrypt.compare(user.password,dbpassword)
            if(userStatus){
                const token = jwt.sign({ email }, JWTSECRET, { expiresIn: EXPIRESIN });
                response.email =  userdb.email;
                response.authToken = token;
                return response;
            }else{
                return {"STATUS":"FAILED","MESSAGE":"Invalid user credentials"};
            }
        }
        else{
            return {"STATUS":"FAILED","MESSAGE":"Invalid email id"};
        }
        return userdb;
    }
}
authController.tokenVerify = async function(req,res){
    var tokenResponse = {};
    await jwt.verify(req.authToken,JWTSECRET,(error,authData)=>{
        if (!error){
            tokenResponse =  {status:"Sucess",message:"Authenticated successfully",data:authData};
        }
        else{
            tokenResponse = {status:"Failed",message:"Invalid auth token..!"}
        }
    })
    return tokenResponse;
}
authController.updateAccount = async function(req,res){
    try{
        connectToMongo();
        const {firstName,lastName,mobileNo,dateOfBirth,age} = req.body
        const updateUser = await authUser.updateOne({email:req.user.email},{firstName,lastName,mobileNo,dateOfBirth,age});
        console.log(updateUser);
        
        return {status:"Success",message:"User updated successfully",user:updateUser};
    }catch(error){
        return {status:"Failed",message:"collection updating error","errors":error};
    }
}
authController.getAccount = async function(req,res){
    try{
        connectToMongo();
        const getUsers = await authUser.find({}).select("_id firstName lastName email mobileNo dateOfBirth age");
        return {status:"Success",message:"User fetched successfully",users:getUsers};
    }catch(error){
        console.log(error)
        return {status:"Failed",message:"collection updating error","errors":error};
    }
}
authController.resetPasswrdByEmail = async function(req,res){
    try{
        connectToMongo();
        const plainPassword  = req.body.password;
        const passwordSalt = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, passwordSalt)
        const updateUser = await authUser.updateOne({email:req.user.email},{$set:{password:hashedPassword}},{new:true})
        return {status:"Success",message:"User password change successfully",user:updateUser};
    }catch(error){
        return {status:"Failed",message:"Password updating error","errors":error};
    }
}
authController.getAccountByEmail = async function(req,res){
    try{
        connectToMongo();
        const getUser = await authUser.find({$or:[{email:req.user.email},{email:req.params.email}]}).select("_id firstName lastName email mobileNo dateOfBirth age");
        return {status:"Success",message:"User fetched successfully",users:getUser};
    }catch(error){
        console.log(error)
        return {status:"Failed",message:"collection updating error","errors":error};
    }
}

module.exports=authController;