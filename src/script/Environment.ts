class Environment {
  public static isInDevelopment: boolean = process.env.NODE_ENV === 'development';
}

export default Environment;
