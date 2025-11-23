import { Schema, model, Document } from 'mongoose';

export interface ILog extends Document {
  username: string;
  action: string;
  target: string;
  timestamp: Date;
}

const logSchema = new Schema<ILog>({
  username: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Log = model<ILog>('Log', logSchema);