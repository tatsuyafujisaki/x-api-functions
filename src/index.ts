import {onRequest} from 'firebase-functions/v2/https';
import {setGlobalOptions} from 'firebase-functions/v2';
import * as logger from 'firebase-functions/logger';
import {readTrends} from './trends';
import {saveTrends} from './database';

// Set the default region for all functions to Tokyo (asia-northeast1)
setGlobalOptions({region: 'asia-northeast1'});

// Load environment variables for local development (Firebase emulators)
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  require('dotenv').config();
}

/**
 * Cloud Function to fetch X (Twitter) trends.
 *
 * Usage:
 * https://asia-northeast1-<project-id>.cloudfunctions.net/getTrends?woeid=1
 */
export const getTrends = onRequest(async (request, response) => {
  const woeidParam = request.query.woeid as string;
  const woeid = woeidParam ? parseInt(woeidParam, 10) : 1;

  if (isNaN(woeid)) {
    response.status(400).send('Invalid WOEID provided.');
    return;
  }

  try {
    logger.info(`Fetching trends for WOEID: ${woeid}`, {structuredData: true});
    const trendsResponse = await readTrends(woeid);

    // Save to Firestore
    try {
      const docId = await saveTrends(woeid, trendsResponse);
      logger.info(
        `Successfully saved trends to Firestore with doc ID: ${docId}`,
      );
    } catch (dbError) {
      // We log the error but don't fail the entire request if DB save fails
      logger.error('Failed to save to Firestore', {error: dbError});
    }

    // Set CORS if needed, or just return JSON
    response.set('Access-Control-Allow-Origin', '*');
    console.log(JSON.stringify(trendsResponse, null, 2));
    response.json(trendsResponse);
  } catch (error) {
    logger.error('Error fetching trends', {
      error: error instanceof Error ? error.message : error,
    });
    response
      .status(500)
      .send('Failed to fetch trends. Ensure BEARER_TOKEN is configured.');
  }
});
