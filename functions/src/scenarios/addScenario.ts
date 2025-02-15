// functions/src/scenarios/addScenario.ts
import { onCall } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { Scenario } from '../types';

export const addScenario = onCall({ cors: true }, async (request) => {
  logger.info('addScenario called', { structuredData: true });

  // Ensure the user is authenticated
  const user = request.auth;
  if (!user) {
    throw new Error('Authentication required');
  }

  const { scenarioText } = request.data;
  if (!scenarioText || scenarioText.length < 10) {
    throw new Error('Scenario text is too short.');
  }

  const db = getFirestore();
  const scenario: Scenario = {
    scenarioText,
    rating: 1000, // Default Elo rating
    timesShown: 0,
    timesChosen: 0,
    createdBy: user.uid,
    createdAt: Timestamp.now(),
  };

  const docRef = await db.collection('scenarios').add(scenario);
  return { id: docRef.id, ...scenario };
});
