import mongoose, { Schema } from 'mongoose';

const StudentSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  course: String
});

const StudentModel = mongoose.model('Student', StudentSchema);

export default StudentModel;