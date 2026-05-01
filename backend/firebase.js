const admin = require("firebase-admin");
const serviceAccount = require("./biovita2-firebase-adminsdk-fbsvc-f043db1045.json");

let db = null;

try {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("=========================================");
    console.log("✅ Firebase Admin SDK Initialized Successfully");
    console.log("=========================================");
  }
  db = admin.firestore();
} catch (error) {
  console.error("=========================================");
  console.error("❌ Firebase Initialization Error:", error.message);
  console.error("=========================================");
}

module.exports = { db, admin };
