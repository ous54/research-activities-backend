const mongoose = require("mongoose");

const User = require("../models/user");

const Team = require("../models/team");
const Laboratory = require("../models/laboratory");
const TeamMemberShip = require("../models/team-membership");
const PhdStudent = mongoose.model("phdStudent");



exports.createPhdStudent = async (req, resp) => {
  try {
    const phdStudent = await PhdStudent.create(req.body);
    resp.status(200).send(phdStudent);
  } catch (error) {
    console.log(error);
    resp.status(500).send("error");
  }
};

exports.updatePhdStudent = async (req, resp) => {
  try {
    const result = await PhdStudent.updateOne({ _id: req.body._id }, { $set: req.body });
    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.findPhdStudent = async (req, resp) => {
  try {
    const phdStudent = await PhdStudent.findById(req.params._id);
    const supervisor = await User.findOne({ _id: phdStudent.supervisor });
    const coSupervisor = await User.findOne({ _id: phdStudent.coSupervisor });

    resp.status(200).send({
      ...phdStudent._doc,
      supervisor,
      coSupervisor,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send("error");
  }
};

exports.findAllPhdStudents = async (req, resp) => {
  try {
    console.log("USER", req.user);
    const phdStudents = await PhdStudent.find();
    const result = await Promise.all(
      phdStudents.map(async (student) => {
        return {
          ...student._doc,
          supervisor: await User.findById(student.supervisor),
          coSupervisor: await User.findById(student.coSupervisor),
        };
      })
    );

    console.log(result);
    return resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    return resp.status(500).send(error);
  }
};

exports.deletePhdStudent = async (req, resp) => {
  try {
    const result = await PhdStudent.deleteOne({ _id: req.params._id });
    return resp.status(200).send(result);
  } catch (error) {
    console.log("ERROR", error);
    return resp.status(500).send(error);
  }
};

exports.findStudentsOfUser = async (req, resp) => {
  try {
    const { _id } = req.user.user;
    console.log("ID",_id)
    let laboratories = await Laboratory.find({head_id:_id})
    laboratories = laboratories.map(lab => lab._id)
    console.log('LABS',laboratories);
    let teams = await Team.find({laboratory_id:{$in: laboratories }})
    teams = teams.map(team => team._id);
    console.log('TEAMS',teams);
    let members = await TeamMemberShip.find({team_id:{$in: teams}})
    members = members.map(member => member.user_id);
    let queryUsers = [mongoose.Types.ObjectId(_id), ...members];
    console.log("MEMBERS",queryUsers);

    let students = await PhdStudent.find({ $or: [{ supervisor:{$in: queryUsers } }, { coSupervisor: {$in: queryUsers} }] })
      .populate("supervisor")
      .populate("coSupervisor");
    console.log("STUUUDENTS",students);
    return resp.status(200).send({students});
  } catch (error) {
    console.log("ERROR", error);
    return resp.status(500).send(error);
  }
};
