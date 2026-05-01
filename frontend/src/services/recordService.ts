import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  Timestamp,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { notificationService } from "./notificationService";

export interface HealthRecord {
  id: string;
  fileName: string;
  type: string;
  createdAt: Timestamp;
  fileUrl: string;
  userId: string;
}

export const recordService = {
  subscribeToUserRecords: (userId: string, callback: (records: HealthRecord[]) => void) => {
    const q = query(
      collection(db, "healthRecords"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HealthRecord[];
      callback(records);
    }, (error) => {
      console.error("Error subscribing to records:", error);
    });
  },

  uploadRecord: async (userId: string, fileData: { fileName: string, type: string, fileUrl: string }) => {
    try {
      await addDoc(collection(db, "healthRecords"), {
        ...fileData,
        userId,
        createdAt: serverTimestamp()
      });

      // Create a notification for the user
      await notificationService.createNotification(userId, {
        title: "Record Uploaded",
        message: `Your ${fileData.type} "${fileData.fileName}" has been successfully uploaded.`,
        type: "success"
      });
    } catch (error) {
      console.error("Error uploading record:", error);
      throw error;
    }
  }
};
