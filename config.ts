import * as dotenv from 'dotenv';
dotenv.config();

class Config{
    // Application port
    public NODE_ENV = process.env.NODE_ENV || 'development';
    public PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

    constructor(){
        console.log("Config Class Yüklendi.");
    }
}

export default new Config();