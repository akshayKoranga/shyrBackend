-- phpMyAdmin SQL Dump
-- version 4.7.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 09, 2018 at 03:07 AM
-- Server version: 5.7.20
-- PHP Version: 7.0.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qa`
--

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2018_03_23_050612_create_jobs_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `question_answer`
--

CREATE TABLE `question_answer` (
  `id` int(11) NOT NULL,
  `question_key` varchar(255) NOT NULL,
  `question` varchar(2555) DEFAULT NULL,
  `answer` varchar(2555) DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `question_answer`
--

INSERT INTO `question_answer` (`id`, `question_key`, `question`, `answer`, `count`, `created_at`, `updated_at`) VALUES
(91, 'question1', 'Product : 1', 'Water Softener\nModel : Medallist Series\nGrain Capacity : 27,000\nBrine Tank : 110 lbs Brine Tank\nLocation : Basement\nArea : Unfinished Area', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(92, 'question2', 'Product : 3', 'Big Blue Filter\nModel : 10\" Big Blue Filter\nFilter : DGD 2501 Sediment\nLocation : Basement\nArea : Unfinished Area', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(93, 'question3', 'Water source', 'City', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(94, 'question4', 'Product : 4', 'Auto Carbon\nModel : Medallist Series\nSize : 10 x 54\nArea : Unfinished Area\nLocation : Basement', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(95, 'question5', 'Install system in', 'Type : Copper\nSize : 1/4\"\nAmount : < 5\'', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(96, 'question6', 'Bypass lines', 'Yes', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(97, 'question7', 'Remove existing equipment', 'Yes', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(98, 'question8', 'Notes', '\n\n', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(99, 'question9', 'Pieces of equipment', '1', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(100, 'question10', 'Plumbing Permit', 'Yes', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(101, 'question11', 'Location of equipment', 'Unfinished Area\nBasement : Yes\nUtility Room : Yes\nCrawl Space : Yes\nUnder Sink : Yes\nGarage : Yes\nOther : Yes', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(102, 'question12', 'Product : 2', 'Reverse Osmosis\nModel : AC30\nTank : 2 Gallon\nFaucet Design : Culligan Faucet\nFaucet Color : Chrome\nSink : Stainless Sink\nBooster Pump : Yes\nInstall : Basement\nExtra Hook up : No Extra Hook Up\nWater Line : Angle Stop\nWater Line Size : 1/4\"\nSpecial Fitting : 1/4\"\nLocation : Basement\nArea : Unfinished Area', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(103, 'question13', 'Address', 'add', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(104, 'question14', 'Product : 7', 'Chemical Feeder\nModel : C-Series Pump\nMeter  : 3/4\" Meter\nMixer : 3/4\"\nType : Soda Ash\nContact Tank : 40 Gallon Contact Tank\nLocation : Basement\nArea : Unfinished Area', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(105, 'question15', 'Expansion tank', 'Yes', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(106, 'question16', 'Electrical', 'Existing Outlet - 6\' Cord', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(107, 'question17', 'Extra help needed', 'Yes', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(108, 'question18', 'Building Type', 'Single Family', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(109, 'question19', 'Water pressure', 'Tested', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(110, 'question20', 'Product : 5', 'Auto Depth Filter\nModel : Medallist Series\nSize : 10 x 54\nArea : Unfinished Area\nLocation : Basement', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(111, 'question21', '3 Handle bypass', 'Yes', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(112, 'question22', 'Auto shut off value', 'Yes', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(113, 'question23', 'Install Ranking', '05/03/2018', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(114, 'question24', 'Product : 6', 'Auto Neutralizer\nModel : Medallist Series\nSize : 10 x 54\nArea : Unfinished Area\nLocation : Basement', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(115, 'question25', 'Full line', 'Yes', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(116, 'question26', 'Existing Plumbing', 'Type : Copper\nSize : 1/4\"', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(117, 'question27', 'Pressure reducing value', 'Yes', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(118, 'question28', 'Drain Pipe Size', 'Type : Not Applicable - (if so skip this step)\nSize : 1.5\"\nTrap Size : 1.5\"\nBack Water Valve : Yes\nStuda Vent : Yes', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(119, 'question29', 'Drainage', 'Existing Trap', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(120, 'question30', 'Water pressure (in psi)', 'asdsad', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(121, 'question31', 'Customer', 'add', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(122, 'question32', 'Date', '05/03/2018', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(123, 'question33', 'Product : 8', 'Portable Exchange Tank\nModel : 9\" PE Tank\nFrequency : 14 Day\nLocation : Basement\nArea : Unfinished Area', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(124, 'question34', 'Product : 9', 'Bottled Free Cooler (BFC)\nModel : Basic BFC White\nFilter Type : Basic Filter\nLocation : Basement\nArea : Unfinished Area', 1, '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(125, 'question1', 'Product : 1', 'Water Softener\nModel : Medallist Series\nGrain Capacity : 27,000\nBrine Tank : 110 lbs Brine Tank\nLocation : Basement\nArea : Unfinished Area', 2, '2018-05-03 03:12:26', '2018-05-03 05:12:26'),
(126, 'question2', 'Product : 3', 'Water Softener\nModel : Medallist Series\nGrain Capacity : 27,000\nBrine Tank : 110 lbs Brine Tank\nLocation : Basement\nArea : Unfinished Area', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(127, 'question3', 'Water source', 'City', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(128, 'question4', 'Product : 4', 'Water Softener\nModel : Medallist Series\nGrain Capacity : 27,000\nBrine Tank : 110 lbs Brine Tank\nLocation : Basement\nArea : Unfinished Area', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(129, 'question5', 'Install system in', 'Type : Copper\nSize : 1/4\"\nAmount : < 5\'', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(130, 'question6', 'Bypass lines', 'Yes', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(131, 'question7', 'Remove existing equipment', 'Yes', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(132, 'question8', 'Notes', '\n\n', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(133, 'question9', 'Pieces of equipment', '1', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(134, 'question10', 'Plumbing Permit', 'Yes', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(135, 'question11', 'Location of equipment', 'Unfinished Area\nBasement : Yes\nUtility Room : Yes\nCrawl Space : Yes\nUnder Sink : Yes\nGarage : Yes\nOther : Yes', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(136, 'question12', 'Product : 2', 'Reverse Osmosis\nModel : AC30\nTank : 2 Gallon\nFaucet Design : Culligan Faucet\nFaucet Color : Chrome\nSink : Stainless Sink\nBooster Pump : Yes\nInstall : Basement\nExtra Hook up : No Extra Hook Up\nWater Line : Angle Stop\nWater Line Size : 1/4\"\nSpecial Fitting : 1/4\"\nLocation : Basement\nArea : Unfinished Area', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(137, 'question13', 'Address', 'add', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(138, 'question14', 'Product : 7', 'Water Softener\nModel : Medallist Series\nGrain Capacity : 27,000\nBrine Tank : 110 lbs Brine Tank\nLocation : Basement\nArea : Unfinished Area', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(139, 'question15', 'Expansion tank', 'Yes', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(140, 'question16', 'Electrical', 'Existing Outlet - 6\' Cord', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(141, 'question17', 'Extra help needed', 'Yes', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(142, 'question18', 'Building Type', 'Single Family', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(143, 'question19', 'Water pressure', 'Tested', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(144, 'question20', 'Product : 5', 'Water Softener\nModel : Medallist Series\nGrain Capacity : 27,000\nBrine Tank : 110 lbs Brine Tank\nLocation : Basement\nArea : Unfinished Area', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(145, 'question21', '3 Handle bypass', 'Yes', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(146, 'question22', 'Auto shut off value', 'Yes', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(147, 'question23', 'Install Ranking', '05/03/2018', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(148, 'question24', 'Product : 6', 'Water Softener\nModel : Medallist Series\nGrain Capacity : 27,000\nBrine Tank : 110 lbs Brine Tank\nLocation : Basement\nArea : Unfinished Area', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(149, 'question25', 'Full line', 'Yes', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(150, 'question26', 'Existing Plumbing', 'Type : Copper\nSize : 1/4\"', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(151, 'question27', 'Pressure reducing value', 'Yes', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(152, 'question28', 'Drain Pipe Size', 'Type : Not Applicable - (if so skip this step)\nSize : 1.5\"\nTrap Size : 1.5\"\nBack Water Valve : Yes\nStuda Vent : Yes', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(153, 'question29', 'Drainage', 'Existing Trap', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(154, 'question30', 'Water pressure (in psi)', 'asdsad', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(155, 'question31', 'Customer', 'add', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(156, 'question32', 'Date', '05/03/2018', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(157, 'question33', 'Product : 8', 'Water Softener\nModel : Medallist Series\nGrain Capacity : 27,000\nBrine Tank : 110 lbs Brine Tank\nLocation : Basement\nArea : Unfinished Area', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(158, 'question34', 'Product : 9', 'Water Softener\nModel : Medallist Series\nGrain Capacity : 27,000\nBrine Tank : 110 lbs Brine Tank\nLocation : Basement\nArea : Unfinished Area', 2, '2018-05-03 03:12:27', '2018-05-03 05:12:27'),
(159, 'question1', 'Date', '05/03/2018', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(160, 'question2', 'Customer', 'adds', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(161, 'question3', 'Address', 'add', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(162, 'question4', 'Plumbing Permit', 'Yes', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(163, 'question5', 'Install Ranking', '05/03/2018', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(164, 'question6', 'Extra help needed', 'Yes', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(165, 'question7', 'Pieces of equipment', '1', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(166, 'question8', 'Building Type', 'Single Family', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(167, 'question9', 'Water source', 'City', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(168, 'question10', 'Water pressure', 'Tested', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(169, 'question11', 'Water pressure (in psi)', 'da', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(170, 'question12', 'Location of equipment', 'Unfinished Area\nBasement : Yes\nUtility Room : Yes\nCrawl Space : Yes\nUnder Sink : Yes\nGarage : Yes\nOther : Yes', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(171, 'question13', 'Product : 1', 'Water Softener\nModel : Medallist Series\nGrain Capacity : 27,000\nBrine Tank : 110 lbs Brine Tank\nLocation : Basement\nArea : Unfinished Area', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25'),
(172, 'question14', 'Product : 2', 'Water Softener\nModel : Medallist Series\nGrain Capacity : 27,000\nBrine Tank : 110 lbs Brine Tank\nLocation : Basement\nArea : Unfinished Area', 3, '2018-05-03 03:39:25', '2018-05-03 05:39:25');

-- --------------------------------------------------------

--
-- Table structure for table `question_images`
--

CREATE TABLE `question_images` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `images` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `question_images`
--

INSERT INTO `question_images` (`id`, `question_id`, `images`, `created_at`, `updated_at`) VALUES
(4, 124, '11525324259.jpeg', '2018-05-03 03:10:59', '2018-05-03 05:10:59'),
(5, 158, '11525324347.jpeg', '2018-05-03 03:12:27', '2018-05-03 05:12:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `question_answer`
--
ALTER TABLE `question_answer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question_images`
--
ALTER TABLE `question_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=317;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `question_answer`
--
ALTER TABLE `question_answer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT for table `question_images`
--
ALTER TABLE `question_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
