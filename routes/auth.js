const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");

const User = require("../models/user");
const Team = require("../models/team");
const TeamMemberShip = require("../models/team-membership");
const Laboratory = require("../models/laboratory");

const router = express.Router();

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return next(info);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = { _id: user._id, email: user.email, role: user.role };
        const token = jwt.sign({ user: body }, config.JWT_SECRET);

        const laboratoriesHeaded = await Laboratory.find({
          head_id: user._id,
        });

        const teamsHeaded = await Team.find({
          head_id: user._id,
        });

        const teamsMemberships = await TeamMemberShip.find({
          user_id: user._id,
          active: true,
        });

        await Promise.all(
          teamsMemberships.map((teamsMembership) =>
            Team.findOne({ _id: teamsMembership.team_id })
          )
        );

        return res.json({
          ...user._doc,
          token,
          laboratoriesHeaded,
          teamsHeaded,
          teamsMemberships,
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;
