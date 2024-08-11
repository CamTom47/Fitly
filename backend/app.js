"use strict"
/** Express app for fitly */

const express = require("express");
const cors = require('cors')
const { authenticateJWT } = require("./middleware/auth");

const { NotFoundError } = require("./ExpressError");

const authRoutes = require("./routes/auth");
const categoriesRoutes = require("./routes/categories");
const circuitsRoutes = require("./routes/circuits");
const equipmentsRoutes = require("./routes/equipments");
const exercisesRoutes = require("./routes/exercises");
const usersRoutes = require("./routes/users");
const workoutsRoutes = require("./routes/workouts");
const muscleGroupsRoutes = require("./routes/muscleGroups")


const app = express();

app.use(cors());
app.use(express.json());
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/circuits", circuitsRoutes);
app.use("/equipments", equipmentsRoutes);
app.use("/exercises", exercisesRoutes);
app.use("/users", usersRoutes);
app.use("/workouts", workoutsRoutes);
app.use("/muscleGroups", muscleGroupsRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generitc error handler; anything unhandled goes here */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== 'test') console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: {message, status }
    });
});

module.exports = app;