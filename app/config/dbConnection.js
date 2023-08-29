const mongoose = require('mongoose');
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || "czcrm_generic";

function connectToMongo(DB) {
  try {
    if(DB =='' || DB == undefined){
        DB=DB_NAME;
    }
    const connectionUri = `mongodb://${DB_HOST}:${DB_PORT}/${DB}`;
    const options  = {useNewUrlParser: true,useUnifiedTopology: true}
    mongoose.connect(connectionUri,options);
    const dbConnection = mongoose.connection;
    dbConnection.on('error', (error) => {
        console.error('Connection error:', error);
    });
    dbConnection.once('open', () => {
        console.log('Connected to initial database : '+dbConnection.name);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

function changeMongoDB(DB_NAME) {
    const dbConnection = mongoose.connection.useDb(DB_NAME);
    dbConnection.on('error', (error) => {
        console.error('Connection error:', error);
    });
    dbConnection.once('open', () => {
        console.log('Switched to database : '+dbConnection.name);
    });
}
module.exports = {connectToMongo,changeMongoDB};
