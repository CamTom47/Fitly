CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    password TEXT NOT NULL,
    email TEXT,
    is_admin BOOLEAN NOT NULL
);

CREATE TABLE equipments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,
    systemDefault BOOLEAN NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    systemDefault BOOLEAN NOT NULL
);

CREATE TABLE muscleGroups (
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    muscle_group INTEGER REFERENCES muscleGroups(id),
    date_created TIMESTAMP default now()

);

CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    favorited BOOLEAN,
    date_created TIMESTAMP default now(),
    last_completed TIMESTAMP,
    times_completed INTEGER
);

CREATE TABLE circuits (
    id  SERIAL PRIMARY KEY,
    sets INTEGER,
    reps INTEGER,
    weight INTEGER,
    rest_period INTEGER,
    intensity TEXT,
    date_created TIMESTAMP default now()
);

CREATE TABLE users_workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE
);

CREATE TABLE users_exercises (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE circuits_workouts (
    id SERIAL PRIMARY KEY,
    circuit_id INTEGER REFERENCES circuits(id) ON DELETE CASCADE,
    workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE
);

CREATE TABLE circuits_exercises (
    id SERIAL PRIMARY KEY,
    circuit_id INTEGER REFERENCES circuits(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE exercises_equipments (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    equipment_id INTEGER REFERENCES equipments(id) ON DELETE CASCADE
);
