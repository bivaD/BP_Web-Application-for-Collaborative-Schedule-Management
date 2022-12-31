-- CREATE DATABASE db;
-- -------------------------------
--  Dropping when recreating db --
-- -------------------------------

USE db;

DROP TABLE IF EXISTS `studentMemberOfGroup`;
DROP TABLE IF EXISTS `groupAttendsTimetableUnit`;
DROP TABLE IF EXISTS `lecturerLeedsTimetableUnit`;
DROP TABLE IF EXISTS `timetableUnitIsInRoom`;
DROP TABLE IF EXISTS `equipmentIsInRoom`;
DROP TABLE IF EXISTS `timetableUnitDemandsEquipment`;

DROP TABLE IF EXISTS `timetableUnit`;
DROP TABLE IF EXISTS `room`;
DROP TABLE IF EXISTS `student`;
DROP TABLE IF EXISTS `equipment`;
DROP TABLE IF EXISTS `lecturer`;
DROP TABLE IF EXISTS `group`;

-- -----------------
--  Entity tables --
-- -----------------

CREATE TABLE `timetableUnit`(
    `id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id`),
    `type` INT NOT NULL,
    `name` varchar(255) NOT NULL,
    `duration_minutes` INT NOT NULL
);

CREATE TABLE `lecturer`(
    `id` varchar(255) UNIQUE NOT NULL,
    PRIMARY KEY (`id`),
    `name` varchar(255) NOT NULL,
    `surname` varchar(255) NOT NULL
    -- todo degrees before/after name
);

CREATE TABLE `student`(
    `id` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    `name` varchar(255) NOT NULL,
    `surname` varchar(255) NOT NULL
    -- todo degrees before/after name
);

CREATE TABLE `room`(
    `name` varchar(255) NOT NULL,
    `building` varchar(255) NOT NULL,
    PRIMARY KEY (`name`, `building`),
    `capacity` int NOT NULL
);

CREATE TABLE `group`(
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`name`)
);

CREATE TABLE `equipment`(
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`name`),
    `description` varchar(511) UNIQUE NOT NULL
);

-- ------------------------
-- M:N relations tables --
-- ------------------------

-- student - group
CREATE TABLE `studentMemberOfGroup`(
    `studentID` varchar(255) NOT NULL,
    `groupName` varchar(255) NOT NULL,
    FOREIGN KEY (`studentID`) REFERENCES `student`(`id`),
    FOREIGN KEY (`groupName`) REFERENCES `group`(`name`),
    PRIMARY KEY (`studentID`, `groupName`)
);

-- timetableUnit - group
CREATE TABLE `groupAttendsTimetableUnit`(
    `timetableUnitID` INT NOT NULL,
    `groupName` varchar(255) NOT NULL,
    FOREIGN KEY (`timetableUnitID`) REFERENCES `timetableUnit`(`id`),
    FOREIGN KEY (`groupName`) REFERENCES `group`(`name`),
    PRIMARY KEY (`timetableUnitID`, `groupName`)
);

-- timetableUnit - lecturer
CREATE TABLE `lecturerLeedsTimetableUnit`(
    `timetableUnitID` INT NOT NULL,
    `lecturerID` varchar(255) NOT NULL,
    FOREIGN KEY (`timetableUnitID`) REFERENCES `timetableUnit`(`id`),
    FOREIGN KEY (`lecturerID`) REFERENCES `lecturer`(`id`),
    PRIMARY KEY (`timetableUnitID`, `lecturerID`)
);

-- timetableUnit - room
CREATE TABLE `timetableUnitIsInRoom`(
    `roomName` varchar(255) NOT NULL,
    `roomBuilding` varchar(255) NOT NULL,
    `timetableUnitID` INT NOT NULL,
    FOREIGN KEY (`roomName`, `roomBuilding`) REFERENCES `room`(`name`, `building`),
    FOREIGN KEY (`timetableUnitID`) REFERENCES `timetableUnit`(`id`),
    PRIMARY KEY (`roomName`, `roomBuilding`, `timetableUnitID`),
    `starts` DATETIME NOT NULL
);

-- equipment - room
CREATE TABLE `equipmentIsInRoom`(
    `roomName` varchar(255) NOT NULL,
    `roomBuilding` varchar(255) NOT NULL,
    `equipmentName` varchar(255) NOT NULL,
    FOREIGN KEY (`roomName`, `roomBuilding`) REFERENCES `room`(`name`, `building`),
    FOREIGN KEY (`equipmentName`) REFERENCES `equipment`(`name`),
    PRIMARY KEY (`roomName`, `roomBuilding`, `equipmentName`),
    `count` INT NOT NULL
);

-- equipment - timetableUnit
CREATE TABLE `timetableUnitDemandsEquipment`(
    `equipmentName` varchar(255) NOT NULL,
    `timetableUnitID` INT NOT NULL,
    FOREIGN KEY (`equipmentName`) REFERENCES `equipment`(`name`),
    FOREIGN KEY (`timetableUnitID`) REFERENCES `timetableUnit`(`id`),
    PRIMARY KEY (`equipmentName`, `timetableUnitID`),
    `count` INT NOT NULL
);

-- -------------------------------
-- Inserting some initial data --
-- -------------------------------

-- lecturers
INSERT INTO `lecturer`(`id`, `name`, `surname`)
VALUES ("xperin00", "Petr", "Peringer");
INSERT INTO `lecturer`(`id`, `name`, `surname`)
VALUES ("xhline00", "Dana", "Hliněná");
INSERT INTO `lecturer`(`id`, `name`, `surname`)
VALUES ("xsmrck00", "Aleš", "Smrčka");
INSERT INTO `lecturer`(`id`, `name`, `surname`)
VALUES ("xmraze00", "Vojtěch", "Mrázek");

INSERT INTO `student`(`id`, `name`, `surname`)
VALUES("xnovak2x", "David", "Novák");
INSERT INTO `student`(`id`, `name`, `surname`)
VALUES("xlebed2x", "Polina", "Lebedeva");
INSERT INTO `student`(`id`, `name`, `surname`)
VALUES("xchova2x", "Kateřina", "Chovancová");
INSERT INTO `student`(`id`, `name`, `surname`)
VALUES("xlasto2x", "Martin", "Laštovica");
INSERT INTO `student`(`id`, `name`, `surname`)
VALUES("xsmisk2x", "Lucie", "Smíšková");
INSERT INTO `student`(`id`, `name`, `surname`)
VALUES("xslivk2x", "Matej", "Slivka");
INSERT INTO `student`(`id`, `name`, `surname`)
VALUES("xdenka2x", "Aram", "Denk");
INSERT INTO `student`(`id`, `name`, `surname`)
VALUES("xhubin2x", "Matúš", "Hubinský");
INSERT INTO `student`(`id`, `name`, `surname`)
VALUES("xotevr2x", "Jaromír", "Otevřel");
INSERT INTO `student`(`id`, `name`, `surname`)
VALUES("xkuzni2x", "Jakub", "Kuzník");

INSERT INTO `room`(`name`, `building`, `capacity`)
VALUES("D105", "FIT", 300);
INSERT INTO `room`(`name`, `building`, `capacity`)
VALUES("E112", "FIT", 150);
INSERT INTO `room`(`name`, `building`, `capacity`)
VALUES("A113", "FIT", 60);
INSERT INTO `room`(`name`, `building`, `capacity`)
VALUES("Hvězda smrti", "FEKT", 200);

INSERT INTO `group`(`name`)
VALUES("1BIT");
INSERT INTO `group`(`name`)
VALUES("2BIT");
INSERT INTO `group`(`name`)
VALUES("3BIT");
INSERT INTO `group`(`name`)
VALUES("4BIT+");

INSERT INTO `studentMemberOfGroup`(`studentID`, `groupName`) 
VALUES("xnovak2x", "3BIT");
INSERT INTO `studentMemberOfGroup`(`studentID`, `groupName`) 
VALUES("xlebed2x", "3BIT");
INSERT INTO `studentMemberOfGroup`(`studentID`, `groupName`) 
VALUES("xlasto2x", "4BIT+");
INSERT INTO `studentMemberOfGroup`(`studentID`, `groupName`) 
VALUES("xotevr2x", "4BIT+");
INSERT INTO `studentMemberOfGroup`(`studentID`, `groupName`) 
VALUES("xchova2x", "3BIT");
INSERT INTO `studentMemberOfGroup`(`studentID`, `groupName`) 
VALUES("xhubin2x", "2BIT");
INSERT INTO `studentMemberOfGroup`(`studentID`, `groupName`) 
VALUES("xdenka2x", "4BIT+");
INSERT INTO `studentMemberOfGroup`(`studentID`, `groupName`) 
VALUES("xslivk2x", "3BIT");
INSERT INTO `studentMemberOfGroup`(`studentID`, `groupName`) 
VALUES("xsmisk2x", "3BIT");
INSERT INTO `studentMemberOfGroup`(`studentID`, `groupName`) 
VALUES("xkuzni2x", "2BIT");

INSERT INTO `equipment`(`name`, `description`)
VALUES("Kreslítko", "Taková ta věc co na ni přednášející kreslí a ono se to zobrazuje na projektoru");
INSERT INTO `equipment`(`name`, `description`)
VALUES("Počítač", "Obyčejný stolní počítač");
INSERT INTO `equipment`(`name`, `description`)
VALUES("Dataprojektor", "Propojený s přítomným počítačem, nebo pro připojení vlastního notebooku");
INSERT INTO `equipment`(`name`, `description`)
VALUES("FITKIT3", "Vybavení pro Harware předměty");

INSERT INTO `equipmentIsInRoom`(`roomName`, `roomBuilding`, `equipmentName`,`count`)
VALUES("D105", "FIT", "Počítač", 2);
INSERT INTO `equipmentIsInRoom`(`roomName`, `roomBuilding`, `equipmentName`,`count`)
VALUES("D105", "FIT", "Dataprojektor", 2);
INSERT INTO `equipmentIsInRoom`(`roomName`, `roomBuilding`, `equipmentName`,`count`)
VALUES("D105", "FIT", "Kreslítko", 1);
INSERT INTO `equipmentIsInRoom`(`roomName`, `roomBuilding`, `equipmentName`,`count`)
VALUES("E112", "FIT", "Počítač", 1);
INSERT INTO `equipmentIsInRoom`(`roomName`, `roomBuilding`, `equipmentName`,`count`)
VALUES("E112", "FIT", "Dataprojektor", 2);
INSERT INTO `equipmentIsInRoom`(`roomName`, `roomBuilding`, `equipmentName`,`count`)
VALUES("E112", "FIT", "Kreslítko", 2);
INSERT INTO `equipmentIsInRoom`(`roomName`, `roomBuilding`, `equipmentName`,`count`)
VALUES("A113", "FIT", "Dataprojektor", 1);
INSERT INTO `equipmentIsInRoom`(`roomName`, `roomBuilding`, `equipmentName`,`count`)
VALUES("A113", "FIT", "FITKIT3", 21);

INSERT INTO `timetableUnit`(`type`, `name`, `duration_minutes`)
VALUES (1, "Modelování a simulace", 180);
INSERT INTO `timetableUnit`(`type`, `name`, `duration_minutes`)
VALUES (2, "Modelování a simulace", 60);
INSERT INTO `timetableUnit`(`type`, `name`, `duration_minutes`)
VALUES (1, "Informační systémy", 100);

INSERT INTO `lecturerLeedsTimetableUnit`(`timetableUnitID`, `lecturerID`)
VALUES (1, "xperin00");
INSERT INTO `lecturerLeedsTimetableUnit`(`timetableUnitID`, `lecturerID`)
VALUES (2, "xperin00");
INSERT INTO `lecturerLeedsTimetableUnit`(`timetableUnitID`, `lecturerID`)
VALUES (3, "xmraze00");
INSERT INTO `lecturerLeedsTimetableUnit`(`timetableUnitID`, `lecturerID`)
VALUES (3, "xsmrck00");

INSERT INTO `groupAttendsTimetableUnit`(`timetableUnitID`, `groupName`)
VALUES (1, "2BIT");
INSERT INTO `groupAttendsTimetableUnit`(`timetableUnitID`, `groupName`)
VALUES (2, "2BIT");
INSERT INTO `groupAttendsTimetableUnit`(`timetableUnitID`, `groupName`)
VALUES (1, "3BIT");
INSERT INTO `groupAttendsTimetableUnit`(`timetableUnitID`, `groupName`)
VALUES (2, "3BIT");
INSERT INTO `groupAttendsTimetableUnit`(`timetableUnitID`, `groupName`)
VALUES (3, "3BIT");
INSERT INTO `groupAttendsTimetableUnit`(`timetableUnitID`, `groupName`)
VALUES (3, "4BIT+");

SHOW TABLES;