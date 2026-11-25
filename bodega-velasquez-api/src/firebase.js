const { applicationDefault, cert, getApps, initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const projectId = process.env.FIREBASE_PROJECT_ID || 'bodega-aab6f';
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!projectId) {
  throw new Error('FIREBASE_PROJECT_ID must be configured');
}

let credential = applicationDefault();
if (serviceAccountJson) {
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON', { cause: error });
  }
  credential = cert({
    ...serviceAccount,
    private_key: serviceAccount.private_key?.replace(/\\n/g, '\n')
  });
} else if (credentialPath) {
  credential = applicationDefault();
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential, projectId });

const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { app, auth, db, FieldValue };
