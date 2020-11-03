import express, { Router } from 'express';
import students from '../data/students.json';
import _ from 'lodash';
import mongoose, { Schema } from 'mongoose';
import StudentModel from '../models/StudentModel';

const router = express.Router();
let studentsArray = students;

const DB_USER = 'igor-1987';
const DB_USER_PASSWORD = '7KN2Cwxcc0Rtj7Y4';
const DB_URL = `mongodb+srv://${DB_USER}:${DB_USER_PASSWORD}@cluster0.mgaax.mongodb.net/Cluster0?retryWrites=true&w=majority`;

mongoose.connect(DB_URL);
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to Mongo DB...');
});


// const StudentSchema = mongoose.Schema({
//   _id: mongoose.Types.ObjectId,
//   name: String,
//   course: String
// });

// const StudentModel = mongoose.model('Student', StudentSchema);

router.get('/', (req, res) => {
  // res.json(students);
  StudentModel.find((err, students) => {
    if (err) res.status(500).send(err);
    res.json(students);
  });
});

router.get('/:id', (req, res) => {
  StudentModel.findById(req.params.id, (err, student) => {
    if (err) res.status(500).send(err);
    if (student) {
      res.json(student);
    } else {
      res.status(404).send(`User with id ${req.params.id} not found.`);
    }
  });
});

router.post('/', (req, res) => {
  const id = new mongoose.Types.ObjectId();
  const studentToPersist = Object.assign({ _id: id }, req.body);

  const student = new StudentModel(studentToPersist);
  student.save().then((err, student) => {
    if (err) res.status(500).send(err);
    res.json(student);
  });
});

router.put('/:id', (req, res) => {
  StudentModel.findById(req.params.id, (err, student) => {
    if (err) res.status(500).send(err);
    if (student) {
      student.name = req.body.name;
      student.course = req.body.course;
      student.save().then((err, student) => {
        if (err) res.status(500).send(err);
        res.json(student);
      });
    } else {
      res.status(404).send(`User with id ${req.params.id} not found.`);
    }
  });
});

router.delete('/:id', (req, res) => {
  StudentModel.findByIdAndRemove(req.params.id, (err, student) => {
    if (err) res.status(500).send(err);
    res.status(200).send(`Student with id ${req.params.id} was deleted.`);
  });
});

module.exports = router;