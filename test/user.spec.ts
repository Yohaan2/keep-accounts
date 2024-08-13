import { use, expect } from 'chai'
import sinon, { SinonStub} from 'sinon'
import sinonChai from 'sinon-chai'
use(sinonChai)
import { AuthController } from '../src/presentation/auth/auth.controller.ts'
import { AuthRepositoryImpl } from '../src/infrastructure/repositories/auth.repositories.impl.ts'
import { JwtAdapter } from '../src/config/jwt.ts'
import { FastifyReply, FastifyRequest } from 'fastify'
import { RegisterUserDto } from '../src/domain/index.ts'
import { RegisterUserRequest } from '../src/presentation/auth/auth.types.ts'
const sandbox = sinon.createSandbox()

describe('User', () => {
	let controllerStub: AuthController;
  let authRepositoryMock: sinon.SinonStubbedInstance<AuthRepositoryImpl>;
  let jwtAdapterMock: sinon.SinonStubbedInstance<JwtAdapter>;

	beforeEach(() => {
		authRepositoryMock = sinon.createStubInstance(AuthRepositoryImpl);
    jwtAdapterMock = sinon.createStubInstance(JwtAdapter);
		controllerStub = new AuthController(authRepositoryMock, jwtAdapterMock)
	})
	afterEach(()=>{
      sandbox.restore();
    })
    
	it('should be able to create a user', async () => {
		const mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'John Doe'
        }
      } as FastifyRequest<RegisterUserRequest>;

			const reply = {
        statusCode: 0,
        setCookie: sinon.stub(),
        send: sinon.stub()
      } as unknown as FastifyReply;

		const mockUser = {
			id: '1',
			name: 'John Doe',
			email: 'test@example.com', 
			password: 'password123',
			roles: ['user'],
		};

		sinon.stub(RegisterUserDto, 'create').returns([undefined, {} as RegisterUserDto]);
		authRepositoryMock.register.resolves(mockUser)
		jwtAdapterMock.generateToken.resolves('token')
		jwtAdapterMock.generateRefreshtoken.resolves('refresh_token')

		await controllerStub.register(mockRequest, reply)

		const { password, ...responseUser } = mockUser
		
		expect(reply.statusCode).to.equal(201)
		expect((reply.send as SinonStub).calledOnce).to.be.true
		expect((reply.send as SinonStub).firstCall.args[0]).to.deep.equal({
			access_token: 'token',
			user: responseUser
		})
	})
})
