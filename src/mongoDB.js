import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const password = process.env.MONGO_PASS;

const uri = `mongodb+srv://telegram:${password}@cluster0.vnhwptv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  const collection = client.db("CanadaImmigration").collection("rounds");
  console.log(collection);
  client.close();
});
