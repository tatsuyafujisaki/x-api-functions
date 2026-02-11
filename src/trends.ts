import {Client} from '@xdevplatform/xdk';

/**
 * Reads trends from X API v2 using the official XDK.
 *
 * @param woeid - The Where On Earth ID for the location (1 for Worldwide)
 */
export async function readTrends(woeid = 1): Promise<unknown> {
  const bearerToken = process.env.BEARER_TOKEN;

  if (!bearerToken) {
    throw new Error('BEARER_TOKEN is not set in environment variables.');
  }

  // Initialize the X API Client
  const client = new Client({bearerToken});

  try {
    console.log(`\n--- Fetching Trends for WOEID: ${woeid} ---`);

    // Fetch trends using the SDK
    const response = await client.trends.getByWoeid(woeid, {
      maxTrends: 10, // Optional: limit the number of trends
    });

    return response;
  } catch (error) {
    console.error(
      'Failed to fetch trends:',
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}
