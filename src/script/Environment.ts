class Environment {
    public static inDevelopment: boolean = process.env.NODE_ENV === "development";
}

export default Environment;