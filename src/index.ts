import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { readTrends } from "./trends";
import * as dotenv from 'dotenv';

// Load environment variables for local development (Firebase emulators)
dotenv.config();

/**
 * Cloud Function to fetch X (Twitter) trends.
 *
 * Usage:
 * https://<region>-<project-id>.cloudfunctions.net/getTrends?woeid=1
 */
export const getTrends = onRequest(async (request, response) => {
  const woeidParam = request.query.woeid as string;
  const woeid = woeidParam ? parseInt(woeidParam, 10) : 1;

  if (isNaN(woeid)) {
    response.status(400).send("Invalid WOEID provided.");
    return;
  }

  try {
    logger.info(`Fetching trends for WOEID: ${woeid}`, { structuredData: true });
    const trendsResponse = await readTrends(woeid);

    // Set CORS if needed, or just return JSON
    response.set('Access-Control-Allow-Origin', '*');
    response.json(trendsResponse);
  } catch (error) {
    logger.error("Error fetching trends", { error: error instanceof Error ? error.message : error });
    response.status(500).send("Failed to fetch trends. Ensure BEARER_TOKEN is configured.");
  }
});
