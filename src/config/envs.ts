import 'dotenv/config'
import env_ts from 'env-var'
const  { get } = env_ts

export const envs = {
	PORT: get('PORT').asPortNumber(),
	MONGO_URL: get('MONGO_URL').asString(),
	DB_NAME: get('MONGO_DB_NAME').asString(),
	JWT_SEED: get('JWT_SEED').asString(),
	JWT_REFRESH_SEED: get('JWT_REFRESH_SEED').asString(),
}
