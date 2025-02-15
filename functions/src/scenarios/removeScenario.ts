// functions/src/scenarios/removeScenario.ts
import { onCall } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { getFirestore } from 'firebase-admin/firestore';

export const removeScenario = onCall({ cors: true }, async (request) => {
  logger.info('removeScenario called', { structuredData: true });

  const { scenarioId } = request.data;
  if (!scenarioId) {
    throw new Error('Scenario ID is required.');
  }

  const db = getFirestore();
  const scenarioRef = db.collection('scenarios').doc(scenarioId);
  const scenarioDoc = await scenarioRef.get();

  if (!scenarioDoc.exists) {
    throw new Error('Scenario not found.');
  }

  if (scenarioDoc.data()?.createdBy !== request.auth?.uid) {
    throw new Error('You can only delete your own scenarios.');
  }

  await scenarioRef.delete();
  return { success: true };
});
