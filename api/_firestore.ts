import { Firestore } from '@google-cloud/firestore'

const credentials = JSON.parse(process.env.FIREBASE_SERVICE_KEY || '{}')
export const firestore = new Firestore({
  credentials,
  projectId: credentials.project_id,
})
