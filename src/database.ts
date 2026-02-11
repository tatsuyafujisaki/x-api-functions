import {initializeApp} from 'firebase-admin/app';
import {getFirestore, FieldValue} from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
// This only needs to be called once
initializeApp();

const db = getFirestore();

/**
 * Saves fetched trends to Cloud Firestore.
 *
 * @param woeid - The Where On Earth ID for the location
 * @param trends - The JSON data retrieved from the X API
 */
export async function saveTrends(woeid: number, trends: unknown) {
  try {
    const collectionRef = db.collection('trends_history');

    // Create a new document with an auto-generated ID
    const docRef = collectionRef.doc();

    const data = {
      woeid,
      trends,
      createdAt: FieldValue.serverTimestamp(),
    };

    await docRef.set(data);
    return docRef.id;
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    throw error;
  }
}
