import mongoose, { type Model, type Types } from 'mongoose';

export interface IContentRevision {
  version: number;
  content: string;
  createdAt: Date;
}

export interface IContentGeneration {
  userId: Types.ObjectId;
  title: string;
  contentType: string;
  requestKey?: string;
  input: {
    topic: string;
    description: string;
    targetAudience?: string;
    tone: string;
    language: string;
    customLanguage?: string;
    wordCount?: number;
    keywords: string[];
    additionalInstructions?: string;
    recipient?: string;
    platform?: string;
    callToAction?: string;
    productName?: string;
    features: string[];
    benefits: string[];
    outlinePreference?: boolean;
  };
  generatedContent: string;
  revisions: IContentRevision[];
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

const contentRevisionSchema = new mongoose.Schema<IContentRevision>(
  {
    version: { type: Number, required: true, min: 1 },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  {
    _id: false,
    versionKey: false,
  },
);

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
    requestKey: {
      type: String,
      trim: true,
    },
    input: {
      topic: { type: String, required: true },
      description: { type: String, required: true },
      targetAudience: String,
      tone: { type: String, required: true },
      language: { type: String, required: true },
      customLanguage: String,
      wordCount: Number,
      keywords: { type: [String], default: [] },
      additionalInstructions: String,
      recipient: String,
      platform: String,
      callToAction: String,
      productName: String,
      features: { type: [String], default: [] },
      benefits: { type: [String], default: [] },
      outlinePreference: Boolean,
    },
    generatedContent: {
      type: String,
      default: '',
    },
    revisions: {
      type: [contentRevisionSchema],
      default: [],
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
contentGenerationSchema.index({ userId: 1, status: 1, createdAt: -1 });
contentGenerationSchema.index(
  { userId: 1, requestKey: 1 },
  {
    unique: true,
    partialFilterExpression: { requestKey: { $type: 'string' } },
  },
);

export const ContentGeneration =
  (mongoose.models.ContentGeneration as
    | Model<IContentGeneration>
    | undefined) ??
  mongoose.model<IContentGeneration>(
    'ContentGeneration',
    contentGenerationSchema,
  );

