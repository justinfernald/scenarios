// functions/src/users/onUserCreate.ts
import { auth } from 'firebase-functions/v1';
import { logger } from 'firebase-functions/v2';
import { getFirestore } from 'firebase-admin/firestore';

export const onUserCreate = auth.user().onCreate(async (user) => {
  const db = getFirestore();

  // Default user data
  const userData = {
    uid: user.uid,
    email: user.email || '',
    credibility: 100, // Default credibility score
    createdAt: new Date(),
    scenariosCreated: 0,
    scenariosVotedOn: 0,
  };

  try {
    // Add the user to the Firestore `users` collection
    await db.collection('users').doc(user.uid).set(userData);
    logger.info(`New user created: ${user.uid}`);
  } catch (error) {
    logger.error(`Error creating user document: ${error}`);
  }
});
