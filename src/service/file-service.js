const en = require("../../locale/en");
const FileUploadException = require("../error/file-upload-exception");
const UserConnectionRepository = require("../database/repository/user-connection-repository");
const cloudinary = require("cloudinary").v2;
const Formidable = require("formidable");
const config = require("config");
const cloudinaryConfig = config.get("cloudinary");
const FIVE_MB = 5 * 1024 * 1024;
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
});

class FileService {
  constructor() {
    this.repository = new UserConnectionRepository();
  }

  async UploadFile(req) {
    const form = Formidable({
      maxFiles: 1,
      maxFileSize: FIVE_MB,
      maxFields: 1,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        try {
          if (err) {
            throw err;
          }

          await this.ValidateConnectionId(fields, req.user.id);

          const isAccepted = await this.AcceptedFile(files);
          if (isAccepted) {
            const resourceType = files.file.mimetype.startsWith("video/")
              ? "video"
              : "image";
            const result = await cloudinary.uploader.upload(
              files.file.filepath,
              {
                folder: `messages/${fields.connectionId}`,
                resource_type: resourceType,
                chunk_size: 6000000,
              }
            );
            return resolve({url: result.secure_url});
          }

          throw new Error(en.file_not_supported);
        } catch (error) {
          reject(new FileUploadException([error]));
        }
      });
    });
  }

  async AcceptedFile(files) {
    const { mimetype } = files.file;
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "video/mp4",
      "video/quicktime",
    ];
    return allowedTypes.includes(mimetype);
  }

  async ValidateConnectionId(fields, userId) {
    if (fields.connectionId) {
      if (mongoose.Types.ObjectId.isValid(fields.connectionId)) {
        const userConnection = await this.repository.FindUserConnectionById(
          fields.connectionId
        );
        if (userConnection) {
          const isUserIdInConnection = userConnection.users.includes(userId);
          if (isUserIdInConnection) {
            return true;
          }
          throw new Error(en.file_to_wrong_connection);
        }

        throw new Error(en.file_to_wrong_connection);
      }

      throw new Error(en.userId_format);
    }

    throw new Error(en.id_null);
  }
}

module.exports = { FileService };
