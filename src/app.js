const { Bot, InputFile } = require("grammy")

const bot = new Bot("6299424649:AAHlySDXCeBfFX_1ZMk7t5UAKTVcdkHKBIg")

const Io = require("./utils/Io")
const Message = require("./models/Message.model")

const Messages = new Io("./database/messages.json")


bot.command("start", async (ctx) =>
{
    await ctx.reply(
        `<i>Assalomu alaykum</i> <b>Enter your file</b>`,

        {
            parse_mode : "HTML",
        }
    )
});

bot.on("message", async (ctx) =>
{
    if(ctx.message.text)
    {
        if(ctx.message.text.includes("id:"))
        {
            const id = ctx.message.text.split('id:')
            const messages = await Messages.read()

            const findMessage = messages.find((message) => message.id === id[1])

            if(findMessage)
            {
                if(findMessage.type == "text")
                {
                    await ctx.reply(findMessage.value);
                }
                else if(findMessage.type == "photo")
                {
                    await ctx.replyWithPhoto(findMessage.value[findMessage.value.length -1].file_id)
                }
                else if(findMessage.type == "document")
                {
                    await ctx.replyWithDocument(new InputFile(findMessage.value))
                }
                else if(findMessage.type == "video")
                {
                    await ctx.replyWithVideo(new InputFile(findMessage.value))
                }
                else if(findMessage.type == "video")
                {
                    await ctx.replyWithAudio(new InputFile(findMessage.value))
                }

            }

            return
        }
    };


    let type = "";
    let messegee = "";

    if(ctx.message.text)
        type = "text", messegee = ctx.message.text
    else if(ctx.message.photo)
        type = "photo", messegee = ctx.message.photo
    else if(ctx.message.video)
        type = "video", messegee = ctx.message.video
    else if(ctx.message.document)
        type = "document", messegee = ctx.message.document
    else if(ctx.message.audio)
        type = "audio", messegee = ctx.message.audio


    const newMessage = new Message(type,messegee);

    const messages = await Messages.read()

    const data = messages.length ? [...messages, newMessage] : [newMessage];

    await Messages.write(data)

    await ctx.reply(newMessage.id);

    
});



bot.start()