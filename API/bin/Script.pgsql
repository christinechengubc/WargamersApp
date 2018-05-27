DROP TABLE IF EXISTS Members, Executives, Events, Attends, Hosts, Publishers, Games, PublishedBy, Genres, HasGenre, GameInstances, BorrowRecords, Contains;

CREATE TABLE Executives(
		member_number integer NOT NULL,
		name VARCHAR(50),
		position VARCHAR(20),
		phone VARCHAR(20),
		email VARCHAR(50),
		PRIMARY KEY (member_number)
);

INSERT INTO Executives VALUES (001, 'Fareez Sanif', 'Treasurer', NULL, NULL), (002, 'Peter', 'President', '123-456-7890', 'example@email.com');

CREATE TABLE Events (
	title VARCHAR(30),
	date DATE,
	description VARCHAR(100),
	start_time TIME(0),
	end_time TIME(0),
	location VARCHAR(100),
	always_show BOOL,
	lead_exec VARCHAR(50),
	fb_event_page VARCHAR(100),
	PRIMARY KEY (title,date)
);

INSERT INTO Events VALUES ('Heart BoardGames', '2018-02-14', 'The best way to spend valentine''s day', '18:00:00', '23:00:00', 'Nest 2001', false, 'Peter'),
('D&D', '2018-08-02', 'Have some fun playing good ol'' Dungeons and Dragons', '17:00:00', '20:00:00', 'Nest 3256', false, 'Fareez'),
('Boardgames Night', '1999-01-01', 'Boardgames night held every Wednesday', '17:00:00', '22:00:00', 'Nest 3206', true, 'William');


CREATE TABLE Games(
		title VARCHAR(50),
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
		show_main_page BOOL,
		CHECK (rating > 0 AND rating <= 5),
		PRIMARY KEY (title)
);


INSERT INTO Games VALUES ('Monopoly', 'Hasbros','Friendship Breaking',2.0,1,4, 60, 999, 1999, 'Want to get rid of your friends? Play Monopoly! The game that breaks friendships!', 1, 'http://imageformonopolyomg', 10000, 5,5, 'Shitty', NULL, 12345, true);