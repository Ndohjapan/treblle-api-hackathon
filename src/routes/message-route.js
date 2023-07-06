const {
  validateCreateMessageInput, validateMessageId
} = require("../middleware/input-validations/message-input-validator");
const catchAsync = require("../util/catch-async");
const { rateLimiter } = require("../middleware/rate-limiter");
const {
  methodAllowed,
  setContentType,
} = require("../middleware/res-header");
const { userAuth } = require("../middleware/protect");
const { MessageService } = require("../service/message-service");
const { UserConnectionService } = require("../service/user-connection-service");
  
module.exports = async (app) => {
  const service = new MessageService();
  const userConnection = new UserConnectionService();
  
  app.use(methodAllowed({ methodAllow: "GET" }));
  app.use(setContentType);
  
  app.get(
    "/api/1.0/messages",
    rateLimiter({ secondsWindow: 60, allowedHits: 20 }),
    userAuth,
    catchAsync(async (req, res) => {
      let { page, limit, ...filters } = req.query;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      let data = filters;
      console.log(data, filters);
      const userConnections = await service.FilterMessage({page, limit, data});
      res.send(userConnections);
    })
  );
  
  app.get(
    "/api/1.0/messages/:id",
    rateLimiter({ secondsWindow: 60, allowedHits: 15 }),
    validateMessageId,
    userAuth,
    catchAsync(async (req, res) => {
      const id = req.params.id;
      const userConnection = await service.FindById(id);
      res.send(userConnection);
    })
  );
  
  app.use(methodAllowed({ methodAllow: "POST" }));
  
  app.post(
    "/api/1.0/messages",
    rateLimiter({ secondsWindow: 60, allowedHits: 10 }),
    userAuth,
    validateCreateMessageInput,
    catchAsync(async (req, res) => {
      const data = req.body;
  
      const message = await service.CreateMessage(data);
      await userConnection.UpdateOne(data.connectionId, {lastMessage: message.id});
      res.send(message);
    })
  );

  app.delete("/api/1.0/messages/:id", rateLimiter({secondsWindow: 60, allowedHits: 10}), validateMessageId, userAuth, catchAsync(async (req, res) => {
    const id = req.params.id;

    res.send(await service.DeleteMessage(id));

  }));
};
  