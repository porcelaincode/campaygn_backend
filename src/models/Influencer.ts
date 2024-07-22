import mongoose, { Document, Schema } from 'mongoose';

export interface IInfluencer extends Document {
  name: string;
  platform: string;
  followers: number;
  engagementRate: number;
  profilePicture?: string;
  bio?: string;
}

const influencerSchema: Schema<IInfluencer> = new Schema({
  name: { type: String, required: true },
  platform: { type: String, required: true },
  followers: { type: Number, required: true },
  engagementRate: { type: Number, required: true },
  profilePicture: { type: String },
  bio: { type: String },
});

export const Influencer = mongoose.model<IInfluencer>(
  'Influencer',
  influencerSchema
);
