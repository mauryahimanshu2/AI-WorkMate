import mongoose, { type Model, type Types } from 'mongoose';

export interface IAIUsageLog {
  userId: Types.ObjectId;
  generationId: Types.ObjectId;
  provider: string;
  model: string;
  operation: 'generate';
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  status: 'success' | 'failed';
  responseTime: number;
  errorMessage?: string;
  createdAt: Date;
}

const aiUsageLogSchema = new mongoose.Schema<IAIUsageLog>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    generationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContentGeneration',
      required: true,
    },
    provider: { type: String, required: true },
    model: { type: String, required: true },
    operation: {
      type: String,
      enum: ['generate'],
      default: 'generate',
    },
    inputTokens: { type: Number, default: 0, min: 0 },
    outputTokens: { type: Number, default: 0, min: 0 },
    totalTokens: { type: Number, default: 0, min: 0 },
    estimatedCost: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['success', 'failed'],
      required: true,
    },
    responseTime: { type: Number, required: true, min: 0 },
    errorMessage: { type: String, maxlength: 500 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

aiUsageLogSchema.index({ userId: 1, createdAt: -1 });
aiUsageLogSchema.index({ generationId: 1 });
aiUsageLogSchema.index({ status: 1, createdAt: -1 });

export const AIUsageLog =
  (mongoose.models.AIUsageLog as Model<IAIUsageLog> | undefined) ??
  mongoose.model<IAIUsageLog>('AIUsageLog', aiUsageLogSchema);
