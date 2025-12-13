import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("my-shop");

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("\n📚 Collections in database:");
    collections.forEach((col) => console.log(`  - ${col.name}`));

    // Check each collection for products
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`\n📦 ${col.name}: ${count} documents`);

      if (count > 0) {
        const sample = await db.collection(col.name).findOne();
        console.log("Sample document:", JSON.stringify(sample, null, 2));
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

main();
