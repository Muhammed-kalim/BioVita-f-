import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  Timestamp,
  getDocs,
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

export interface Vital {
  id: string;
  heartRate: number;
  temperature: number;
  oxygenLevel: number;
  timestamp: string;
}

export interface Allergy {
  id: string;
  name: string;
  severity: "Low" | "Medium" | "High";
  reaction: string;
  createdAt: string;
}

export const healthService = {
  /**
   * Subscribe to a patient's health records.
   */
  subscribeToHealthRecords: (userId: string, callback: (records: HealthRecord[]) => void) => {
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
      console.error("Error subscribing to health records:", error);
    });
  },

  /**
   * Subscribe to a patient's vitals.
   */
  subscribeToVitals: (userId: string, callback: (vitals: Vital[]) => void) => {
    const q = query(
      collection(db, "users", userId, "vitals"),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const vitals = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Vital[];
      callback(vitals);
    }, (error) => {
      console.error("Error subscribing to vitals:", error);
    });
  },

  /**
   * Subscribe to a patient's allergies.
   */
  subscribeToAllergies: (userId: string, callback: (allergies: Allergy[]) => void) => {
    const q = query(
      collection(db, "users", userId, "allergies"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const allergies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Allergy[];
      callback(allergies);
    }, (error) => {
      console.error("Error subscribing to allergies:", error);
    });
  },

  /**
   * Add a new vital record.
   */
  addVital: async (userId: string, vital: Omit<Vital, "id" | "timestamp">) => {
    try {
      await addDoc(collection(db, "users", userId, "vitals"), {
        ...vital,
        timestamp: new Date().toISOString()
      });

      await notificationService.createNotification(userId, {
        title: "Vitals Recorded",
        message: `Your latest vitals (HR: ${vital.heartRate}, Temp: ${vital.temperature}) have been recorded.`,
        type: "info"
      });
    } catch (error) {
      console.error("Error adding vital:", error);
      throw error;
    }
  },

  /**
   * Add a new allergy.
   */
  addAllergy: async (userId: string, allergy: Omit<Allergy, "id" | "createdAt">) => {
    try {
      await addDoc(collection(db, "users", userId, "allergies"), {
        ...allergy,
        createdAt: new Date().toISOString()
      });

      await notificationService.createNotification(userId, {
        title: "Allergy Added",
        message: `New allergy "${allergy.name}" with ${allergy.severity} severity has been added.`,
        type: "warning"
      });
    } catch (error) {
      console.error("Error adding allergy:", error);
      throw error;
    }
  }
};
