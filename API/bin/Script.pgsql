DROP TABLE IF EXISTS Members, Executives, Events, Attends, Hosts, Publishers, Games, PublishedBy, Genres, HasGenre, GameInstances, BorrowRecords, Contains, App_Admin;

CREATE TABLE Executives(
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) UNIQUE NOT NULL,
	position VARCHAR(20) UNIQUE,
	phone VARCHAR(20),
	email VARCHAR(50)
);

INSERT INTO Executives (name, position, phone, email) VALUES ('Fareez Sanif', 'Treasurer', NULL, NULL), ('Peter', 'President', '123-456-7890', 'example@email.com');

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
	FOREIGN KEY (lead_exec) REFERENCES Executives(name)
);

INSERT INTO Events (title, date, description, start_time, end_time, location, always_show, lead_exec, fb_event_page) VALUES ('Heart BoardGames', '2018-02-14', 'The best way to spend valentine''s day', '18:00:00', '23:00:00', 'Nest 2001', false, 'Peter', NULL),
('Intro to RPG', '2018-08-02', 'Have some fun playing good ol'' Dungeons and Dragons', '17:00:00', '20:00:00', 'Nest 3256', false, 'Fareez Sanif', NULL),
('Boardgames Night', '1999-01-01', 'Boardgames night held every Wednesday', '17:00:00', '22:00:00', 'Nest 3206', true, 'Peter', NULL);


CREATE TABLE Games(
	id SERIAL PRIMARY KEY,
	title VARCHAR(50) NOT NULL,
	publisher VARCHAR(100),
	category VARCHAR(50),
	rating DECIMAL(5,2),
	min_player INTEGER,
	max_player INTEGER,
	min_playtime INTEGER,
	max_playtime INTEGER,
	year_published INTEGER,
	description VARCHAR(100),
	complexity NUMERIC,
	image VARCHAR(100),
	users_rated INTEGER,
	available_copies INTEGER,
	total_copies INTEGER,
	condition VARCHAR(100),
	expansion_of VARCHAR(50),
	bgg_id INTEGER,
	show_main_page BOOL
);


INSERT INTO Games (title, publisher, category, rating, min_player, max_player, min_playtime, max_playtime, year_published, description, complexity, image, users_rated, available_copies, total_copies, condition, expansion_of, bgg_id, show_main_page) VALUES ('Monopoly', 'Hasbros','Friendship Breaking',2.0,1,4, 60, 999, 1999, 'Want to get rid of your friends? Play Monopoly! The game that breaks friendships!', 1, 'http://imageformonopolyomg', 10000, 5,5, 'Shitty', NULL, 12345, true);


CREATE TABLE App_Admin(
	id SERIAL PRIMARY KEY,
	username VARCHAR(20) NOT NULL,
	password VARCHAR(100) NOT NULL
);

INSERT INTO App_Admin (username, password) VALUES ('dev', 'admin'), ('wargamers', 'wARGamERs2018?');
