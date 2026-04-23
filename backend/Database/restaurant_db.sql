-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 21, 2026 at 03:48 PM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restaurant_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
CREATE TABLE IF NOT EXISTS `audit_log` (
  `audit_ID` int NOT NULL AUTO_INCREMENT,
  `employee_ID` int DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `target` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`audit_ID`),
  KEY `employee_ID` (`employee_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_ID` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_type` enum('Đồ ăn','Đồ uống','Khác') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_ID`, `category_name`, `category_type`, `created_at`, `updated_at`) VALUES
(6, 'Cơm niêu', '', '2026-04-21 21:47:00', '2026-04-21 21:47:00'),
(7, 'Món mặn', '', '2026-04-21 21:47:00', '2026-04-21 21:47:00'),
(8, 'Món kho', '', '2026-04-21 21:47:00', '2026-04-21 21:47:00'),
(9, 'Món xào', '', '2026-04-21 21:47:00', '2026-04-21 21:47:00'),
(10, 'Canh', '', '2026-04-21 21:47:00', '2026-04-21 21:47:00'),
(11, 'Rau', '', '2026-04-21 21:47:00', '2026-04-21 21:47:00'),
(12, 'Tráng miệng', '', '2026-04-21 21:47:00', '2026-04-21 21:47:00'),
(13, 'Nước uống', '', '2026-04-21 21:47:00', '2026-04-21 21:47:00');

-- --------------------------------------------------------

--
-- Table structure for table `combo`
--

DROP TABLE IF EXISTS `combo`;
CREATE TABLE IF NOT EXISTS `combo` (
  `combo_ID` int NOT NULL AUTO_INCREMENT,
  `combo_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `status` enum('Bật','Tắt') COLLATE utf8mb4_unicode_ci DEFAULT 'Bật',
  PRIMARY KEY (`combo_ID`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `combo`
--

INSERT INTO `combo` (`combo_ID`, `combo_name`, `price`, `status`) VALUES
(11, 'Combo 2 ngươi', 500000.00, 'Bật'),
(12, 'Combo 3 người', 2000000.00, 'Bật');

-- --------------------------------------------------------

--
-- Table structure for table `combo_detail`
--

DROP TABLE IF EXISTS `combo_detail`;
CREATE TABLE IF NOT EXISTS `combo_detail` (
  `combo_detail_ID` int NOT NULL AUTO_INCREMENT,
  `combo_ID` int DEFAULT NULL,
  `menu_ID` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  PRIMARY KEY (`combo_detail_ID`),
  KEY `combo_ID` (`combo_ID`),
  KEY `menu_ID` (`menu_ID`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `combo_detail`
--

INSERT INTO `combo_detail` (`combo_detail_ID`, `combo_ID`, `menu_ID`, `quantity`) VALUES
(18, 11, 9, 1),
(17, 11, 8, 2),
(19, 12, 7, 1);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `customer_ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`customer_ID`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discount`
--

DROP TABLE IF EXISTS `discount`;
CREATE TABLE IF NOT EXISTS `discount` (
  `discount_ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('MENU','ORDER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `menu_ID` int DEFAULT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  PRIMARY KEY (`discount_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `discount`
--

INSERT INTO `discount` (`discount_ID`, `name`, `type`, `menu_ID`, `code`, `discount_percent`, `discount_amount`, `start_date`, `end_date`, `usage_limit`) VALUES
(1, 'Giảm giá khai trương', 'MENU', 0, NULL, 10.00, NULL, '2026-04-26', '2026-04-26', 50),
(2, 'SALE20K', 'ORDER', 0, 'SALE20K', NULL, 20000.00, '2026-03-31', '2026-04-30', 100);

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
CREATE TABLE IF NOT EXISTS `employee` (
  `employee_ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('Admin','Phục vụ','Bếp','Thu ngân') COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `contact` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('Active','Inactive') COLLATE utf8mb4_general_ci DEFAULT 'Active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`employee_ID`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`employee_ID`, `name`, `role`, `username`, `password`, `contact`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Nguyen Van A', 'Admin', 'admin', '$2b$10$ecyD3WiB/FFxOLY2zxd5WuCN6vq7uYgoWB6NT59raNbqLaP7tLnWi', '0901234567', 'Active', '2026-04-06 00:16:53', '2026-04-21 16:02:03'),
(2, 'Tran Thi B', 'Bếp', 'bep', '$2b$10$WTdU8Eupe1ZX4hGkLyqI8uwE7i9aIQsBf/.QK7NOMf4LuWRyNHCVy', '0912345678', 'Active', '2026-04-06 00:16:53', '2026-04-21 16:01:58'),
(3, 'Võ Anh Tuấn', 'Phục vụ', 'phucvu', '$2b$10$WTdU8Eupe1ZX4hGkLyqI8uwE7i9aIQsBf/.QK7NOMf4LuWRyNHCVy', '0359898732', 'Inactive', '2026-04-06 00:16:53', '2026-04-21 16:02:12'),
(7, 'Tuấn', 'Phục vụ', 'tuan', '$2b$10$YsLVFB5iJeKLvCowClcW1OvSfq./44/9cpE63jfOY9i3sUsYoaYfq', '', 'Active', '2026-04-21 16:08:57', '2026-04-21 16:08:57');

-- --------------------------------------------------------

--
-- Table structure for table `employee_shift`
--

DROP TABLE IF EXISTS `employee_shift`;
CREATE TABLE IF NOT EXISTS `employee_shift` (
  `employee_shift_ID` int NOT NULL AUTO_INCREMENT,
  `employee_ID` int DEFAULT NULL,
  `shift_ID` int DEFAULT NULL,
  `shift_date` date DEFAULT NULL,
  `check_in_time` datetime DEFAULT NULL,
  `check_out_time` datetime DEFAULT NULL,
  `hours_worked` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`employee_shift_ID`),
  KEY `employee_ID` (`employee_ID`),
  KEY `shift_ID` (`shift_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_shift`
--

INSERT INTO `employee_shift` (`employee_shift_ID`, `employee_ID`, `shift_ID`, `shift_date`, `check_in_time`, `check_out_time`, `hours_worked`) VALUES
(19, 2, 1, '2026-04-19', NULL, NULL, NULL),
(22, 2, 1, '2026-04-26', NULL, NULL, NULL),
(23, 3, 2, '2026-04-19', NULL, NULL, NULL),
(24, 2, 2, '2026-04-20', NULL, NULL, NULL),
(25, 3, 2, '2026-04-20', NULL, NULL, NULL),
(26, 0, 2, '2026-04-20', NULL, NULL, NULL),
(27, 0, 2, '2026-04-20', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `floor`
--

DROP TABLE IF EXISTS `floor`;
CREATE TABLE IF NOT EXISTS `floor` (
  `floor_ID` int NOT NULL AUTO_INCREMENT,
  `floor_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`floor_ID`),
  UNIQUE KEY `floor_name` (`floor_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `floor`
--

INSERT INTO `floor` (`floor_ID`, `floor_name`, `created_at`, `updated_at`) VALUES
(1, 'Tầng trệt', '2026-04-03 16:16:19', '2026-04-03 16:22:21'),
(2, 'Tầng 1', '2026-04-03 16:22:41', '2026-04-03 16:22:41'),
(3, 'Tầng 2', '2026-04-03 16:22:51', '2026-04-03 16:22:51'),
(4, 'Tầng 3', '2026-04-03 17:27:04', '2026-04-03 17:27:04'),
(5, 'VIP', '2026-04-04 08:08:24', '2026-04-04 08:08:24');

-- --------------------------------------------------------

--
-- Table structure for table `group_order`
--

DROP TABLE IF EXISTS `group_order`;
CREATE TABLE IF NOT EXISTS `group_order` (
  `group_order_id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Đang dùng',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `home_content`
--

DROP TABLE IF EXISTS `home_content`;
CREATE TABLE IF NOT EXISTS `home_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `banner_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `home_content`
--

INSERT INTO `home_content` (`id`, `title`, `description`, `updated_at`, `banner_url`) VALUES
(18, '<p class=\"ql-align-center\"><span class=\"ql-size-huge\" style=\"color: rgb(230, 0, 0);\">Cơm nêu</span></p>', '<p><span class=\"ql-size-large\" style=\"background-color: rgb(229, 237, 255); color: rgb(10, 10, 10);\">Cơm niêu&nbsp;</span><span class=\"ql-size-large\">là món ăn truyền thống Việt Nam, gạo thơm được nấu trong niêu đất, tạo nên cơm dẻo tơi xốp bên trên và lớp cháy vàng giòn, bùi bùi dưới đáy</span><span class=\"ql-size-large\" style=\"background-color: rgb(229, 237, 255); color: rgb(10, 10, 10);\">. </span><span class=\"ql-size-large\" style=\"background-color: rgb(255, 153, 0); color: rgb(10, 10, 10);\">Đây là biểu tượng ẩm thực bình dị, gắn liền với sự sum vầy, thường ăn cùng các món dân dã như kho quẹt, cá kho tộ và canh cua mồng tơi.&nbsp;</span></p>', '2026-04-19 13:19:50', '/uploads/1776604487017-286734525.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `ingredient`
--

DROP TABLE IF EXISTS `ingredient`;
CREATE TABLE IF NOT EXISTS `ingredient` (
  `ingredient_ID` int NOT NULL AUTO_INCREMENT,
  `ingredient_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `unit` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `import_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiry_date` datetime DEFAULT NULL,
  `entered_by` int DEFAULT NULL,
  `category_ID` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `quantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`ingredient_ID`),
  KEY `fk_ingredient_category` (`category_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingredient`
--

INSERT INTO `ingredient` (`ingredient_ID`, `ingredient_name`, `unit`, `created_at`, `updated_at`, `import_date`, `expiry_date`, `entered_by`, `category_ID`, `price`, `quantity`) VALUES
(17, 'Rau muống', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-04-23 00:00:00', 1, 7, 15000.00, 30.00),
(18, 'Rau ngót', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-04-23 00:00:00', 1, 7, 12000.00, 25.00),
(19, 'Tỏi', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-05-21 00:00:00', 1, 8, 60000.00, 5.00),
(20, 'Hành tím', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:46:29', '2026-04-21 00:00:00', '2026-05-21 00:00:00', 1, 8, 50000.00, 4.99),
(21, 'Nước mắm', 'l', '2026-04-21 22:04:59', '2026-04-21 22:46:29', '2026-04-20 00:00:00', '2027-04-20 00:00:00', NULL, 8, 40000.00, 960.00),
(22, 'Cá lóc', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:46:29', '2026-04-21 00:00:00', '2026-04-23 00:00:00', 1, 9, 90000.00, 11.70),
(23, 'Cá basa', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-04-23 00:00:00', 1, 9, 80000.00, 10.00),
(24, 'Gạo ST25', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:46:56', '2026-04-21 00:00:00', '2026-06-21 00:00:00', 1, 10, 20000.00, 49.10),
(25, 'Bún tươi', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-04-22 00:00:00', 1, 10, 15000.00, 20.00),
(26, 'Thịt ba chỉ', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:46:29', '2026-04-21 00:00:00', '2026-04-25 00:00:00', 1, 11, 120000.00, 19.75),
(27, 'Sườn heo', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-04-25 00:00:00', 1, 11, 150000.00, 15.00),
(28, 'Thịt bò', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-04-25 00:00:00', 1, 11, 200000.00, 10.00),
(29, 'Cà rốt', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-04-28 00:00:00', 1, 12, 20000.00, 20.00),
(30, 'Khoai tây', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-05-05 00:00:00', 1, 12, 18000.00, 25.00),
(31, 'Trứng gà', 'quả', '2026-04-21 22:04:59', '2026-04-21 22:46:29', '2026-04-21 00:00:00', '2026-04-30 00:00:00', 1, 13, 3000.00, 98.00),
(32, 'Cam tươi', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-04-25 00:00:00', 1, 14, 30000.00, 20.00),
(33, 'Chanh', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-04-25 00:00:00', 1, 14, 25000.00, 15.00),
(34, 'Nấm khô', 'kg', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-10-21 00:00:00', 1, 15, 100000.00, 5.00),
(35, 'Sữa tươi', 'lít', '2026-04-21 22:04:59', '2026-04-21 22:04:59', '2026-04-21 00:00:00', '2026-05-10 00:00:00', 1, 16, 30000.00, 10.00);

-- --------------------------------------------------------

--
-- Table structure for table `ingredient_category`
--

DROP TABLE IF EXISTS `ingredient_category`;
CREATE TABLE IF NOT EXISTS `ingredient_category` (
  `category_ID` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingredient_category`
--

INSERT INTO `ingredient_category` (`category_ID`, `category_name`, `description`, `created_at`, `updated_at`) VALUES
(7, 'Rau', NULL, '2026-04-21 22:03:57', '2026-04-21 22:03:57'),
(8, 'Gia vị', NULL, '2026-04-21 22:03:57', '2026-04-21 22:03:57'),
(9, 'Hải sản', NULL, '2026-04-21 22:03:57', '2026-04-21 22:03:57'),
(10, 'Tinh bột', NULL, '2026-04-21 22:03:57', '2026-04-21 22:03:57'),
(11, 'Thịt', NULL, '2026-04-21 22:03:57', '2026-04-21 22:03:57'),
(12, 'Củ', NULL, '2026-04-21 22:03:57', '2026-04-21 22:03:57'),
(13, 'Trứng', NULL, '2026-04-21 22:03:57', '2026-04-21 22:03:57'),
(14, 'Trái cây', NULL, '2026-04-21 22:03:57', '2026-04-21 22:03:57'),
(15, 'Đồ khô', NULL, '2026-04-21 22:03:57', '2026-04-21 22:03:57'),
(16, 'Sản phẩm phụ', NULL, '2026-04-21 22:03:57', '2026-04-21 22:03:57');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE IF NOT EXISTS `inventory` (
  `inventory_ID` int NOT NULL AUTO_INCREMENT,
  `ingredient_ID` int DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `min_quantity_alert` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`inventory_ID`),
  KEY `ingredient_ID` (`ingredient_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventory_ID`, `ingredient_ID`, `quantity`, `min_quantity_alert`, `created_at`, `updated_at`) VALUES
(1, 3, 0.65, 5.00, '2026-04-18 00:00:25', '2026-04-18 00:00:25'),
(2, 4, 1.00, 5.00, '2026-04-18 00:00:25', '2026-04-18 00:00:25'),
(3, 5, 1.00, 5.00, '2026-04-18 00:00:25', '2026-04-18 00:00:25'),
(4, 6, 0.80, 5.00, '2026-04-18 00:00:25', '2026-04-18 00:00:25'),
(5, 13, 1.00, 5.00, '2026-04-18 00:00:25', '2026-04-18 00:00:25'),
(6, 14, 1.00, 5.00, '2026-04-18 00:00:25', '2026-04-18 00:00:25'),
(7, 15, 1.00, 5.00, '2026-04-18 00:00:25', '2026-04-18 00:00:25'),
(8, 16, 1.00, 5.00, '2026-04-18 00:00:25', '2026-04-18 00:00:25');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transaction`
--

DROP TABLE IF EXISTS `inventory_transaction`;
CREATE TABLE IF NOT EXISTS `inventory_transaction` (
  `transaction_ID` int NOT NULL AUTO_INCREMENT,
  `ingredient_ID` int DEFAULT NULL,
  `type` enum('Nhập','Xuất') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `employee_ID` int DEFAULT NULL,
  `supplier_ID` int DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_ID`),
  KEY `ingredient_ID` (`ingredient_ID`),
  KEY `employee_ID` (`employee_ID`),
  KEY `supplier_ID` (`supplier_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_transaction`
--

INSERT INTO `inventory_transaction` (`transaction_ID`, `ingredient_ID`, `type`, `quantity`, `employee_ID`, `supplier_ID`, `date`) VALUES
(1, 3, 'Nhập', 10.00, 1, NULL, '2026-04-18 00:00:48'),
(2, 0, 'Nhập', 0.00, 1, NULL, '2026-04-18 00:05:45');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
CREATE TABLE IF NOT EXISTS `menu` (
  `menu_ID` int NOT NULL AUTO_INCREMENT,
  `menu_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_ID` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Bật','Tắt') COLLATE utf8mb4_unicode_ci DEFAULT 'Bật',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `menu_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`menu_ID`),
  UNIQUE KEY `menu_code` (`menu_code`),
  KEY `category_ID` (`category_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`menu_ID`, `menu_name`, `category_ID`, `price`, `image_url`, `status`, `created_at`, `updated_at`, `menu_code`) VALUES
(28, 'Cơm niêu truyền thống', 6, 25000.00, '/uploads/1776784584508-925894682.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:16:24', 'C1'),
(29, 'Cơm niêu cháy giòn', 6, 30000.00, '/uploads/1776784620863-738111493.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:17:00', 'C2'),
(30, 'Cá kho tộ', 7, 60000.00, '/uploads/1776784661261-419473318.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:17:41', 'M1'),
(31, 'Thịt kho trứng', 7, 55000.00, '/uploads/1776784699908-931566385.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:18:19', 'M2'),
(32, 'Sườn ram mặn', 7, 65000.00, '/uploads/1776784730906-978137791.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:18:50', 'M3'),
(33, 'Cá kho tiêu', 8, 65000.00, '/uploads/1776784766008-25285133.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:19:26', 'M4'),
(34, 'Rau muống xào tỏi', 9, 35000.00, '/uploads/1776784823020-60238356.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:20:23', 'M5'),
(35, 'Bò xào hành tây', 9, 75000.00, '/uploads/1776784851143-473566578.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:20:51', 'M6'),
(36, 'Canh chua cá lóc', 10, 70000.00, '/uploads/1776784874079-518066396.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:21:14', 'C3'),
(37, 'Canh rau ngót thịt bằm', 10, 50000.00, '/uploads/1776784913135-915751230.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:21:53', 'C4'),
(38, 'Rau luộc thập cẩm', 11, 30000.00, '/uploads/1776784950800-122872644.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:22:30', 'R1'),
(39, 'Cà pháo mắm tôm', 11, 25000.00, '/uploads/1776784980245-623286535.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:23:00', 'R2'),
(40, 'Chuối chiên', 12, 20000.00, '/uploads/1776785006790-70812890.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:23:26', 'T1'),
(41, 'Chè đậu xanh', 12, 20000.00, '/uploads/1776785027929-197108596.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:23:47', 'T2'),
(42, 'Trà đá', 13, 5000.00, '/uploads/1776785059298-274496126.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:24:19', 'N1'),
(43, 'Nước ngọt Coca', 13, 15000.00, '/uploads/1776785105537-615748395.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:25:05', 'N2'),
(44, 'Nước cam tươi', 13, 25000.00, '/uploads/1776785123868-406580651.jpg', 'Bật', '2026-04-21 21:56:21', '2026-04-21 22:25:23', 'N3');

--
-- Triggers `menu`
--
DROP TRIGGER IF EXISTS `before_insert_menu`;
DELIMITER $$
CREATE TRIGGER `before_insert_menu` BEFORE INSERT ON `menu` FOR EACH ROW BEGIN
    DECLARE prefix VARCHAR(2);
    DECLARE max_num INT;

    -- Lấy ký hiệu: 1 chữ cái đầu của tên danh mục
    SELECT LEFT(category_name,1) INTO prefix
    FROM category
    WHERE category_ID = NEW.category_ID;

    -- Nếu không tìm thấy category (mới thêm), báo lỗi
    IF prefix IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category not found';
    END IF;

    -- Tìm số lớn nhất hiện có trong nhóm
    SELECT IFNULL(MAX(CAST(SUBSTRING(menu_code, 2) AS UNSIGNED)),0)
    INTO max_num
    FROM menu
    WHERE menu_code LIKE CONCAT(prefix, '%');

    -- Gán menu_code mới
    SET NEW.menu_code = CONCAT(prefix, max_num + 1);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
CREATE TABLE IF NOT EXISTS `notification` (
  `notification_ID` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `recipient_role` enum('Admin','Bếp','Phục vụ','Thu ngân','All') COLLATE utf8mb4_general_ci DEFAULT 'All',
  `status` enum('Chưa gửi','Đã gửi') COLLATE utf8mb4_general_ci DEFAULT 'Chưa gửi',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_ID` int NOT NULL AUTO_INCREMENT,
  `table_ID` int DEFAULT NULL,
  `employee_ID` int DEFAULT NULL,
  `customer_ID` int DEFAULT NULL,
  `status` enum('Chờ xác nhận','Đang nấu','Hoàn thành','Đã thanh toán') COLLATE utf8mb4_general_ci DEFAULT 'Chờ xác nhận',
  `total_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `payment_method` enum('Tiền mặt','Chuyển khoản','Ví điện tử','Hóa đơn') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `group_order_id` int DEFAULT NULL,
  `start_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `discount_ID` int DEFAULT NULL,
  PRIMARY KEY (`order_ID`),
  KEY `table_ID` (`table_ID`),
  KEY `employee_ID` (`employee_ID`),
  KEY `customer_ID` (`customer_ID`),
  KEY `idx_order_status` (`status`,`table_ID`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`order_ID`, `table_ID`, `employee_ID`, `customer_ID`, `status`, `total_amount`, `discount_amount`, `payment_method`, `created_at`, `updated_at`, `group_order_id`, `start_time`, `discount_ID`) VALUES
(94, 2, 1, NULL, 'Chờ xác nhận', 170000.00, 0.00, NULL, '2026-04-21 22:43:59', '2026-04-21 22:44:00', NULL, '2026-04-21 22:43:59', NULL),
(95, 5, 1, NULL, 'Chờ xác nhận', 55000.00, 0.00, NULL, '2026-04-21 22:46:46', '2026-04-21 22:46:47', NULL, '2026-04-21 22:46:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE IF NOT EXISTS `order_details` (
  `order_detail_ID` int NOT NULL AUTO_INCREMENT,
  `order_ID` int DEFAULT NULL,
  `menu_ID` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('Chờ nấu','Đang chế biến','Hoàn thành') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `pendingQty` int DEFAULT '0',
  `cookingQty` int DEFAULT '0',
  `doneQty` int DEFAULT '0',
  `note_from_waiter` varchar(255) COLLATE utf8mb4_general_ci DEFAULT '',
  `note_from_kitchen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT '',
  `employee_kitchen_ID` int DEFAULT NULL,
  PRIMARY KEY (`order_detail_ID`),
  KEY `order_ID` (`order_ID`),
  KEY `menu_ID` (`menu_ID`),
  KEY `idx_order_detail_status` (`status`,`order_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=243 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`order_detail_ID`, `order_ID`, `menu_ID`, `quantity`, `note`, `status`, `price`, `pendingQty`, `cookingQty`, `doneQty`, `note_from_waiter`, `note_from_kitchen`, `employee_kitchen_ID`) VALUES
(237, 94, 28, 1, NULL, 'Hoàn thành', 25000.00, 0, 0, 1, '', '', NULL),
(238, 94, 29, 1, NULL, 'Hoàn thành', 30000.00, 0, 0, 1, '', '', NULL),
(239, 94, 30, 1, NULL, 'Hoàn thành', 60000.00, 0, 0, 1, '', '', NULL),
(240, 94, 31, 1, NULL, 'Hoàn thành', 55000.00, 0, 0, 1, '', '', NULL),
(241, 95, 28, 1, NULL, 'Hoàn thành', 25000.00, 0, 0, 1, '', '', NULL),
(242, 95, 29, 1, NULL, 'Hoàn thành', 30000.00, 0, 0, 1, '', '', NULL);

--
-- Triggers `order_details`
--
DROP TRIGGER IF EXISTS `update_order_total`;
DELIMITER $$
CREATE TRIGGER `update_order_total` AFTER INSERT ON `order_details` FOR EACH ROW BEGIN
  UPDATE `order` SET total_amount = (
    SELECT SUM(quantity * price) FROM `order_details` WHERE order_ID = NEW.order_ID
  ) WHERE order_ID = NEW.order_ID;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `update_order_total_delete`;
DELIMITER $$
CREATE TRIGGER `update_order_total_delete` AFTER DELETE ON `order_details` FOR EACH ROW BEGIN
  UPDATE `order` SET total_amount = (
    SELECT COALESCE(SUM(quantity * price), 0) FROM `order_details` WHERE order_ID = OLD.order_ID
  ) WHERE order_ID = OLD.order_ID;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `update_order_total_update`;
DELIMITER $$
CREATE TRIGGER `update_order_total_update` AFTER UPDATE ON `order_details` FOR EACH ROW BEGIN
  UPDATE `order` SET total_amount = (
    SELECT SUM(quantity * price) FROM `order_details` WHERE order_ID = NEW.order_ID
  ) WHERE order_ID = NEW.order_ID;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `recipe`
--

DROP TABLE IF EXISTS `recipe`;
CREATE TABLE IF NOT EXISTS `recipe` (
  `recipe_ID` int NOT NULL AUTO_INCREMENT,
  `menu_ID` int DEFAULT NULL,
  `ingredient_ID` int DEFAULT NULL,
  `quantity_required` decimal(10,2) DEFAULT NULL,
  `unit` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'g',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`recipe_ID`),
  KEY `menu_ID` (`menu_ID`),
  KEY `ingredient_ID` (`ingredient_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=263 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipe`
--

INSERT INTO `recipe` (`recipe_ID`, `menu_ID`, `ingredient_ID`, `quantity_required`, `unit`, `created_at`, `updated_at`) VALUES
(236, 28, 24, 200.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(237, 29, 24, 250.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(238, 30, 22, 300.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(239, 30, 21, 20.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(240, 30, 20, 10.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(241, 31, 26, 250.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(242, 31, 31, 2.00, 'quả', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(243, 31, 21, 20.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(244, 32, 27, 300.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(245, 32, 21, 20.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(246, 33, 22, 300.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(247, 33, 21, 20.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(248, 34, 17, 250.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(249, 34, 19, 10.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(250, 35, 28, 250.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(251, 35, 20, 50.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(252, 36, 22, 300.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(253, 36, 17, 100.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(254, 37, 18, 200.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(255, 37, 26, 100.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(256, 38, 17, 300.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(257, 39, 20, 100.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(258, 40, 32, 200.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(259, 40, 24, 50.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(260, 41, 34, 200.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(261, 41, 21, 50.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07'),
(262, 44, 32, 300.00, 'g', '2026-04-21 22:15:07', '2026-04-21 22:15:07');

-- --------------------------------------------------------

--
-- Stand-in structure for view `recipe_with_cost`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `recipe_with_cost`;
CREATE TABLE IF NOT EXISTS `recipe_with_cost` (
`cost` decimal(24,8)
,`ingredient_ID` int
,`ingredient_name` varchar(100)
,`menu_ID` int
,`menu_name` varchar(100)
,`quantity_required` decimal(10,2)
,`recipe_ID` int
,`unit` varchar(20)
);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `reservation_ID` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `people` int DEFAULT NULL,
  `reservation_time` datetime DEFAULT NULL,
  `table_ID` int DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Đã đặt',
  `customer_ID` int DEFAULT NULL,
  PRIMARY KEY (`reservation_ID`),
  KEY `fk_reservation_customer` (`customer_ID`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`reservation_ID`, `phone`, `people`, `reservation_time`, `table_ID`, `status`, `customer_ID`) VALUES
(6, '0359898732', 10, '2026-04-19 22:33:00', 10, 'Đã đặt', 4);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `role_ID` int NOT NULL AUTO_INCREMENT,
  `role_name` enum('Admin','Bếp','Phục vụ','Thu ngân') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`role_ID`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `shift`
--

DROP TABLE IF EXISTS `shift`;
CREATE TABLE IF NOT EXISTS `shift` (
  `shift_ID` int NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`shift_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shift`
--

INSERT INTO `shift` (`shift_ID`, `shift_name`, `start_time`, `end_time`, `created_at`, `updated_at`) VALUES
(1, 'Ca sáng', '06:00:00', '14:00:00', '2026-04-18 12:48:50', '2026-04-18 12:48:50'),
(2, 'Ca chiều', '14:00:00', '22:00:00', '2026-04-18 12:48:50', '2026-04-18 12:48:50'),
(3, 'Ca tối', '22:00:00', '06:00:00', '2026-04-18 12:48:50', '2026-04-18 12:48:50');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
CREATE TABLE IF NOT EXISTS `supplier` (
  `supplier_ID` int NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_info` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`supplier_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `table`
--

DROP TABLE IF EXISTS `table`;
CREATE TABLE IF NOT EXISTS `table` (
  `table_ID` int NOT NULL AUTO_INCREMENT,
  `table_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `seats_number` int NOT NULL,
  `status` enum('Trống','Đang phục vụ','Đã đặt') COLLATE utf8mb4_general_ci DEFAULT 'Trống',
  `location` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `pos_x` int DEFAULT '0',
  `pos_y` int DEFAULT '0',
  `current_order_id` int DEFAULT NULL,
  `floor_ID` int DEFAULT NULL,
  PRIMARY KEY (`table_ID`),
  KEY `fk_floor` (`floor_ID`),
  KEY `idx_table_status_floor` (`status`,`floor_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `table`
--

INSERT INTO `table` (`table_ID`, `table_name`, `seats_number`, `status`, `location`, `created_at`, `updated_at`, `pos_x`, `pos_y`, `current_order_id`, `floor_ID`) VALUES
(2, 'A01', 4, 'Đang phục vụ', NULL, '2026-04-21 22:41:14', '2026-04-21 22:43:59', 14, 7, 94, 1),
(3, 'A01', 4, 'Trống', 'Gần cửa', '2026-04-21 22:42:34', '2026-04-21 22:43:41', 35, 359, NULL, 1),
(4, 'A02', 4, 'Trống', 'Gần cửa', '2026-04-21 22:42:34', '2026-04-21 22:43:49', 369, 380, NULL, 1),
(5, 'A03', 6, 'Đang phục vụ', 'Giữa phòng', '2026-04-21 22:42:34', '2026-04-21 22:46:46', 353, 19, 95, 1),
(6, 'A04', 6, 'Trống', 'Giữa phòng', '2026-04-21 22:42:34', '2026-04-21 22:43:47', 736, 407, NULL, 1),
(7, 'A05', 8, 'Trống', 'Góc', '2026-04-21 22:42:34', '2026-04-21 22:43:45', 756, 29, NULL, 1),
(8, 'B01', 4, 'Trống', 'Cửa sổ', '2026-04-21 22:42:34', '2026-04-21 22:42:54', 29, 38, NULL, 2),
(9, 'B02', 4, 'Trống', 'Cửa sổ', '2026-04-21 22:42:34', '2026-04-21 22:43:31', 55, 420, NULL, 2),
(10, 'B03', 6, 'Trống', 'Giữa phòng', '2026-04-21 22:42:34', '2026-04-21 22:43:34', 344, 237, NULL, 2),
(11, 'B04', 6, 'Trống', 'Giữa phòng', '2026-04-21 22:42:34', '2026-04-21 22:43:37', 769, 66, NULL, 2),
(12, 'B05', 10, 'Trống', 'Nhóm đông', '2026-04-21 22:42:34', '2026-04-21 22:43:35', 756, 387, NULL, 2),
(13, 'C01', 4, 'Trống', 'Yên tĩnh', '2026-04-21 22:42:34', '2026-04-21 22:43:23', 104, 84, NULL, 3),
(14, 'C02', 4, 'Trống', 'Yên tĩnh', '2026-04-21 22:42:34', '2026-04-21 22:43:25', 139, 403, NULL, 3),
(15, 'C03', 6, 'Trống', 'Gia đình', '2026-04-21 22:42:34', '2026-04-21 22:43:27', 751, 80, NULL, 3),
(16, 'C04', 8, 'Trống', 'Gia đình', '2026-04-21 22:42:34', '2026-04-21 22:43:29', 699, 345, NULL, 3),
(17, 'D01', 4, 'Trống', 'View đẹp', '2026-04-21 22:42:34', '2026-04-21 22:43:17', 127, 100, NULL, 4),
(18, 'D02', 6, 'Trống', 'View đẹp', '2026-04-21 22:42:34', '2026-04-21 22:43:21', 411, 320, NULL, 4),
(19, 'D03', 8, 'Trống', 'Nhóm', '2026-04-21 22:42:34', '2026-04-21 22:43:19', 688, 110, NULL, 4),
(20, 'VIP01', 10, 'Trống', 'Phòng riêng', '2026-04-21 22:42:34', '2026-04-21 22:43:07', 126, 244, NULL, 5),
(21, 'VIP02', 12, 'Trống', 'Phòng riêng', '2026-04-21 22:42:34', '2026-04-21 22:43:14', 408, 241, NULL, 5),
(22, 'VIP03', 15, 'Trống', 'Phòng riêng', '2026-04-21 22:42:34', '2026-04-21 22:43:11', 721, 236, NULL, 5);

-- --------------------------------------------------------

--
-- Table structure for table `user_login`
--

DROP TABLE IF EXISTS `user_login`;
CREATE TABLE IF NOT EXISTS `user_login` (
  `login_ID` int NOT NULL,
  `employee_ID` int DEFAULT NULL,
  `login_time` datetime DEFAULT NULL,
  `logout_time` datetime DEFAULT NULL,
  `token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`login_ID`),
  KEY `employee_ID` (`employee_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `recipe_with_cost`
--
DROP TABLE IF EXISTS `recipe_with_cost`;

DROP VIEW IF EXISTS `recipe_with_cost`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `recipe_with_cost`  AS SELECT `r`.`recipe_ID` AS `recipe_ID`, `r`.`menu_ID` AS `menu_ID`, `r`.`ingredient_ID` AS `ingredient_ID`, `r`.`quantity_required` AS `quantity_required`, `r`.`unit` AS `unit`, `i`.`ingredient_name` AS `ingredient_name`, `m`.`menu_name` AS `menu_name`, (case when (`r`.`unit` = 'kg') then (`r`.`quantity_required` * `i`.`price`) when (`r`.`unit` = 'g') then ((`r`.`quantity_required` / 1000) * `i`.`price`) when (`r`.`unit` = 'l') then (`r`.`quantity_required` * `i`.`price`) when (`r`.`unit` = 'ml') then ((`r`.`quantity_required` / 1000) * `i`.`price`) else (`r`.`quantity_required` * `i`.`price`) end) AS `cost` FROM ((`recipe` `r` join `ingredient` `i` on((`r`.`ingredient_ID` = `i`.`ingredient_ID`))) join `menu` `m` on((`r`.`menu_ID` = `m`.`menu_ID`))) ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `fk_order_customer` FOREIGN KEY (`customer_ID`) REFERENCES `customer` (`customer_ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_order_employee` FOREIGN KEY (`employee_ID`) REFERENCES `employee` (`employee_ID`);

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `fk_order_details_menu` FOREIGN KEY (`menu_ID`) REFERENCES `menu` (`menu_ID`),
  ADD CONSTRAINT `fk_order_details_order` FOREIGN KEY (`order_ID`) REFERENCES `order` (`order_ID`) ON DELETE CASCADE;

--
-- Constraints for table `recipe`
--
ALTER TABLE `recipe`
  ADD CONSTRAINT `fk_recipe_ingredient` FOREIGN KEY (`ingredient_ID`) REFERENCES `ingredient` (`ingredient_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_recipe_menu` FOREIGN KEY (`menu_ID`) REFERENCES `menu` (`menu_ID`) ON DELETE CASCADE;

--
-- Constraints for table `table`
--
ALTER TABLE `table`
  ADD CONSTRAINT `fk_table_floor` FOREIGN KEY (`floor_ID`) REFERENCES `floor` (`floor_ID`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
