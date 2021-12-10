const MONGOPASS = process.env.MONGOPASS || "azeez007"

const config = {
  db: {
    url: `mongodb+srv://chatApp:${MONGOPASS}@cluster0.prfhs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    name: 'chatdb'
  }
}

export default config
