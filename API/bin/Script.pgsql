DROP TABLE IF EXISTS Executives, Events, Games, App_Admins;

CREATE TABLE Executives(
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) UNIQUE NOT NULL,
	position VARCHAR(20) UNIQUE,
	phone VARCHAR(20),
	email VARCHAR(50)
);

INSERT INTO Executives (name, position, phone, email) VALUES ('Peter', 'President', '123-456-7890', 'example@email.com'),
('Moayad', 'Vice President', NULL, NULL),
('Fareez Sanif', 'Treasurer', NULL, NULL),
('Richard', 'Secretary', NULL, NULL),
('Wil', 'Games Librarian', NULL, NULL);

CREATE TABLE Events (
	id SERIAL PRIMARY KEY,
	title VARCHAR(30) UNIQUE NOT NULL,
	date DATE,
	description VARCHAR(100) NOT NULL,
	start_time TIME(0),
	end_time TIME(0),
	location VARCHAR(100),
	always_show BOOL,
	lead_exec VARCHAR(50) NOT NULL,
	fb_event_page VARCHAR(100),
	image VARCHAR(250),
	FOREIGN KEY (lead_exec) REFERENCES Executives(name)
);

INSERT INTO Events (title, date, description, start_time, end_time, location, always_show, lead_exec, fb_event_page, image) VALUES ('Heart BoardGames', '2018-02-14', 'The best way to spend valentine''s day', '18:00:00', '23:00:00', 'Nest 2001', false, 'Peter', NULL, 'http://pikeplacemarket.org/sites/default/files/Pike%20Place%20Valentine%20Board%20Game.jpg'),
('Intro to RPG', '2018-08-02', 'Have some fun playing good ol'' Dungeons and Dragons', '17:00:00', '20:00:00', 'Nest 3256', false, 'Fareez Sanif', NULL, 'https://i.imgur.com/J080qHu.jpg'),
('Boardgames Night', '1999-01-01', 'Boardgames night held every Wednesday', '17:00:00', '22:00:00', 'Nest 3206', true, 'Peter', NULL, 'http://www.ubcwargamers.com/images/pic01.jpg');


CREATE TABLE Games(
	id SERIAL PRIMARY KEY,
	title VARCHAR(50) UNIQUE NOT NULL,
	category VARCHAR(50),
	rating DECIMAL(5,2),
	min_players INTEGER,
	max_players INTEGER,
	min_playtime INTEGER,
	max_playtime INTEGER,
	year_published INTEGER,
	description VARCHAR(1000),
	complexity NUMERIC,
	users_rated INTEGER,
	available_copies INTEGER,
	total_copies INTEGER,
	condition VARCHAR(100),
	expansion_of VARCHAR(50),
	bgg_id INTEGER,
	show_main_page BOOL,
	thumbnail VARCHAR(250),
	image VARCHAR(250)
);


INSERT INTO Games (title, category, rating, min_players, max_players, min_playtime, max_playtime, year_published, description, complexity, users_rated, available_copies, total_copies, condition, expansion_of, bgg_id, show_main_page, thumbnail, image) VALUES ('Monopoly', 'Friendship Breaking',2.0,1,4, 60, 999, 1999, 'Want to get rid of your friend''s life? Play Monopoly! The game that breaks friendships!', 1, 10000, 5,5, 'Shitty', NULL, 12345, true, 'https://cf.geekdo-images.com/thumb/img/XDq3S7BWb25Q2Ekw2WyAg_f_C00=/fit-in/200x150/pic3640835.jpg', 'https://cf.geekdo-images.com/original/img/u0oP0ZEeRX9_68feLPafIGU0pcw=/0x0/pic3640835.jpg');


CREATE TABLE App_Admins(
	id SERIAL PRIMARY KEY,
	username VARCHAR(20) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL
);

INSERT INTO App_Admins (username, password) VALUES ('dev', 'admin'), ('wargamers', 'wARGamERs2018?');
