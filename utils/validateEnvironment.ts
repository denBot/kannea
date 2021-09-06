
import Joi from "joi";
import * as dotenv from "dotenv";

export const getValidatedEnv = () => {
  dotenv.config();
    
  const validationSchema = Joi
    .object()
    .keys({
        NODE_ENV: Joi.string().valid("test", "development", "production").required(),
        SESSION_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        SERVER_PORT: Joi.number().port().default(3000),
        MAX_FILESIZE_MB: Joi.number().default(200),
    })
    .unknown();
  
    const { value: env, error } = validationSchema.validate(process.env);

    if (error) {
      throw new Error(`Invalid environment: ${error.message}`);
    }
    
    return env;
}