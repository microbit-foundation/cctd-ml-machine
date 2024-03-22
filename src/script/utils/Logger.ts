import Environment from "../Environment"

class Logger {
    /**
     * Logs a message in development environment 
     */
    public static log(origin: any, message: any, ...params: any[]) {
        Environment.isInDevelopment && console.log(`[${origin}] ${message}`, params);
    }
}

export default Logger;