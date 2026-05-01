import { db } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Timestamp;
}

export const notificationService = {
  /**
   * Subscribes to a user's notifications
   */
  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, "users", userId, "notifications"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      callback(notifications);
    }, (error) => {
      console.error("Error subscribing to notifications:", error);
    });
  },

  /**
   * Marks a notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    const notificationRef = doc(db, "users", userId, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
  },

  /**
   * Marks all notifications as read
   */
  async markAllAsRead(userId: string, notifications: Notification[]) {
    const unreadNotifications = notifications.filter(n => !n.read);
    const promises = unreadNotifications.map(n => 
      updateDoc(doc(db, "users", userId, "notifications", n.id), { read: true })
    );
    await Promise.all(promises);
  },

  /**
   * Creates a new notification for a user
   */
  async createNotification(userId: string, notification: Omit<Notification, "id" | "createdAt" | "read">) {
    await addDoc(collection(db, "users", userId, "notifications"), {
      ...notification,
      read: false,
      createdAt: serverTimestamp()
    });
  }
};
