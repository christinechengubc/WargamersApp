DROP TABLE IF EXISTS Members, Executives, Events, Attends, Hosts, Publishers, Games, PublishedBy, Genres, HasGenre, GameInstances, BorrowRecords, Contains;

CREATE TABLE Members (
    memberNumber integer NOT NULL,
    year integer,
    name character(20),
    phonenumber character(20),
    email character(25),
    password character(25),
	  PRIMARY KEY (memberNumber)
);

INSERT INTO Members VALUES (001, 3, 'Bryce', '7786816410', 'n9j0b@ugrad.cs.ubc.ca', 'testPassword'),
(002, 3, 'Crystal', '5878892238', 't5i0b.ugrad.cs.ubc.ca', 'testPassword'),
(003, 3, 'Trevin', '5877182980', 'd3s0b@ugrad.cs.ubc.ca', 'testPassword'),
(004, 3,'Christine', NULL, 'r8x9a@ugrad.cs.ubc.ca', 'testPassword'),
(005, 4, 'Goober', '8790981283', 'goober@ugrad.cs.ubc.ca', 'testPassword');

CREATE TABLE Executives(
		memberNumber integer NOT NULL,
		position VARCHAR(20),
		PRIMARY KEY (memberNumber),
		FOREIGN KEY (memberNumber) REFERENCES Members(memberNumber)
);

INSERT INTO Executives VALUES (001, 'Treasurer'), (002, 'President'), (003, 'VP'),
(004, 'Games Librarian'), (005, 'Secretary');

CREATE TABLE Events (
	name VARCHAR(30),
	date DATE,
	description VARCHAR(100),
	startTime TIME(0),
	endTime TIME(0),
	location VARCHAR(100),
	PRIMARY KEY (name,date)
);

INSERT INTO Events VALUES ('Heart BoardGames', '2018-02-14', 'The best way to spend valentine''s day', '18:00:00', '23:00:00', 'Nest 2001'),
('D&D', '2018-03-02', 'Have some fun playing good ol'' Dungeons and Dragons', '17:00:00', '20:00:00', 'Nest 3256'),
('D&D', '2018-03-10', 'Have some fun playing good ol'' Dungeons and Dragons', '17:00:00', '20:00:00', 'Nest 3256'),
('Monopoly Only', '2018-03-20', 'Monopoly is having a monopoly, only monopoly!', '18:00:00', '20:00:00', 'Nest 3256'),
('Boston Pizza Outing', '2018-02-20', 'Drown your failure on Valentine''s Day with pizza', '17:00:00', '21:00:00', '8100 Ackryod Road #50'),
('Tribute to Cthulu', '2018-04-01', 'Play fun Cthulu related games to pay tribute', '17:00:00', '20:00:00', 'Nest 3256'),
('Dummy', '2017-04-01', 'I am a dummy bear', '12:00:00', '15:00:00', 'nowhere');

CREATE TABLE Attends(
		memberNumber INTEGER,
		eventName VARCHAR(30),
		eventDate DATE,
		PRIMARY KEY (memberNumber, eventName, eventDate),
		FOREIGN KEY (memberNumber) references Members(memberNumber),
		FOREIGN KEY (eventName, eventDate) references Events(name,date) ON DELETE CASCADE
);

INSERT INTO Attends VALUES (001, 'Boston Pizza Outing', '2018-02-20'),
(001, 'Heart BoardGames', '2018-02-14'),
(001, 'D&D', '2018-03-02'),
(001, 'Monopoly Only', '2018-03-20'),
(001, 'Tribute to Cthulu', '2018-04-01'),
(002, 'Heart BoardGames', '2018-02-14'),
(003, 'Tribute to Cthulu', '2018-04-01'),
(004, 'Boston Pizza Outing', '2018-02-20'), (003, 'Boston Pizza Outing', '2018-02-20'),
(005, 'D&D', '2018-03-02'), (004, 'D&D', '2018-03-02'),
(005, 'D&D', '2018-03-10'), (004, 'D&D', '2018-03-10'),(001, 'D&D', '2018-03-10'),(002, 'D&D', '2018-03-10');

CREATE TABLE Hosts(
		memberNumber INTEGER,
		eventName VARCHAR(30),
		eventDate DATE,
		PRIMARY KEY (memberNumber, eventName, eventDate),
		FOREIGN KEY (memberNumber) references Executives(memberNumber),
		FOREIGN KEY (eventName, eventDate) references Events(name,date) ON DELETE CASCADE
);

INSERT INTO Hosts VALUES (001, 'Heart BoardGames', '2018-02-14'),
(002, 'Tribute to Cthulu', '2018-04-01'), (004, 'Boston Pizza Outing', '2018-02-20'),
(005, 'D&D', '2018-03-02'), (005, 'D&D', '2018-03-10'), (003, 'Monopoly Only', '2018-03-20');

CREATE TABLE Publishers(
		name VARCHAR(20),
		email VARCHAR(25),
		country VARCHAR(20),
		PRIMARY KEY (name)
);

INSERT INTO Publishers VALUES ('Hasbro', 'permissions@hasbro.com', 'UK'),
('Parker Bros', 'parkerbros@park.com', 'US'),
('Alary Games', 'alarygames@alary.com', 'CAN'),
('Asmodee', 'asmodee@asmodee.com', 'CAN'),
('BLM Games', 'blmgames@blmgames.com', 'CAN'),
('Avalon Hill', 'avalonhill@avh.com', 'CAN');

CREATE TABLE Games(
		title VARCHAR(30),
		rating DECIMAL(5,2),
		minPlayer INTEGER,
		maxPlayer INTEGER,
		minPlaytime INTEGER,
		maxPlaytime INTEGER,
		yearpublished INTEGER,
		description VARCHAR(100),
		difficulty VARCHAR(15),
		CHECK (rating > 0 AND rating <= 5),
		PRIMARY KEY (title)
);


INSERT INTO Games VALUES ('Monopoly', 5.0,2,6,30,180, 1988, 'Want to get rid of your friends? Play Monopoly! The game that breaks friendships!', 'Beginner'),
('Legend of the Five Rings', 4.12,1,4,30,60, 1999, 'much legend, such rings', 'Intermediate'),
('Photosynthesis', 3.83,2,8,10,30, 2000, 'I''ve always wanted to be a flower', 'Advanced'),
('Sagrada', 4.87,2,4,20,60,2001, 'hi', 'Beginner'), 
('Betrayal at House on the Hill', 3.29, 1,3,10,20,2002, 'hello', 'Intermediate'),
('Charterstone', 4.28,2,6,5,10,2002,'hearthstone','Advanced');

CREATE TABLE PublishedBy(
		publisherName VARCHAR(20),
		gameTitle VARCHAR(30),
		PRIMARY KEY (publisherName, gameTitle),
		FOREIGN KEY (publisherName) REFERENCES Publishers(name) ON DELETE CASCADE,
		FOREIGN KEY (gameTitle) REFERENCES Games(title) ON DELETE CASCADE
);

INSERT INTO PublishedBy VALUES ('Hasbro', 'Monopoly'), ('Parker Bros', 'Monopoly'), ('Alary Games', 'Charterstone'),
('Asmodee', 'Photosynthesis'), ('Parker Bros', 'Sagrada'),
('Parker Bros', 'Legend of the Five Rings'),
('Asmodee', 'Legend of the Five Rings'), ('Avalon Hill','Betrayal at House on the Hill');

CREATE TABLE Genres(
		name VARCHAR(20),
		PRIMARY KEY (name)
);

INSERT INTO Genres VALUES ('Roll n'' Move'), ('Deck Building'), ('Traditional'),
('Strategy'), ('Role Playing'), ('Horror');

CREATE TABLE HasGenre(
		gameTitle VARCHAR(30),
		genreName VARCHAR(20),
		PRIMARY KEY (gameTitle, genreName),
		FOREIGN KEY (gameTitle) REFERENCES Games(title) ON DELETE CASCADE,
		FOREIGN KEY (genreName) REFERENCES Genres(name) ON DELETE CASCADE
);

INSERT INTO HasGenre VALUES ('Monopoly', 'Roll n'' Move'),
('Photosynthesis', 'Strategy'), ('Legend of the Five Rings', 'Role Playing'),
('Sagrada', 'Traditional'), ('Charterstone', 'Strategy'),
('Betrayal at House on the Hill', 'Strategy'), ('Betrayal at House on the Hill', 'Horror');

CREATE TABLE GameInstances(
		id INTEGER,
		borrowed INTEGER,
		datePurchased DATE,
		language VARCHAR(20),
		gameTitle VARCHAR(30),
		PRIMARY KEY (id, gameTitle),
		FOREIGN KEY (gameTitle) REFERENCES Games(title)
				ON DELETE CASCADE
				ON UPDATE CASCADE
);

INSERT INTO GameInstances VALUES (00001, 0, '2017-02-14', 'English','Monopoly'),
(00001, '1', '2018-02-15', 'English', 'Photosynthesis'),
(00001, '0', '2016-10-20', 'English', 'Legend of the Five Rings'),
(00001, '0', '2010-05-08', 'English', 'Sagrada'),
(00002, '0', '2011-06-10', 'English', 'Sagrada');


CREATE TABLE BorrowRecords(
		recordID INTEGER,
		expectedReturnDate DATE,
		actualReturnDate DATE,
		dateBorrowed DATE,
		timeBorrowed TIME(0),
		memberNumber INTEGER NOT NULL,
		execNumber INTEGER NOT NULL,
		PRIMARY KEY (recordID),
		FOREIGN KEY (memberNumber) REFERENCES Members(memberNumber),
		FOREIGN KEY (execNumber) REFERENCES Executives(memberNumber)
);

INSERT INTO BorrowRecords VALUES
(00001, '2018-01-14', '2018-01-13', '2018-01-01', '16:00:00', 002, 001),
(00002, '2018-03-01', NULL, '2018-02-15', '12:00:00', 002, 001),
(00003, '2018-03-20', NULL, '2018-02-15', '13:00:00', 003, 004),
(00004, '2018-02-15', '2018-02-15', '2018-01-10', '14:32:00', 001, 005),
(00005, '2018-03-18', NULL, '2018-02-13', '16:30:00', 003, 002);

CREATE TABLE Contains(
		recordID INTEGER,
		instanceID INTEGER,
		gameTitle VARCHAR(30),
		PRIMARY KEY (recordID, instanceID, gameTitle),
		FOREIGN KEY (recordID) REFERENCES BorrowRecords(recordID),
		FOREIGN KEY (instanceID, gameTitle) REFERENCES GameInstances(id,gameTitle) ON DELETE CASCADE
);

INSERT INTO Contains VALUES
(00001, 00001, 'Monopoly'), (00002, 00001, 'Sagrada'), (00003, 00001, 'Legend of the Five Rings'),(00004, 00001, 'Photosynthesis'),
(00005, 00002, 'Sagrada');