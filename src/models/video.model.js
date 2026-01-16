import mongoose, {mongo, schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new schema(
    {
        videoFile: {
            type: string,//cloudinary url
            required:true
        },
        thumbnail: {
            type: string, // cloudinary
            required: true
        },
         title: {
            type: string,
            required: true
        },
         discription : {
            type: string,
            required: true
        },
         duration: {
            type: Number, // cloudinary url
            required: true
        },
         views: {
            type: Number,
            default: 0
        },
         isPublished: {
            type: Boolean,
            default: true
        },
         owner: {
            type: schema.Types.ObjectId,
            ref: "User"
        },
    },

    {
        timstamps: true
    }
)


videoSchema.plugin(mongooseAggregatePaginate)



export const Video = mongoose.model("Video", videoSchema)