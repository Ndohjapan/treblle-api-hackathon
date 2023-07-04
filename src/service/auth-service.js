const UserRepository = require("../database/repository/user-repository");
const AuthException = require("../error/auth-exception");
const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");

class AuthService {
	constructor() {
		this.repository = new UserRepository();
	}

	async UserSignIn(userInput) {
		const { username, password } = userInput;
		try {
			const existingUser = await this.repository.FindUserByUsername({
				username,
			});

			if (existingUser) {
				const passwordCheck = await this.repository.validatePassword({
					user: existingUser,
					password,
				});

				if (passwordCheck) {
					existingUser.password = undefined;
					return existingUser;
				}
			}

			throw new AuthException(en.login_failure);
		} catch (error) {
			throw new AuthException(en.login_failure);
		}
	}

	async FindUserById(id) {
		try {
			const user = await this.repository.FindUserById(id);

			return user;
		} catch (error) {
			throw new NotFoundException(en.user_not_found);
		}
	}
}

module.exports = { AuthService };
