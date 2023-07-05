const UserRepository = require("../database/repository/user-repository");
const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }


  async FindById(id) {
    try {
      const user = await this.repository.FindUserById(id);

      return user;
    } catch (error) {
      throw new NotFoundException(en.user_not_found);
    }
  }

  async UpdateOne(id, data){
    let updateData = {};

    data.password = "";
    data.username = "";
    data._id = "";
    data.__v = "";
    data.createdAt = "";
    data.updatedAt = "";

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        updateData[key] = value;
      }
    });
    
    try {
      const user = await this.repository.UpdateOne({id, updateData});
    
      return user;
        
    } catch (error) {
      throw new NotFoundException(en.user_not_found);      
    }    
  }

  async FilterUsers({ page, limit, data }) {
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        updateData[key] = value;
      }
    });

    try {
      const users = await this.repository.FilterUsers({
        page,
        limit,
        data: updateData,
      });
      return users;
    } catch (error) {
      throw new NotFoundException(en.user_connection_not_found);
    }
  }
}

module.exports = { UserService };
