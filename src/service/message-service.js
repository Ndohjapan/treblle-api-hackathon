const en = require("../../locale/en");
const NotFoundException = require("../error/not-found-exception");
const CreationException = require("../error/creation-exception");
const MessageRepository = require("../database/repository/message-repository");


class MessageService {
  constructor() {
    this.repository = new MessageRepository();
  }

  async CreateMessage(data) {
    try {
      const message = await this.repository.CreateMessage(data);

      return message;
    } catch (error) {
      throw new CreationException(en.message_creation_error, 401);
    }
  }

  async FindById(id) {
    try {
      const message = await this.repository.FindUserConnectionById(id);

      return message;
    } catch (error) {
      throw new NotFoundException(en.message_find_error);
    }
  }

  async FilterMessage({ page, limit, data }) {
    let updateData = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value != "") {
        updateData[key] = value;
      }
    });

    try {
      const messages = await this.repository.FilterMessage({
        page,
        limit,
        data: updateData,
      });
      return messages;
    } catch (error) {
      throw new NotFoundException(en.message_find_error);
    }
  }

  async DeleteMessage(id) {
    try {
      const message = await this.repository.DeleteOne(id);

      return message;
    } catch (error) {
      throw new NotFoundException(en.message_delete_error);
    }
  }
}

module.exports = { MessageService };
