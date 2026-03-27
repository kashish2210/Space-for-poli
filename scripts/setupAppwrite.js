import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {
  VITE_APPWRITE_ENDPOINT,
  VITE_APPWRITE_PROJECT_ID,
  VITE_APPWRITE_DATABASE_ID,
  APPWRITE_API_KEY,
} = process.env;

if (!APPWRITE_API_KEY) {
  console.error("❌ Missing APPWRITE_API_KEY in .env file.");
  console.error("Please create an API key in your Appwrite console and add it to .env");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(VITE_APPWRITE_ENDPOINT)
  .setProject(VITE_APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = VITE_APPWRITE_DATABASE_ID;

// Helper to create collection if not exists
async function createCollection(collectionId, name) {
  try {
    await databases.getCollection(DB_ID, collectionId);
    console.log(`✅ Collection '${name}' already exists.`);
  } catch (error) {
    if (error.code === 404) {
      console.log(`Creating collection '${name}'...`);
      await databases.createCollection(
        DB_ID,
        collectionId,
        name,
        [Permission.read(Role.any()), Permission.create(Role.users()), Permission.update(Role.users()), Permission.delete(Role.users())]
      );
      console.log(`✅ Created collection '${name}'.`);
    } else {
      throw error;
    }
  }
}

// Helper to create attribute if not exists
async function createStringAttribute(collectionId, key, size, required = false, array = false) {
  try {
    await databases.createStringAttribute(DB_ID, collectionId, key, size, required, undefined, array);
    console.log(`  - Added string attribute: ${key}`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for attribute creation
  } catch (error) {
    if (error.code !== 409) throw error; // Ignore if already exists
  }
}

async function createIntegerAttribute(collectionId, key, required = false) {
  try {
    await databases.createIntegerAttribute(DB_ID, collectionId, key, required);
    console.log(`  - Added integer attribute: ${key}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    if (error.code !== 409) throw error;
  }
}

async function setupDatabase() {
  try {
    console.log("🚀 Starting database setup...\n");

    // 1. Comments Collection
    await createCollection('comments', 'Comments');
    await createStringAttribute('comments', 'post_id', 255, true);
    await createStringAttribute('comments', 'user_id', 255, true);
    await createStringAttribute('comments', 'user_name', 255, true);
    await createStringAttribute('comments', 'text', 10000, true);

    // 2. Bookmarks Collection
    await createCollection('bookmarks', 'Bookmarks');
    await createStringAttribute('bookmarks', 'user_id', 255, true);
    await createStringAttribute('bookmarks', 'post_id', 255, true);

    // 3. Posts Collection
    await createCollection('posts', 'Posts');
    await createStringAttribute('posts', 'author', 255, true);
    await createStringAttribute('posts', 'user_id', 255, false);
    await createStringAttribute('posts', 'tag', 255, true);
    await createStringAttribute('posts', 'content', 10000, true);
    await createIntegerAttribute('posts', 'likes', false);
    await createIntegerAttribute('posts', 'replies', false);
    await createStringAttribute('posts', 'media_url', 5000, false);
    await createStringAttribute('posts', 'media_type', 255, false);

    // 4. Media Bucket
    try {
      await storage.getBucket('media');
      console.log("✅ Bucket 'media' already exists.");
    } catch (e) {
      if (e.code === 404) {
        console.log("Creating Storage Bucket 'media'...");
        await storage.createBucket(
          'media',
          'Media Uploads',
          [Permission.read(Role.any()), Permission.create(Role.users()), Permission.update(Role.users()), Permission.delete(Role.users())],
          false,
          true,
          10000000, // 10MB limit
          ['jpeg', 'jpg', 'png', 'gif', 'mp4', 'webm']
        );
        console.log("✅ Created Bucket 'media'.");
      }
    }

    console.log("\n🎉 Setup completed successfully!");
    console.log("⚠️ Make sure to add VITE_APPWRITE_BUCKET_ID='media' to your .env file!");
  } catch (error) {
    console.error("\n❌ Setup failed:", error);
  }
}

setupDatabase();
