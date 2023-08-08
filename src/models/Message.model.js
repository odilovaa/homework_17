const {v4: uuid} = require("uuid")

class Message {
    constructor(type, value)
    {
        this.id = uuid(),
        this.type = type,
        this.value = value
    }
}

module.exports = Message;