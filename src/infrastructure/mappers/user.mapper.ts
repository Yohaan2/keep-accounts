import { CustomError, UserEntity } from '../../domain'

export class UserMapper {
	static userEntityFromObject(object: { [key: string]: any }) {
		const { id, _id, name, email, password, roles, img } = object

		if (!_id || !id) throw CustomError.BadRequest('Missing id')
		if (!name) throw CustomError.BadRequest('Missing name')
		if (!email) throw CustomError.BadRequest('Missing email')
		if (!password) throw CustomError.BadRequest('Missing password')
		if (!roles) throw CustomError.BadRequest('Missing roles')

		return new UserEntity(_id || id, name, email, password, roles)
	}
}
