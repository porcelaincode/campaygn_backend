import { Client } from '@elastic/elasticsearch';
import { config } from '../config/config';
import { logger } from './logger';

const client = new Client({
  node: `http://${config.elasticsearch.host}:${config.elasticsearch.port}`,
});

export interface Influencer {
  name: string;
  // Add other relevant fields here
}

export interface SearchHit<T> {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: T;
}

export async function searchInfluencers(
  query: string,
  from: number = 0,
  size: number = 10
): Promise<Influencer[] | void> {
  try {
    const response = await client.search({
      index: 'influencers',
      body: {
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: query,
                  fields: [
                    'name^3',
                    'biography',
                    'tags',
                    'socialMediaLinks.facebook',
                    'socialMediaLinks.instagram',
                  ],
                  fuzziness: 'AUTO',
                },
              },
              {
                bool: {
                  should: [{ term: { tags: query.toLowerCase() } }],
                },
              },
              {
                bool: {
                  should: [
                    { match: { 'homeAddress.street': query } },
                    { match: { 'homeAddress.city': query } },
                    { match: { 'homeAddress.state': query } },
                    { match: { 'homeAddress.country': query } },
                  ],
                },
              },
              {
                bool: {
                  should: [
                    {
                      match: {
                        topics: {
                          query: query,
                          operator: 'or',
                          fuzziness: 'AUTO',
                        },
                      },
                    },
                  ],
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
        from: from,
        size: size,
        _source: true,
      },
    });

    // Extract only the _source field from the response
    const hits: Influencer[] = response.hits.hits.map(
      (hit) => hit._source
    ) as Influencer[];

    return hits;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
