CREATE TABLE public.Member (
    memberNumber integer NOT NULL,
    year integer,
    name character(20),
    phonenumber character(20),
    email character(25),
	PRIMARY KEY (memberNumber)
);

INSERT INTO Member VALUES (001, 3, 'Bryce', '7786816410', 'n9j0b@ugrad.cs.ubc.ca'),
(002, 3, 'Crystal', '5878892238', 't5i0b.ugrad.cs.ubc.ca'),
(003, 3, 'Trevin', '5877182980', 'd3s0b@ugrad.cs.ubc.ca'),
(004, 3,'Christine', NULL, 'r8x9a@ugrad.cs.ubc.ca'),
(005, 4, 'Goober', '8790981283', 'goober@ugrad.cs.ubc.ca');

CREATE TABLE Executive(
		memberNumber integer NOT NULL,
		position CHAR(20),
		PRIMARY KEY (memberNumber),
		FOREIGN KEY (memberNumber) REFERENCES public.Member(memberNumber)
);

INSERT INTO Executive VALUES (001, 'Treasurer'), (002, 'President'), (003, 'VP'),
(004, 'Games Librarian'), (005, 'Secretary');

CREATE TABLE Event (
	name CHAR(30),
	date CHAR(10),
	description CHAR(100),
	startTime CHAR(7),
	endTime CHAR(7),
	location CHAR(100),
	PRIMARY KEY (name,date)
);

INSERT INTO Event VALUES ('Heart BoardGames', '02/14/2018', 'The best way to spend valentine''s day', '18:00', '23:00', 'Nest 2001'),
('D&D', '03/10/2018', 'Have some fun playing good ol'' Dungeons and Dragons', '17:00', '20:00', 'Nest 3256'),
('Monopoly Only', '03/20/2018', 'Monopoly is having a monopoly, only monopoly!', '18:00', '20:00', 'Nest 3256'),
('Boston Pizza Outing', '02/20/2018', 'Drown your failure on Valentine''s Day with pizza', '17:00', '21:00', '8100 Ackryod Road #50'),
('Tribute to Cthulu', '04/01/2018', 'Play fun Cthulu related games to pay tribute', '17:00', '20:00', 'Nest 3256');

CREATE TABLE Attends(
		memberNumber INTEGER,
		eventName CHAR(20),
		eventDate CHAR(20),
		PRIMARY KEY (memberNumber, eventName, eventDate),
		FOREIGN KEY (memberNumber) references Member(memberNumber),
		FOREIGN KEY (eventName, eventDate) references Event(name,date)
);

INSERT INTO Attends VALUES (001, 'Boston Pizza Outing', '02/20/2018'),
(002, 'Heart BoardGames', '02/14/2018'), (003, 'Tribute to Cthulu', '04/01/2018'),
(004, 'Boston Pizza Outing', '02/20/2018'), (005, 'Tribute to Cthulu', '04/01/2018');

CREATE TABLE Host(
		memberNumber INTEGER,
		eventName CHAR(20),
		eventDate CHAR(20),
		PRIMARY KEY (memberNumber, eventName, eventDate),
		FOREIGN KEY (memberNumber) references Executive(memberNumber),
		FOREIGN KEY (eventName, eventDate) references Event(name,date)
);

INSERT INTO Host VALUES (001, 'Heart BoardGames', '02/14/2018'),
(002, 'Tribute to Cthulu', '04/01/2018'), (004, 'Boston Pizza Outing', '02/20/2018'),
(002, 'Monopoly Only', '03/20/2018'), (003, 'Monopoly Only', '03/20/2018');

CREATE TABLE Publisher(
		name CHAR(20),
		phoneNumber CHAR(20),
		email CHAR(25),
		country CHAR(20),
		PRIMARY KEY (name)
);
INSERT INTO Publisher VALUES ('Hasbro', '8002555516', 'permissions@hasbro.com', 'UK'),
('Parker Bros', '1234567890', 'parkerbros@park.com', 'US'),
('Alary Games', '4191852309', 'alarygames@alary.com', 'CAN'),
('Asmodee', '0353905987', 'asmodee@asmodee.com', 'CAN'),
('BLM Games', '5873091743', 'blmgames@blmgames.com', 'CAN');

CREATE TABLE Game(
		title CHAR(30),
		rating INTEGER,
		minPlayer INTEGER,
		maxPlayer INTEGER,
		PRIMARY KEY (title)
);

INSERT INTO Game VALUES ('Monopoly', 5,2,6),
('Legend of the Five Rings', 4,1,4), ('Photosynthesis', 3,2,8),
('Sagrada', 5,2,4), ('Charterstone', 4,2,6);

CREATE TABLE PublishedBy(
		publisherName CHAR(20),
		gameTitle CHAR(30),
		datePublished CHAR(20),
		PRIMARY KEY (publisherName, gameTitle),
		FOREIGN KEY (publisherName) REFERENCES Publisher(name),
		FOREIGN KEY (gameTitle) REFERENCES Game(title)
);

INSERT INTO PublishedBy VALUES ('Hasbro', 'Monopoly', '02/06/1935'),
('Parker Bros', 'Monopoly', '02/06/1935'), ('Alary Games', 'Charterstone', '03/08/1956'),
('Asmodee', 'Photosynthesis', '11/20/2002'), ('Parker Bros', 'Sagrada', '08/18/2010');

CREATE TABLE Genre(
		name CHAR(20),
		PRIMARY KEY (name)
);

INSERT INTO Genre VALUES ('Roll n'' Move'), ('Deck Building'), ('Traditional'),
('Strategy'), ('Role Playing');

CREATE TABLE HasGenre(
		gameTitle CHAR(30),
		genreName CHAR(20),
		PRIMARY KEY (gameTitle, genreName),
		FOREIGN KEY (gameTitle) REFERENCES Game(title),
		FOREIGN KEY (genreName) REFERENCES Genre(name)
);

INSERT INTO HasGenre VALUES ('Monopoly', 'Roll n'' Move'),
('Photosynthesis', 'Strategy'), ('Legend of the Five Rings', 'Role Playing'),
('Sagrada', 'Traditional'), ('Charterstone', 'Strategy');

CREATE TABLE GameInstance(
		id INTEGER,
		borrowed INTEGER,						
		datePurchased CHAR(20),
		language CHAR(20),
		gameTitle CHAR(30),
		PRIMARY KEY (id, gameTitle),
		FOREIGN KEY (gameTitle) REFERENCES Game(title)
				ON DELETE NO ACTION
				ON UPDATE CASCADE
);

INSERT INTO GameInstance VALUES (00002, 0, '02/14/2017', 'English','Monopoly'),
(00001, '1', '02/15/2018', 'English', 'Photosynthesis'),
(00003, '0', '10/20/2016', 'English', 'Legend of the Five Rings'),
(00004, '0', '05/08/2010', 'English', 'Sagrada'),
(00005, '0', '06/10/2011', 'English', 'Sagrada');

CREATE TABLE Uses(
		id INTEGER,
		gameTitle CHAR(30),
		eventName CHAR(20),
		eventDate CHAR(20),
		PRIMARY KEY (id, gameTitle, eventName, eventDate),
		FOREIGN KEY (id, gameTitle) REFERENCES GameInstance(id, gameTitle),
		FOREIGN KEY (eventName, eventDate) REFERENCES Event(name,date)
);

INSERT INTO Uses VALUES (00002, 'Monopoly', 'Heart BoardGames', '02/14/2018'),
(00004, 'Sagrada', 'Heart BoardGames', '02/14/2018'),
(00003, 'Legend of the Five Rings', 'Heart BoardGames', '02/14/2018'),
(00001, 'Photosynthesis', 'Heart BoardGames', '02/14/2018'),
(00005, 'Sagrada', 'Heart BoardGames', '02/14/2018');

CREATE TABLE BorrowRecord(
		recordID INTEGER,
		expectedReturnDate CHAR(20),
		actualReturnDate CHAR(20),
		dateBorrowed CHAR(20),
		timeBorrowed CHAR(7),
		memberNumber INTEGER NOT NULL,
		execNumber INTEGER NOT NULL,
		PRIMARY KEY (recordID),
		FOREIGN KEY (memberNumber) REFERENCES Member(memberNumber), 
		FOREIGN KEY (execNumber) REFERENCES Executive(memberNumber)
);

INSERT INTO BorrowRecord VALUES
(00001, '01/14/2018', '01/13/2018', '01/01/2018', '16:00', 002, 001),
(00002, '03/01/2018', NULL, '02/15/2018', '12:00', 002, 001),
(00003, '03/20/2018', NULL, '02/15/2018', '1:00', 003, 004),
(00004, '02/15/2018', '02/15/2018', '01/10/2018', '2:32', 001, 005),
(00005, '03/18/2018', NULL, '02/13/2018', '4:30', 003, 002);

CREATE TABLE Contains(
		recordID INTEGER, 
		gameID INTEGER,
		gameTitle CHAR(30),
		PRIMARY KEY (recordID, gameID, gameTitle),
		FOREIGN KEY (recordID) REFERENCES BorrowRecord(recordID),
		FOREIGN KEY (gameID, gameTitle) REFERENCES GameInstance(id,gameTitle)
);

INSERT INTO Contains VALUES
(00001, 00002, 'Monopoly'), (00002, 00004, 'Sagrada'), (00003, 00003, 'Legend of the Five Rings');
