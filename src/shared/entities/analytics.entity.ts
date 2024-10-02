import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ENTITY_NAME } from '../constants';
import { Document, ObjectId } from 'mongoose';

export type AnalyticsDocument = Analytics & Document<ObjectId>;

export class FailedResponseCause {
  time: Date;
  description: string;
  stackTrace?: string;
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body: Record<string, any>;
    userId: string;
  };
}

@Schema({ timestamps: true, autoCreate: true, autoIndex: true, collection: ENTITY_NAME.ANALYTICS })
export class Analytics {
  _id: string;

  @Prop({ required: true, index: true, type: Date, default: new Date().toDateString() })
  date: string;

  @Prop({ default: 0 })
  totalMessages: number;

  @Prop({ default: 0 })
  totalRequests: number;

  @Prop({ default: 0 })
  totalQuestionsTokens: number;

  @Prop({ default: 0 })
  totalAnswersTokens: number;

  @Prop({ default: 0 })
  totalResponseTime: number;

  @Prop({ default: 0 })
  totalLikes: number;

  @Prop({ default: 0 })
  totalDisLikes: number;

  @Prop({ default: 0 })
  totalNeutral: number;

  @Prop({ default: 0 })
  averageResponseTime: number;

  @Prop({ default: 0 })
  fastestResponseTime: number;

  @Prop({ default: 0 })
  slowestResponseTime: number;

  @Prop({ default: 0 })
  successfulResponses: number;

  @Prop({ default: 0 })
  failedResponses: number;

  @Prop({ default: 0 })
  newUsers: number;

  @Prop({ default: 0 })
  activeUsers: number;

  @Prop({ default: 0 })
  totalSessions: number;

  @Prop({ type: [FailedResponseCause], default: [] })
  failedResponseCauses: FailedResponseCause[];
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
