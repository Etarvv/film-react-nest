import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class Session {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) daytime: string;
  @Prop({ required: true }) hall: number;
  @Prop({ required: true }) rows: number;
  @Prop({ required: true }) seats: number;
  @Prop({ required: true }) price: number;
  @Prop({ type: [String], default: [] }) taken: string[];
}
export const SessionSchema = SchemaFactory.createForClass(Session);

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true, unique: true }) id: string;
  @Prop() rating: number;
  @Prop() director: string;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop() image: string;
  @Prop() cover: string;
  @Prop() title: string;
  @Prop() about: string;
  @Prop() description: string;
  @Prop({ type: [SessionSchema], default: [] }) schedule: Session[];
}

export type FilmDocument = HydratedDocument<Film>;
export const FilmSchema = SchemaFactory.createForClass(Film);
