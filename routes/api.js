const express = require("express");
const passport = require("passport");
const UniversityController = require("../controllers/UniversityController");
const EstablishmentController = require("../controllers/EstablishmentController");
const LaboratoryController = require("../controllers/LaboratoryController");
const UserController = require("../controllers/UserController");
const TeamController = require("../controllers/TeamController");
const authorize = require("../helpers/authorize");
const role = require("../helpers/role");
const statisticsHelper = require("../helpers/statistics");

const router = express.Router();

/************* Users endpoints ***********/
router.post(
  "/users",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD]),
  UserController.createUser
);

router.put("/users", UserController.updateUser);

router.get(
  "/users/:_id",
  UserController.findUser
);

router.get(
  "/users",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD]),
  UserController.findAllUsers
);

router.delete(
  "/users/:_id",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD]),
  UserController.deleteUser
);

router.post("/users/:_id/update-password", UserController.updatePassword);

router.post("/upload-profile-picture", UserController.updateProfilePicture);

router.get("/laboratory-heads", UserController.getLaboratoryHeads);

router.get("/researchers", UserController.getResearchers);

/**************** Followed users endpoints  ********/

router.post("/follow", UserController.followUser);

router.get("/unfollow/:scholarId", UserController.unfollowUser);

router.get("/is-following/:scholarId", UserController.isFollowing);

router.get("/followed-users", UserController.getFollowedUsers);

router.post("/update-followed-user", UserController.updateFollowedUser);

router.get(
  "/filtering-options/:laboratoryHeadId",
  UserController.getFilteringOptions
);

/************* Universities endpoints ***********/

router.post(
  "/universities",
  authorize([role.CED_HEAD]),
  UniversityController.createUniversity
);

router.put(
  "/universities",
  authorize([role.CED_HEAD]),
  UniversityController.updateUniversity
);

router.get(
  "/universities/:_id",
  authorize([role.CED_HEAD]),
  UniversityController.findUniversity
);

router.get(
  "/universities",
  authorize([role.CED_HEAD]),
  UniversityController.findAllUniversities
);

router.delete(
  "/universities/:_id",
  authorize([role.CED_HEAD]),
  UniversityController.deleteUniversity
);

router.get(
  "/universities/:_id/establishments",
  UniversityController.getUniversityEstablishments
);

/************* Establishments endpoints ***********/

router.post(
  "/establishments",
  authorize([role.CED_HEAD]),
  EstablishmentController.createEstablishment
);

router.put(
  "/establishments",
  authorize([role.CED_HEAD]),
  EstablishmentController.updateEstablishment
);

router.get(
  "/establishments/:_id",
  authorize([role.CED_HEAD]),
  EstablishmentController.findEstablishment
);

router.get(
  "/establishments",
  authorize([role.CED_HEAD]),
  EstablishmentController.findAllEstablishments
);

router.delete(
  "/establishments/:_id",
  authorize([role.CED_HEAD]),
  EstablishmentController.deleteEstablishment
);

router.get(
  "/establishments/:_id/laboratories",
  authorize([role.CED_HEAD]),
  EstablishmentController.getEstablishmentLaboratories
);

/************* Laboratories endpoints ***********/
router.post(
  "/laboratories",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD]),
  LaboratoryController.createLaboratory
);

router.put(
  "/laboratories",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD]),
  LaboratoryController.updateLaboratory
);

router.get(
  "/laboratories/:_id",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD, role.SEARCHER_HEAD]),
  LaboratoryController.findLaboratory
);

router.get(
  "/laboratories",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD]),
  LaboratoryController.findAllLaboratories
);

router.delete(
  "/laboratories/:_id",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD]),
  LaboratoryController.deleteLaboratory
);

router.get(
  "/laboratories-of-head/:head_id",
  LaboratoryController.getLaboratoriesOfHead
);

router.get("/free-laboratories", LaboratoryController.getFreeLaboratories);

router.get(
  "/entitle-laboratory/:head_id/:lab_id",
  LaboratoryController.associateHeadToLaboratory
);

/***************** Teams endpoints **************/
router.post(
  "/teams",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD]),
  TeamController.createTeam
);

router.put(
  "/teams",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD]),
  TeamController.updateTeam
);

router.get(
  "/teams",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD, role.TEAM_HEAD]),
  TeamController.findAllTeams
);

router.get(
  "/teams/:_id",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD, role.TEAM_HEAD]),
  TeamController.findTeam
);

router.delete(
  "/teams/:_id",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD, role.TEAM_HEAD]),
  TeamController.deleteTeam
);

router.get(
  "/add-to-team/:team_id/:user_id",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD, role.TEAM_HEAD]),
  TeamController.addUserToTeam
);

router.get(
  "/remove-from-team/:team_id/:user_id",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD, role.TEAM_HEAD]),
  TeamController.removeFromTeam
);


router.get(
  "/team-head-association/:team_id/:head_id",
  authorize([role.CED_HEAD, role.LABORATORY_HEAD]),
  TeamController.associateHeadToTeam
);



router.get("/statistics", statisticsHelper.getStatistics);

router.get("/all-statistics", statisticsHelper.getAllStatistics);

module.exports = router;
