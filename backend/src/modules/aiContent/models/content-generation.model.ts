import mongoose, { type Model, type Types } from 'mongoose';

export interface IContentGeneration {
  userId: Types.ObjectId;
  title: string;
  contentType: string;
  input: {
    topic?: string;
    description: string;
    targetAudience?: string;
    tone: string;
    language: string;
    wordCount?: number;
    keywords: string[];
    additionalInstructions?: string;
  };
  generatedContent: string;
  status: 'pending' | 'completed' | 'failed';
  provider?: string;
  model?: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const contentGenerationSchema = new mongoose.Schema<IContentGeneration>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      required: true,
      trim: true,
    },
    input: {
      topic: String,
      description: { type: String, required: true },
      targetAudience: String,
      tone: { type: String, required: true },
      language: { type: String, required: true },
      wordCount: Number,
      keywords: { type: [String], default: [] },
      additionalInstructions: String,
    },
    generatedContent: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    provider: String,
    model: String,
    usage: {
      inputTokens: { type: Number, default: 0, min: 0 },
      outputTokens: { type: Number, default: 0, min: 0 },
      estimatedCost: { type: Number, default: 0, min: 0 },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contentGenerationSchema.index({ userId: 1, createdAt: -1 });
contentGenerationSchema.index({ userId: 1, contentType: 1 });

export const ContentGeneration =
  (mongoose.models.ContentGeneration as
    | Model<IContentGeneration>
    | undefined) ??
  mongoose.model<IContentGeneration>(
    'ContentGeneration',
    contentGenerationSchema,
  );

