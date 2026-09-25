import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId)

let cachedApp: FirebaseApp | null = null
let cachedDb: Firestore | null = null

export const getFirebaseApp = (): FirebaseApp => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase environment variables are not set.')
  }
  if (!cachedApp) {
    cachedApp = getApps().length ? getApp() : initializeApp(config)
  }
  return cachedApp
}

export const getDb = (): Firestore => {
  if (!cachedDb) {
    cachedDb = getFirestore(getFirebaseApp())
  }
  return cachedDb
}
