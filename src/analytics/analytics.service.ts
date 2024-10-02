import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Analytics, AnalyticsDocument } from 'src/shared/entities';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name)
    private readonly analyticsModel: Model<AnalyticsDocument>
  ) {}

  async create(data: Partial<Analytics>) {
    return await this.analyticsModel.create(data);
  }

  async getAnalyticsByTime(time: string = new Date().toDateString()) {
    const analytic = await this.analyticsModel.findOne({
      date: time
    });
    if (!analytic) {
      return await this.create({ date: time });
    }
    return analytic;
  }
}
