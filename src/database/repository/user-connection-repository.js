const en = require("../../../locale/en");
const internalException = require("../../error/internal-exception");
const { UserConnection } = require("../model");

class UserRepository {
  async CreateUserConnection({ users }) {
    try {
      const userConnection = await UserConnection.create({ users });
      return userConnection;
    } catch (error) {
      throw new internalException(en.user_connection_creation_error);
    }
  }

  async FindUserConnectionById(id) {
    try {
      const user = await UserConnection.findById(id).populate("lastMessage");
      if (!user) throw new Error();
      return user;
    } catch (error) {
      throw new internalException(en.user_connection_find_error);
    }
  }

  async FindAll({ page, limit }) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      try {
        const options = {
          sort: { createdAt: -1 },
          page,
          limit,
        };

        UserConnection.paginate({}, options, function(err, result) {
          if (err) {
            throw Error("Error in getting user connections");
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        throw new internalException(en.user_connection_find_error);
      }
    });
  }

  async UpdateOne({ id, updateData }) {
    try {
      const user = await UserConnection.findOneAndUpdate({ _id: id },
        updateData, {
          new: true,
        }
      );
      return user;
    } catch (error) {
      throw new internalException(en.user_connection_find_error);
    }
  }

  async FilterUserConnections({ page, limit, data }) {

    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      try {
        const options = {
          sort: { createdAt: -1 },
          page,
          limit,
        };

        UserConnection.paginate(data, options, function(err, result) {
          if (err) {
            throw Error("Error in getting users");
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        throw new internalException(en.user_connection_find_error);
      }
    });
  }
}

module.exports = UserRepository;