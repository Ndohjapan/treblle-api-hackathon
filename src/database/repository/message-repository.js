const en = require("../../../locale/en");
const internalException = require("../../error/internal-exception");
const { Message } = require("../model");

class MessageRepository {
  async CreateMessage(messageData) {
    try {
      const message = await Message.create(messageData);
      message.disabled = undefined;
      return message;
    } catch (error) {
      throw new internalException(en.message_creation_error);
    }
  }

  async FindMessageById(id) {
    try {
      const message = await Message.findOne({ _id: id, disabled: false });
      message.disabled = undefined;
      if (!message) throw new Error();
      return message;
    } catch (error) {
      throw new internalException(en.message_find_error);
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
          select: "-disabled",
        };

        Message.paginate({ disabled: false }, options, function(err, result) {
          if (err) {
            throw Error("Error in getting messages");
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        throw new internalException(en.message_find_error);
      }
    });
  }

  async UpdateOne({ id, updateData }) {
    try {
      const message = await Message.findOneAndUpdate({ _id: id, disabled: false },
        updateData, {
          new: true,
        }
      );
      return message;
    } catch (error) {
      throw new internalException(en.message_find_error);
    }
  }

  async FilterMessage({ page, limit, data }) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      try {
        const options = {
          sort: { createdAt: -1 },
          page,
          limit,
          select: "-disabled",
        };

        data = {...data, disabled: false };

        Message.paginate(data, options, function(err, result) {
          if (err) {
            throw Error("Error in getting messages");
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        throw new internalException(en.message_find_error);
      }
    });
  }

  async DeleteOne(id) {
    try {
      const message = await Message.findOneAndUpdate({ _id: id, disabled: false }, { disabled: true }, { new: true });
      if (!message) throw new Error();
      return message;
    } catch (error) {
      throw new internalException(en.message_delete_error);
    }
  }
}

module.exports = MessageRepository;