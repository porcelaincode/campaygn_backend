import { Request, Response } from 'express';
import { Influencer } from '../models/Influencer';
import { searchInfluencers } from '../services/elasticsearch';
import { messages } from '../config/messages';
import { logger } from '../services/logger';

export const createInfluencer = async (req: Request, res: Response) => {
  try {
    const influencer = new Influencer(req.body);
    await influencer.save();
    res.status(201).send(influencer);
  } catch (error) {
    res
      .status(400)
      .send({ error: messages.influencer.createInfluencer.error.cannotSave });
  }
};

export const searchInfluencersHandler = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.size as string) || 10;

    if (!query || typeof query !== 'string') {
      return res.status(400).send({
        error: messages.influencer.searchInfluencersHandler.error.invalidQuery,
      });
    }

    const from = (page - 1) * pageSize;
    const results = await searchInfluencers(query, from, pageSize);

    res.send(results);
  } catch (error) {
    res.status(500).send({
      error:
        messages.influencer.searchInfluencersHandler.error.internalServerError,
    });
  }
};

export const getInfluencerById = async (req: Request, res: Response) => {
  try {
    const { influencerId } = req.params;

    if (!influencerId) {
      return res.status(400).send({
        error: messages.influencer.getInfluencerById.error.invalidId,
      });
    }

    const pipeline = [
      {
        $match: { _id: influencerId },
      },
      {
        $lookup: {
          from: 'influencers',
          let: { similarProfiles: '$similarProfiles' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$similarProfiles'] } } },
            {
              $project: {
                _id: 1,
                name: 1,
                profilePhoto: 1,
                topics: 1,
              },
            },
          ],
          as: 'similarProfilesDetails',
        },
      },
      {
        $addFields: {
          similarProfiles: {
            $map: {
              input: '$similarProfilesDetails',
              as: 'profile',
              in: {
                id: '$$profile._id',
                name: '$$profile.name',
                profilePhoto: '$$profile.profilePhoto',
                interests: '$$profile.topics',
              },
            },
          },
        },
      },
      {
        $project: {
          similarProfilesDetails: 0, // Exclude the raw similarProfilesDetails array
        },
      },
    ];

    const [influencer] = await Influencer.aggregate(pipeline).exec();

    if (!influencer) {
      return res.status(404).send({
        error: messages.influencer.getInfluencerById.error.notFound,
      });
    }

    res.send(influencer);
  } catch (error) {
    logger.error(error);
    res.status(500).send({
      error: messages.influencer.getInfluencerById.error.internalServerError,
    });
  }
};
