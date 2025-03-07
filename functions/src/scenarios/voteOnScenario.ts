// functions/src/scenarios/voteOnScenario.ts
import { onCall } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { getFirestore } from 'firebase-admin/firestore';
import { Timestamp } from 'firebase-admin/firestore';

const credibilityThreshold = 50;
const baseK = 32;
const stabilityThreshold = 5;
const largeRatingDifference = 200;
const moderateRatingDifference = 100;

export const voteOnScenario = onCall({ cors: true }, async (request) => {
  logger.info('voteOnScenario called', { structuredData: true });

  // Ensure the user is authenticated
  const authUser = request.auth;
  if (!authUser) {
    throw new Error('Authentication required');
  }

  const { acceptedId, rejectedId } = request.data;
  if (!acceptedId || !rejectedId) {
    throw new Error('Accepted and Rejected Scenario IDs are required.');
  }

  const db = getFirestore();
  const acceptedRef = db.collection('scenarios').doc(acceptedId);
  const rejectedRef = db.collection('scenarios').doc(rejectedId);
  const userRef = db.collection('users').doc(authUser.uid);

  const [acceptedDoc, rejectedDoc, userDoc] = await Promise.all([
    acceptedRef.get(),
    rejectedRef.get(),
    userRef.get(),
  ]);

  if (!acceptedDoc.exists || !rejectedDoc.exists || !userDoc.exists) {
    throw new Error('Scenario or user not found.');
  }

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const acceptedScenario = acceptedDoc.data()!;
  const rejectedScenario = rejectedDoc.data()!;
  const user = userDoc.data()!;
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  let wasConsidered = false;
  let newRatingA = acceptedScenario.rating;
  let newRatingB = rejectedScenario.rating;

  if (user.credibility >= credibilityThreshold) {
    wasConsidered = true;

    // Calculate new ratings with adjusted K factor for the first 5 times
    const K_A = Math.max(
      baseK * (stabilityThreshold - acceptedScenario.timesShown) * 2,
      baseK,
    );
    const K_B = Math.max(
      baseK * (stabilityThreshold - rejectedScenario.timesShown) * 2,
      baseK,
    );

    const expectedA =
      1 / (1 + Math.pow(10, (rejectedScenario.rating - acceptedScenario.rating) / 400));
    const expectedB =
      1 / (1 + Math.pow(10, (acceptedScenario.rating - rejectedScenario.rating) / 400));

    newRatingA = acceptedScenario.rating + K_A * (1 - expectedA);
    newRatingB = rejectedScenario.rating + K_B * (0 - expectedB);

    // Update scenario ratings
    await Promise.all([
      acceptedRef.update({
        rating: newRatingA,
        timesShown: acceptedScenario.timesShown + 1,
        timesChosen: acceptedScenario.timesChosen + 1,
      }),
      rejectedRef.update({
        rating: newRatingB,
        timesShown: rejectedScenario.timesShown + 1,
        timesChosen: rejectedScenario.timesChosen,
      }),
    ]);
  }

  // Adjust user credibility based on scenario stability and rating difference
  const ratingDifference = Math.abs(acceptedScenario.rating - rejectedScenario.rating);
  const isChoiceExpected = acceptedScenario.rating > rejectedScenario.rating;

  let credibilityChange = 0;
  if (ratingDifference > largeRatingDifference) {
    // Large rating difference: credibility change is amplified
    credibilityChange = isChoiceExpected ? 1 : -2;
  } else if (ratingDifference > moderateRatingDifference) {
    // Moderate rating difference: standard credibility change
    credibilityChange = isChoiceExpected ? 1 : -1;
  }

  if (
    acceptedScenario.timesShown >= stabilityThreshold &&
    rejectedScenario.timesShown >= stabilityThreshold
  ) {
    // Update user credibility
    const newCredibility = user.credibility + credibilityChange;
    await userRef.update({ credibility: newCredibility });
  }

  // Add a new vote document to the votes collection
  const voteData = {
    accepted: acceptedId,
    rejected: rejectedId,
    time: Timestamp.now(),
    user: authUser.uid,
    credibility: user.credibility,
    wasConsidered,
    acceptedRating: newRatingA,
    rejectedRating: newRatingB,
  };

  await db.collection('votes').add(voteData);

  return { acceptedRating: newRatingA, rejectedRating: newRatingB };
});
