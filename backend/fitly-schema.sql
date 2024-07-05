CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    password TEXT,
    email = TEXT,
    is_admin = BOOLEAN,
    CHECK(LENGTH(password >= 6))
)

CREATE TABLE users_workouts (
    id SERIAL PRIMARY KEY,
    user_id REFERENCES users (id),
    workout_id REFERENCES workouts (id)
)

CREATE TABLE users_exercises (
    id SERIAL PRIMARY KEY,
    user_id REFERENCES users(id),
    exercise_id REFERENCES exercises(id)
)

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    equipement_id REFERENCES equipments(id)

)

CREATE TABLE circuits_workouts (
    id SERIAL PRIMARY KEY,
    circuit_id REFERENCES circuits(id),
    workout_id REFERENCES workouts(id)
)

CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category REFERENCES categories(id),
    completed_count INTEGER,
    favorited BOOLEAN
)

CREATE TABLE circuits (
    id  SERIAL PRIMARY KEY,
    sets INTEGER,
    reps INTEGER,
    weight INTEGER,
    rest_period INTEGER,
    intensity TEXT
    
)

CREATE TABLE circuits_exercises (
    id SERIAL PRIMARY KEY,
    circuit_id REFERENCES circuits(id),
    exercise_id REFERENCES exercises(id)
)

CREATE TABLE equipments (
    id SERIAL PRIMARY KEY,
    name TEXT
)

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT
)
