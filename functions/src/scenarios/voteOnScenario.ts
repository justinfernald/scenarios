// functions/src/scenarios/voteOnScenario.ts
import { onCall } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { getFirestore } from 'firebase-admin/firestore';

export const voteOnScenario = onCall({ cors: true }, async (request) => {
  logger.info('voteOnScenario called', { structuredData: true });

  const { scenarioAId, scenarioBId, chosenScenarioId } = request.data;
  if (!scenarioAId || !scenarioBId || !chosenScenarioId) {
    throw new Error('Scenario IDs are required.');
  }

  const db = getFirestore();
  const scenarioARef = db.collection('scenarios').doc(scenarioAId);
  const scenarioBRef = db.collection('scenarios').doc(scenarioBId);
  const userRef = db.collection('users').doc(request.auth?.uid || 'anonymous');

  const [scenarioADoc, scenarioBDoc, userDoc] = await Promise.all([
    scenarioARef.get(),
    scenarioBRef.get(),
    userRef.get(),
  ]);

  if (!scenarioADoc.exists || !scenarioBDoc.exists || !userDoc.exists) {
    throw new Error('Scenario or user not found.');
  }

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const scenarioA = scenarioADoc.data()!;
  const scenarioB = scenarioBDoc.data()!;
  const user = userDoc.data()!;
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  // Check user credibility
  const credibilityThreshold = 50;
  if (user.credibility < credibilityThreshold) {
    return {
      success: true,
      message: 'Vote recorded but not applied due to low credibility.',
    };
  }

  // Calculate new ratings
  const K = 32;
  const expectedA = 1 / (1 + Math.pow(10, (scenarioB.rating - scenarioA.rating) / 400));
  const expectedB = 1 / (1 + Math.pow(10, (scenarioA.rating - scenarioB.rating) / 400));

  const newRatingA =
    scenarioA.rating +
    K * (chosenScenarioId === scenarioAId ? 1 - expectedA : 0 - expectedA);
  const newRatingB =
    scenarioB.rating +
    K * (chosenScenarioId === scenarioBId ? 1 - expectedB : 0 - expectedB);

  // Update scenario ratings
  await Promise.all([
    scenarioARef.update({
      rating: newRatingA,
      timesShown: scenarioA.timesShown + 1,
      timesChosen:
        chosenScenarioId === scenarioAId
          ? scenarioA.timesChosen + 1
          : scenarioA.timesChosen,
    }),
    scenarioBRef.update({
      rating: newRatingB,
      timesShown: scenarioB.timesShown + 1,
      timesChosen:
        chosenScenarioId === scenarioBId
          ? scenarioB.timesChosen + 1
          : scenarioB.timesChosen,
    }),
  ]);

  // Adjust user credibility based on scenario stability and rating difference
  const ratingDifference = Math.abs(scenarioA.rating - scenarioB.rating);
  const isChoiceExpected =
    chosenScenarioId ===
    (scenarioA.rating > scenarioB.rating ? scenarioAId : scenarioBId);

  let credibilityChange = 0;
  if (ratingDifference > 200) {
    // Large rating difference: credibility change is amplified
    credibilityChange = isChoiceExpected ? 1 : -2;
  } else if (ratingDifference > 100) {
    // Moderate rating difference: standard credibility change
    credibilityChange = isChoiceExpected ? 1 : -1;
  } else {
    // Small rating difference: credibility change is reduced
    credibilityChange = isChoiceExpected ? 0.5 : -0.5;
  }

  // Update user credibility
  const newCredibility = user.credibility + credibilityChange;
  await userRef.update({ credibility: newCredibility });

  return { success: true };
});
