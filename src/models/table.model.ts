import mongoose, {
  type InferSchemaType,
  model,
  type PaginateModel,
} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const DOCUMENT_NAME = 'Table';
export const COLLECTION_NAME = 'Tables';

const tableSchema = new mongoose.Schema(
  {
    numericalOrder: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentNumOfPeople: {
      type: Number,
      default: 0,
    },
    maxNumOfPeople: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

tableSchema.plugin(mongoosePaginate);

export type Table = InferSchemaType<typeof tableSchema>;
const tableModel = model<Table, PaginateModel<Table>>(
  DOCUMENT_NAME,
  tableSchema,
);
export default tableModel;
