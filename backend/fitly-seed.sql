INSERT INTO users (username, first_name, last_name, email, password, is_admin)
VALUES('SystemAdmin', 'Cameron', 'Thomas', 'test@test.com', '$2b$12$Tn6lg0F.tsMe9Cu3sER/W.t78BBIuqJvMIwK/C6MyUcOb.AdUEqea', true);

INSERT INTO categories(user_id, name, systemDefault)
VALUES
(1, 'Power', true),
(1, 'Endurance', true),
(1, 'Mobility', true),
(1, 'Flexibility', true),
(1, 'Stability', true),
(1, 'Power Lifting', true),
(1, 'Calisthenics', true),
(1, 'Crossfit', true),
(1, 'Pilates', true),
(1, 'Yoga', true);

INSERT INTO equipments (user_id, name, systemDefault)
VALUES (1, 'N/A', true),
        (1, 'Machines', true),
        (1, 'Rack', true),
        (1, 'Bench', true),
        (1, 'Dumbbell', true),
        (1, 'Barbell', true),
        (1, 'Kettlebell', true),
        (1, 'TRX Bands', true),
        (1, 'Resistance Bands', true),
        (1, 'Pull Up Bar', true),
        (1, 'Hangboard', true);

INSERT INTO muscleGroups ( name )
VALUES('Abs'),
        ('Arms'),
        ('Back'),
        ('Calves'),
        ('Cardio'),
        ('Chest'),
        ('Legs'),
        ('Shoulders')