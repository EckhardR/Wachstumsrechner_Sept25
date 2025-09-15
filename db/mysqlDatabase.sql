-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: growthcalculator-mysql-app
-- Erstellungszeit: 04. Mai 2025 um 16:13
-- Server-Version: 9.2.0
-- PHP-Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `growthcalculator`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `clinictable`
--

CREATE TABLE `clinictable` (
  `ID` int NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `CreatedBy` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Daten für Tabelle `clinictable`
--

INSERT INTO `clinictable` (`ID`, `Name`, `CreatedBy`, `CreatedAt`) VALUES
(1, 'Hamburg Medical Center', 'Niels', '2023-07-18 00:00:00'),
(2, 'Berlin Clinic', 'Niels', '2023-07-18 00:00:00'),
(3, 'Munich Hospital', 'Niels', '2023-07-18 00:00:00'),
(4, 'Frankfurt Healthcare', 'Niels', '2023-07-18 00:00:00'),
(5, 'Cologne Medical Clinic', 'Niels', '2023-07-18 00:00:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `dailytasktable`
--

CREATE TABLE `dailytasktable` (
  `ID` int NOT NULL,
  `PatientID` int DEFAULT NULL,
  `ClinicID` int DEFAULT NULL,
  `StationNr` int DEFAULT NULL,
  `BedNr` int NOT NULL,
  `TaskDate` date NOT NULL,
  `TaskSavedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `TaskEditDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `Weight` float DEFAULT NULL,
  `Length` float DEFAULT NULL,
  `HeadCircumference` float DEFAULT NULL,
  `FatMass` float DEFAULT NULL,
  `FatFreeMass` float DEFAULT NULL,
  `PercentFatFreeMass` float DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Daten für Tabelle `dailytasktable`
--

INSERT INTO `dailytasktable` (`ID`, `PatientID`, `ClinicID`, `StationNr`, `BedNr`, `TaskDate`, `TaskSavedDate`, `TaskEditDate`, `CreatedBy`, `Weight`, `Length`, `HeadCircumference`, `FatMass`, `FatFreeMass`, `PercentFatFreeMass`) VALUES
(1, 9, 1, 2, 13, '2022-10-18', '2025-05-04 15:04:26', '2025-05-04 15:04:26', 'admin', 900, 35, 28, 47, 853, 5.2),
(2, 9, 1, 2, 13, '2022-10-20', '2025-05-04 15:05:31', '2025-05-04 15:05:31', 'admin', 870, 35.3, 27.3, 59, 811, 6.8),
(3, 9, 1, 2, 13, '2022-10-21', '2025-05-04 15:09:58', '2025-05-04 15:09:58', 'admin', 830, 35.4, 28.4, 54, 776, 6.6),
(4, 9, 1, 2, 13, '2022-10-25', '2025-05-04 15:11:14', '2025-05-04 15:11:14', 'admin', 890, 36, 29, 52, 838, 5.9),
(5, 9, 1, 2, 13, '2022-11-08', '2025-05-04 15:11:43', '2025-05-04 15:11:43', 'admin', 1100, 37.9, 29.9, 91, 1019, 8.2),
(6, 9, 1, 2, 13, '2022-11-10', '2025-05-04 15:12:16', '2025-05-04 15:12:16', 'admin', 1150, 38.2, 31.2, 99, 1051, 8.6),
(7, 9, 1, 2, 13, '2022-11-15', '2025-05-04 15:12:43', '2025-05-04 15:12:43', 'admin', 1350, 38.9, 31.9, 138, 1212, 10.3),
(8, 9, 1, 2, 13, '2022-11-18', '2025-05-04 15:13:09', '2025-05-04 15:13:09', 'admin', 1370, 39.3, 31.3, 136, 1234, 10),
(9, 9, 1, 2, 13, '2022-11-22', '2025-05-04 15:13:36', '2025-05-04 15:13:36', 'admin', 1460, 39.9, 32.9, 151, 1309, 10.3),
(10, 9, 1, 2, 13, '2022-11-25', '2025-05-04 15:14:03', '2025-05-04 15:14:03', 'admin', 1480, 40.3, 32.3, 157, 1323, 10.6),
(11, 9, 1, 2, 13, '2022-11-29', '2025-05-04 15:14:31', '2025-05-04 15:14:31', 'admin', 1690, 40.9, 33.9, 208, 1482, 12.3),
(12, 9, 1, 2, 13, '2022-11-30', '2025-05-04 15:14:55', '2025-05-04 15:14:55', 'admin', 1775, 41, 34, 228, 1547, 12.9),
(13, 9, 1, 2, 13, '2022-12-02', '2025-05-04 15:15:21', '2025-05-04 15:15:21', 'admin', 1850, 41.3, 34.3, 244, 1606, 13.2),
(14, 9, 1, 2, 13, '2022-12-06', '2025-05-04 15:15:48', '2025-05-04 15:15:48', 'admin', 1850, 41.9, 34.9, 239, 1611, 12.9),
(15, 9, 1, 2, 13, '2022-12-07', '2025-05-04 15:16:11', '2025-05-04 15:16:11', 'admin', 2056, 42, 35, 296, 1760, 14.4),
(16, 9, 1, 2, 13, '2022-12-09', '2025-05-04 15:16:39', '2025-05-04 15:16:39', 'admin', 2350, 42.3, 35.3, 361, 1989, 15.4),
(17, 9, 1, 2, 13, '2022-12-14', '2025-05-04 15:17:06', '2025-05-04 15:17:06', 'admin', 2280, 43, 36, 346, 1934, 15.2);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `patienttable`
--

CREATE TABLE `patienttable` (
  `ID` int NOT NULL,
  `StationID` int DEFAULT NULL,
  `ClinicID` int NOT NULL,
  `Birthday` date DEFAULT NULL,
  `Gender` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci DEFAULT NULL,
  `BedNr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci DEFAULT NULL,
  `FirstName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci DEFAULT NULL,
  `LastName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci DEFAULT NULL,
  `GestationalWeek` int DEFAULT NULL,
  `GestationalDay` int DEFAULT NULL,
  `BirthWeight` float DEFAULT NULL,
  `BirthLength` float DEFAULT NULL,
  `HeadCircumference` float DEFAULT NULL,
  `FatMass` float DEFAULT NULL,
  `FatFreeMass` float DEFAULT NULL,
  `MotherAge` int DEFAULT NULL,
  `MotherHeight` int DEFAULT NULL,
  `MotherPrePregnancyWeight` float DEFAULT NULL,
  `MotherafterPregnancyWeight` float DEFAULT NULL,
  `FatherAge` int DEFAULT NULL,
  `FatherWeight` float DEFAULT NULL,
  `FatherHeight` int DEFAULT NULL,
  `CreatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Discharged` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Daten für Tabelle `patienttable`
--

INSERT INTO `patienttable` (`ID`, `StationID`, `ClinicID`, `Birthday`, `Gender`, `BedNr`, `FirstName`, `LastName`, `GestationalWeek`, `GestationalDay`, `BirthWeight`, `BirthLength`, `HeadCircumference`, `FatMass`, `FatFreeMass`, `MotherAge`, `MotherHeight`, `MotherPrePregnancyWeight`, `MotherafterPregnancyWeight`, `FatherAge`, `FatherWeight`, `FatherHeight`, `CreatedBy`, `CreatedAt`, `Discharged`) VALUES
(9, 2, 1, '2022-10-16', 'female', '13', 'Frieda', 'Sindering', 26, 3, 1100, 33, 25, 244, 1606, 30, 164, 64, 70, 32, 80, 170, 'admin', '2025-04-29 19:27:28', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `patient_admission_taskstable`
--

CREATE TABLE `patient_admission_taskstable` (
  `ID` int NOT NULL,
  `Title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `CreatedByUser` int DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Daten für Tabelle `patient_admission_taskstable`
--

INSERT INTO `patient_admission_taskstable` (`ID`, `Title`, `Description`, `Type`, `CreatedByUser`, `CreatedAt`) VALUES
(1, 'Title 1', 'Das ist die Beschreibung für 1', 'admission', 0, '2025-03-07 16:51:27'),
(2, 'Title 2', 'Das ist die Beschreibung für 2', 'admission', 0, '2025-03-07 16:51:27'),
(3, 'Title 3', 'Das ist die Beschreibung für 3', 'admission', 0, '2025-03-07 16:54:02'),
(4, 'Title 4', 'Das ist die Beschreibung für 4', 'admission', 0, '2025-03-10 21:17:13'),
(5, 'Title 5', 'Das ist die Beschreibung für 5', 'admission', 0, '2025-03-10 21:42:30');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `patient_routine_tasks_table`
--

CREATE TABLE `patient_routine_tasks_table` (
  `ID` int NOT NULL,
  `Title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `DayOfLife` int DEFAULT NULL,
  `LowerWeekLimit` int DEFAULT NULL,
  `UpperWeekLimit` int DEFAULT NULL,
  `LowerBirthWeight` int DEFAULT NULL,
  `UpperBirthWeight` int DEFAULT NULL,
  `TaskStartPostmenstrualAge` int DEFAULT NULL,
  `CreatedByUser` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Daten für Tabelle `patient_routine_tasks_table`
--

INSERT INTO `patient_routine_tasks_table` (`ID`, `Title`, `Description`, `Type`, `DayOfLife`, `LowerWeekLimit`, `UpperWeekLimit`, `LowerBirthWeight`, `UpperBirthWeight`, `TaskStartPostmenstrualAge`, `CreatedByUser`, `CreatedAt`) VALUES
(1, 'Aufklärung', 'Ein Aufklärungsgespräch führen', 'routine', 0, 0, 0, 0, 0, 0, 'none', '2023-11-05 00:00:00'),
(2, 'Checklisten anlegen', 'Checklisten anlegen\n', 'routine', 0, 0, 0, 0, 0, 0, 'none', '2023-11-05 00:00:00'),
(3, 'Studien aufklären', 'abh. der Einschlusskriterien\n', 'routine', 0, 0, 0, 0, 0, 0, 'none', '2023-11-05 00:00:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `patient_tasks_table`
--

CREATE TABLE `patient_tasks_table` (
  `ID` int NOT NULL,
  `PatientID` int NOT NULL,
  `RoutineID` int DEFAULT NULL,
  `AdmissionID` int DEFAULT NULL,
  `Title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `Deadline` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci DEFAULT NULL,
  `DayOfLife` int DEFAULT NULL,
  `LowerWeekLimit` int DEFAULT NULL,
  `UpperWeekLimit` int DEFAULT NULL,
  `LowerBirthWeight` int DEFAULT NULL,
  `UpperBirthWeight` int DEFAULT NULL,
  `TaskStartPostmenstrualAge` int DEFAULT NULL,
  `CreatedByUser` int DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT NULL,
  `Processed` tinyint(1) DEFAULT NULL,
  `ProcessedAt` timestamp NULL DEFAULT NULL,
  `ProcessedByUser` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Daten für Tabelle `patient_tasks_table`
--

INSERT INTO `patient_tasks_table` (`ID`, `PatientID`, `RoutineID`, `AdmissionID`, `Title`, `Description`, `Type`, `Deadline`, `DayOfLife`, `LowerWeekLimit`, `UpperWeekLimit`, `LowerBirthWeight`, `UpperBirthWeight`, `TaskStartPostmenstrualAge`, `CreatedByUser`, `CreatedAt`, `Processed`, `ProcessedAt`, `ProcessedByUser`) VALUES
(27, 9, 4, NULL, 'Aufklärung', 'Ein Aufklärungsgespräch führen', 'routine', NULL, 0, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL, NULL),
(28, 9, 5, NULL, 'Checklisten anlegen', 'Checklisten anlegen\n', 'routine', NULL, 0, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL, NULL),
(29, 9, 6, NULL, 'Studien aufklären', 'abh. der Einschlusskriterien\n', 'routine', NULL, 0, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL, NULL),
(30, 9, 7, NULL, 'Blutentnahme Tag 2', 'ABL, BB + Diff., CrP, Bili, bei Hypoxie Transaminasen ansetzen', 'routine', NULL, 1, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL, NULL),
(31, 9, 8, NULL, 'Sono Schädel ', 'Sono Schädel Tag 1', 'routine', NULL, 1, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL, NULL),
(32, 9, 9, NULL, 'Sono Schädel ', 'Sono Schädel Tag 3', 'routine', NULL, 3, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL, NULL),
(33, 9, 10, NULL, 'Blutentnahme Tag 1', 'ABL, BB + Diff., Retis, falls nicht aus NS-Blut BG und DCT, bei Hypoxie NSE, S100, CK BB', 'routine', NULL, 1, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL, NULL),
(34, 9, 11, NULL, 'BE Mutter', 'BG, AK Suchtest, Toxo, CMV, HSV, Hepatitis, bei neonat. Anämie Hk<0,40 fetale HbF', 'routine', NULL, 1, 0, 225, 0, 0, 0, 1, NULL, NULL, NULL, NULL),
(35, 9, 12, NULL, 'Sono Schädel', 'Sono Schädel + Niere Tag 7 Facharzt', 'routine', NULL, 7, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL, NULL),
(36, 9, 13, NULL, 'Sono Schädel', 'Sono Schädel Tag 14', 'routine', NULL, 14, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL, NULL),
(37, 9, 14, NULL, 'Sono Schädel + Niere Tag 152', 'Sono Schädel + Niere Tag 28', 'routine', NULL, 28, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL, NULL),
(38, 9, 15, NULL, 'task 000', 'sadsadsa\nsdasdsa\n\ndsadasdas\n\n\ndsadsada\n\n\ndsadasd : sadas1561 \"fdaaf\n@', 'routine', NULL, 5, NULL, 422, NULL, 15, NULL, 1, NULL, NULL, NULL, NULL),
(39, 9, 17, NULL, 'Routine Irgendwas', 'Hasadsaj\nfdaslfjpoewf\n\n\nfewioifejwf\n\n\nfewikhjiofwejiop', 'routine', NULL, 12, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL),
(40, 9, 18, NULL, 'Die Aufgabe 1', 'Beschreibung 1', 'routine', NULL, 1, 2, 3, 4, 5, 9, 1, NULL, NULL, NULL, NULL),
(41, 9, 19, NULL, 'Aufgabe 2', 'Das ist die Beschreibung 2', 'routine', NULL, 1, 2, 3, 4, 5, 9, 1, NULL, NULL, NULL, NULL),
(42, 9, NULL, 1, 'Title 1', 'Das ist die Beschreibung für 1', 'admission', '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL),
(43, 9, NULL, 2, 'Title 2', 'Das ist die Beschreibung für 2', 'admission', '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL),
(44, 9, NULL, 3, 'Title 3', 'Das ist die Beschreibung für 3', 'admission', '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL),
(45, 9, NULL, 6, 'Title 4', 'Das ist die Beschreibung für 4', 'admission', '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL),
(46, 9, NULL, 7, 'Title 5', 'Das ist die Beschreibung für 5', 'admission', '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL),
(47, 9, NULL, 8, 'Title 6', 'Das ist die Beschreibung für 6', 'admission', '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL),
(48, 9, NULL, 9, 'Title 10', 'asdasd', 'admission', '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL),
(49, 9, NULL, 10, 'Title 11', 'asdadsa', 'admission', '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL),
(50, 9, NULL, 11, 'Title 9', 'asdasdsd', 'admission', '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL),
(51, 9, NULL, 12, 'Title 8', 'asdsadasd', 'admission', '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL),
(52, 9, NULL, 13, 'Title 7', 'sdaaSADSAD', 'admission', '2025-04-29', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `stationtable`
--

CREATE TABLE `stationtable` (
  `ID` int NOT NULL,
  `StationNr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `ClinicID` int NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `BedArray` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `CreatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Daten für Tabelle `stationtable`
--

INSERT INTO `stationtable` (`ID`, `StationNr`, `ClinicID`, `Name`, `BedArray`, `CreatedBy`, `CreatedAt`) VALUES
(1, 'St-1', 2, 'Station 1', '[\"1\", \"2\", \"3\"]', 'admin', '2025-04-28 15:44:22'),
(2, 'St-2', 2, 'Station 2', '[\"13\",\"34\",\"55\"]', 'admin', '2025-04-29 17:39:09');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `usertable`
--

CREATE TABLE `usertable` (
  `ID` int NOT NULL,
  `First_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `Last_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci DEFAULT NULL,
  `Username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `Email_Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `Birthdate` date DEFAULT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci NOT NULL,
  `ClinicID` int NOT NULL,
  `StationID` int NOT NULL,
  `Role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_german2_ci DEFAULT NULL,
  `Status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

--
-- Daten für Tabelle `usertable`
--

INSERT INTO `usertable` (`ID`, `First_Name`, `Last_Name`, `Username`, `Email_Address`, `Birthdate`, `Password`, `ClinicID`, `StationID`, `Role`, `Status`) VALUES
(1, 'Admin', 'Master', 'admin', 'admin@gmail.com', '2024-03-02', '$2b$10$4FILg8Rr2F/lwqKdH104CegPdY1tf3SzIS/74fzNYAvC/AF7y8WIm', 1, 1, 'admin', 1);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `clinictable`
--
ALTER TABLE `clinictable`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `dailytasktable`
--
ALTER TABLE `dailytasktable`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `unique_patient_clinic_station_bed_taskdate` (`PatientID`,`ClinicID`,`StationNr`,`BedNr`,`TaskDate`);

--
-- Indizes für die Tabelle `patienttable`
--
ALTER TABLE `patienttable`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `patient_admission_taskstable`
--
ALTER TABLE `patient_admission_taskstable`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `patient_routine_tasks_table`
--
ALTER TABLE `patient_routine_tasks_table`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `patient_tasks_table`
--
ALTER TABLE `patient_tasks_table`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `stationtable`
--
ALTER TABLE `stationtable`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `usertable`
--
ALTER TABLE `usertable`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `clinictable`
--
ALTER TABLE `clinictable`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT für Tabelle `dailytasktable`
--
ALTER TABLE `dailytasktable`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT für Tabelle `patienttable`
--
ALTER TABLE `patienttable`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT für Tabelle `patient_admission_taskstable`
--
ALTER TABLE `patient_admission_taskstable`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `patient_routine_tasks_table`
--
ALTER TABLE `patient_routine_tasks_table`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `patient_tasks_table`
--
ALTER TABLE `patient_tasks_table`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT für Tabelle `stationtable`
--
ALTER TABLE `stationtable`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `usertable`
--
ALTER TABLE `usertable`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
