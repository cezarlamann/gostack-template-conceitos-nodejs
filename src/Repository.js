const { uuid } = require("uuidv4");
class Repository {
  constructor(title, url, techs) {
    this.id = uuid();
    this.title = title;
    this.url = url;
    this.techs = techs ? techs : [];
    this.likes = 0;

    this.likeRepo = function () {
      this.likes++;
    };
  }
}
exports.Repository = Repository;
