const UserRepository = require("../database/repository/user-repository");
const AuthException = require("../error/auth-exception");
const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");
const bcrypt = require("bcrypt");
const config = require("config");
const jwtConfig = config.get("jwt");
const jwt = require("jsonwebtoken");

class AuthService {
  constructor() {
    this.repository = new UserRepository();
  }

  async UserSignUp(userInput){
    const {username, password, lastname, firstname} = userInput;

    try {
      const existingUser = await this.repository.FindUserByUsername({username});

      if(!existingUser){
        const hashedPassword = bcrypt.hashSync(password, 12);
        
        this.repository.CreateUser({firstname, lastname, username, password: hashedPassword});

        return true;
      }

      throw new AuthException(en.username_exists, 409);
    } catch (error) {

      if(error.status === 409){
        throw new AuthException(en.username_exists, 409);
      }
      
      throw new AuthException(en.user_creation_error);
    }

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
          const secretKey = jwtConfig.secret;
          const token = jwt.sign({username}, secretKey, { expiresIn: "1d" });
          return {user: existingUser, token};
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
