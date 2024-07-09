import { envs } from './config'
import { MongoDatabase } from './data/mongodb'
import { AppRoutes } from './presentation/routes'
import { Server } from './presentation/server'
;(async () => {
	await main()
})()

async function main() {
	await MongoDatabase.connect({
		mongoUrl: envs.MONGO_URL,
		dbName: envs.DB_NAME,
	})

	const server = new Server({
		port: envs.PORT,
		routes: AppRoutes.routes,
	})
	await server.start()
}
