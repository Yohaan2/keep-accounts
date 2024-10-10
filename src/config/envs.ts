import 'dotenv/config'
import env_ts from 'env-var'
const  { get } = env_ts

export const envs = {
	PORT: get('PORT').required().asPortNumber(),
	MONGO_URL: get('MONGO_URL').required().asString(),
	DB_NAME: get('MONGO_DB_NAME').required().asString(),
	JWT_SEED: get('JWT_SEED').required().asString(),
	JWT_REFRESH_SEED: get('JWT_REFRESH_SEED').required().asString(),
}
