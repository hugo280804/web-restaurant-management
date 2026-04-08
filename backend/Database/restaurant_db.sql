-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 08, 2026 at 11:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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

CREATE TABLE `audit_log` (
  `audit_ID` int(11) NOT NULL,
  `employee_ID` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `target` varchar(100) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_ID` int(11) NOT NULL,
  `category_name` varchar(50) DEFAULT NULL,
  `category_type` enum('Đồ ăn','Đồ uống','Khác') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_ID`, `category_name`, `category_type`, `created_at`, `updated_at`) VALUES
(1, 'Món chính', NULL, '2026-04-02 23:58:51', '2026-04-04 00:02:44'),
(5, 'Nước', NULL, '2026-04-03 23:54:54', '2026-04-03 23:54:54');

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `coupon_ID` int(11) NOT NULL,
  `coupon_code` varchar(50) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_ID` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_ID`, `name`, `phone`, `email`, `created_at`, `updated_at`) VALUES
(1, 'Nguyen Van A', '0901234567', 'a.nguyen@example.com', '2026-04-06 00:16:18', '2026-04-06 00:16:18'),
(2, 'Tran Thi B', '0912345678', 'b.tran@example.com', '2026-04-06 00:16:18', '2026-04-06 00:16:18'),
(3, 'Le Van C', '0987654321', 'c.le@example.com', '2026-04-06 00:16:18', '2026-04-06 00:16:18');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `employee_ID` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `role` enum('Admin','Phục vụ','Bếp','Thu ngân') NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `contact` varchar(50) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`employee_ID`, `name`, `role`, `username`, `password`, `contact`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Nguyen Van A', 'Admin', 'nguyenvana', 'hashed_password1', '0901234567', 'Active', '2026-04-06 00:16:53', '2026-04-06 00:16:53'),
(2, 'Tran Thi B', '', 'tranthib', 'hashed_password2', '0912345678', 'Active', '2026-04-06 00:16:53', '2026-04-06 00:16:53'),
(3, 'Le Van C', '', 'levanc', 'hashed_password3', '0987654321', 'Inactive', '2026-04-06 00:16:53', '2026-04-06 00:16:53');

-- --------------------------------------------------------

--
-- Table structure for table `employee_shift`
--

CREATE TABLE `employee_shift` (
  `employee_shift_ID` int(11) NOT NULL,
  `employee_ID` int(11) DEFAULT NULL,
  `shift_ID` int(11) DEFAULT NULL,
  `shift_date` date DEFAULT NULL,
  `check_in_time` datetime DEFAULT NULL,
  `check_out_time` datetime DEFAULT NULL,
  `hours_worked` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `floor`
--

CREATE TABLE `floor` (
  `floor_ID` int(11) NOT NULL,
  `floor_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Table structure for table `ingredient`
--

CREATE TABLE `ingredient` (
  `ingredient_ID` int(11) NOT NULL,
  `ingredient_name` varchar(100) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `import_date` datetime NOT NULL DEFAULT current_timestamp(),
  `expiry_date` datetime DEFAULT NULL,
  `entered_by` int(11) DEFAULT NULL,
  `category_ID` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT 0.00,
  `price` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingredient`
--

INSERT INTO `ingredient` (`ingredient_ID`, `ingredient_name`, `unit`, `created_at`, `updated_at`, `import_date`, `expiry_date`, `entered_by`, `category_ID`, `quantity`, `price`) VALUES
(3, 'Gà', 'kg', '2026-04-04 16:19:40', '2026-04-04 23:53:21', '2026-03-31 00:00:00', '2026-04-02 00:00:00', NULL, 5, 1.00, 128000.00),
(4, 'Bò', 'kg', '2026-04-04 16:31:22', '2026-04-05 00:00:08', '2026-04-01 00:00:00', '2026-04-03 00:00:00', NULL, 5, 1.00, 220000.00),
(5, 'Phở', 'kg', '2026-04-04 16:31:27', '2026-04-04 21:45:05', '2026-04-03 00:00:00', '2026-04-04 00:00:00', NULL, 4, 1.00, 120000.00),
(6, 'Hành', 'g', '2026-04-04 16:31:41', '2026-04-05 00:00:17', '2026-04-02 00:00:00', '2026-04-23 00:00:00', NULL, 2, 1.00, 220000.00),
(13, 'Mực', 'kg', '2026-04-04 21:03:36', '2026-04-05 00:00:28', '2026-03-31 00:00:00', '2026-04-03 00:00:00', NULL, 3, 1.00, 100000.00),
(14, 'Tôm', 'kg', '2026-04-04 21:40:54', '2026-04-05 00:00:39', '2026-04-03 00:00:00', '2026-04-04 00:00:00', NULL, 3, 1.00, 120000.00),
(15, 'Sà lác', 'kg', '2026-04-04 23:20:46', '2026-04-04 23:20:46', '2026-04-04 00:00:00', '2026-04-05 00:00:00', NULL, 1, 1.00, 30000.00),
(16, 'Nước tương', 'l', '2026-04-05 20:57:01', '2026-04-05 21:30:06', '2026-04-04 00:00:00', '2026-04-17 00:00:00', NULL, 2, 1.00, 15000.00);

-- --------------------------------------------------------

--
-- Table structure for table `ingredient_category`
--

CREATE TABLE `ingredient_category` (
  `category_ID` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingredient_category`
--

INSERT INTO `ingredient_category` (`category_ID`, `category_name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Rau', NULL, '2026-04-04 20:39:13', '2026-04-04 20:39:13'),
(2, 'Gia vị', NULL, '2026-04-04 20:55:09', '2026-04-04 20:55:09'),
(3, 'Hải sản', NULL, '2026-04-04 21:03:15', '2026-04-04 21:03:15'),
(4, 'Bún', NULL, '2026-04-04 21:44:56', '2026-04-04 21:44:56'),
(5, 'Thịt', NULL, '2026-04-04 21:45:33', '2026-04-04 21:45:33'),
(6, 'Củ', NULL, '2026-04-05 01:00:18', '2026-04-05 01:00:18');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `inventory_ID` int(11) NOT NULL,
  `ingredient_ID` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `min_quantity_alert` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_transaction`
--

CREATE TABLE `inventory_transaction` (
  `transaction_ID` int(11) NOT NULL,
  `ingredient_ID` int(11) DEFAULT NULL,
  `type` enum('Nhập','Xuất') DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `employee_ID` int(11) DEFAULT NULL,
  `supplier_ID` int(11) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `menu_ID` int(11) NOT NULL,
  `menu_name` varchar(100) DEFAULT NULL,
  `category_ID` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('Bật','Tắt') DEFAULT 'Bật',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `menu_code` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`menu_ID`, `menu_name`, `category_ID`, `price`, `image_url`, `status`, `created_at`, `updated_at`, `menu_code`) VALUES
(3, 'Gà', 1, 150000.00, '/uploads/1775150333473-43323876.jpg', 'Bật', '2026-04-03 00:18:53', '2026-04-06 23:45:52', 'G1'),
(7, 'Nước ngọt', 5, 10000.00, '/uploads/1775235320055-945350720.jpg', 'Tắt', '2026-04-03 23:55:20', '2026-04-06 23:45:32', 'N1'),
(8, 'Coca', 5, 10000.00, '/uploads/1775235339189-33828624.jpg', 'Tắt', '2026-04-03 23:55:39', '2026-04-06 23:45:35', 'N2'),
(9, 'Gà chiên', 1, 120000.00, '/uploads/1775235798743-334248028.webp', 'Bật', '2026-04-04 00:03:18', '2026-04-04 00:03:18', 'M1'),
(10, 'Phở', 1, 150000.00, NULL, 'Tắt', '2026-04-04 16:31:07', '2026-04-06 00:51:45', 'M2');

--
-- Triggers `menu`
--
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

CREATE TABLE `notification` (
  `notification_ID` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `recipient_role` enum('Admin','Bếp','Phục vụ','Thu ngân','All') DEFAULT 'All',
  `status` enum('Chưa gửi','Đã gửi') DEFAULT 'Chưa gửi',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `order_ID` int(11) NOT NULL,
  `table_ID` int(11) DEFAULT NULL,
  `employee_ID` int(11) DEFAULT NULL,
  `customer_ID` int(11) DEFAULT NULL,
  `status` enum('Chờ xác nhận','Đang nấu','Hoàn thành','Đã thanh toán') DEFAULT 'Chờ xác nhận',
  `total_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `payment_method` enum('Tiền mặt','Chuyển khoản','Ví điện tử','Hóa đơn') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`order_ID`, `table_ID`, `employee_ID`, `customer_ID`, `status`, `total_amount`, `discount_amount`, `payment_method`, `created_at`, `updated_at`) VALUES
(20, 4, 1, NULL, 'Chờ xác nhận', 140000.00, 0.00, NULL, '2026-04-06 23:37:46', '2026-04-06 23:37:46'),
(21, 9, 1, NULL, 'Chờ xác nhận', 140000.00, 0.00, NULL, '2026-04-06 23:43:01', '2026-04-06 23:43:01');

-- --------------------------------------------------------

--
-- Table structure for table `order_coupon`
--

CREATE TABLE `order_coupon` (
  `order_coupon_ID` int(11) NOT NULL,
  `order_ID` int(11) DEFAULT NULL,
  `coupon_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `order_detail_ID` int(11) NOT NULL,
  `order_ID` int(11) DEFAULT NULL,
  `menu_ID` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `status` enum('Chờ nấu','Đang chế biến','Hoàn thành') DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `pendingQty` int(11) DEFAULT 0,
  `cookingQty` int(11) DEFAULT 0,
  `doneQty` int(11) DEFAULT 0,
  `note_from_waiter` varchar(255) DEFAULT '',
  `note_from_kitchen` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`order_detail_ID`, `order_ID`, `menu_ID`, `quantity`, `note`, `status`, `price`, `pendingQty`, `cookingQty`, `doneQty`, `note_from_waiter`, `note_from_kitchen`) VALUES
(50, 20, 7, 1, '', 'Chờ nấu', 10000.00, 1, 0, 0, '', ''),
(51, 20, 8, 1, '', 'Chờ nấu', 10000.00, 1, 0, 0, '', ''),
(52, 20, 9, 1, '', 'Chờ nấu', 120000.00, 1, 0, 0, '', ''),
(53, 21, 9, 1, '', 'Chờ nấu', 120000.00, 1, 0, 0, '', ''),
(54, 21, 8, 1, '', 'Chờ nấu', 10000.00, 1, 0, 0, '', ''),
(55, 21, 7, 1, '', 'Chờ nấu', 10000.00, 1, 0, 0, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `promotion`
--

CREATE TABLE `promotion` (
  `promotion_ID` int(11) NOT NULL,
  `promotion_name` varchar(100) DEFAULT NULL,
  `menu_ID` int(11) DEFAULT NULL,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recipe`
--

CREATE TABLE `recipe` (
  `recipe_ID` int(11) NOT NULL,
  `menu_ID` int(11) DEFAULT NULL,
  `ingredient_ID` int(11) DEFAULT NULL,
  `quantity_required` decimal(10,2) DEFAULT NULL,
  `unit` varchar(20) DEFAULT 'g',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipe`
--

INSERT INTO `recipe` (`recipe_ID`, `menu_ID`, `ingredient_ID`, `quantity_required`, `unit`, `created_at`, `updated_at`) VALUES
(206, 3, 3, 100.00, 'g', '2026-04-05 21:50:19', '2026-04-05 21:50:19'),
(207, 3, 6, 100.00, 'g', '2026-04-05 21:50:19', '2026-04-05 21:50:19'),
(208, 9, 3, 250.00, 'g', '2026-04-05 22:08:34', '2026-04-05 22:08:34');

-- --------------------------------------------------------

--
-- Stand-in structure for view `recipe_with_cost`
-- (See below for the actual view)
--
CREATE TABLE `recipe_with_cost` (
`recipe_ID` int(11)
,`menu_ID` int(11)
,`ingredient_ID` int(11)
,`quantity_required` decimal(10,2)
,`unit` varchar(20)
,`ingredient_name` varchar(100)
,`menu_name` varchar(100)
,`cost` decimal(24,8)
);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `role_ID` int(11) NOT NULL,
  `role_name` enum('Admin','Bếp','Phục vụ','Thu ngân') DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shift`
--

CREATE TABLE `shift` (
  `shift_ID` int(11) NOT NULL,
  `shift_name` varchar(50) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplier_ID` int(11) NOT NULL,
  `supplier_name` varchar(100) DEFAULT NULL,
  `contact_info` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `table`
--

CREATE TABLE `table` (
  `table_ID` int(11) NOT NULL,
  `table_name` varchar(50) NOT NULL,
  `seats_number` int(11) NOT NULL,
  `status` enum('Trống','Đang phục vụ','Đã đặt') DEFAULT 'Trống',
  `location` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `pos_x` int(11) DEFAULT 0,
  `pos_y` int(11) DEFAULT 0,
  `current_order_id` int(11) DEFAULT NULL,
  `floor_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `table`
--

INSERT INTO `table` (`table_ID`, `table_name`, `seats_number`, `status`, `location`, `created_at`, `updated_at`, `pos_x`, `pos_y`, `current_order_id`, `floor_ID`) VALUES
(2, 'A02', 3, 'Trống', NULL, '2026-04-03 22:36:54', '2026-04-03 22:37:53', 429, 219, NULL, NULL),
(4, 'A001', 3, 'Trống', NULL, '2026-04-03 23:22:32', '2026-04-04 14:54:04', 9, 6, NULL, 1),
(5, 'B01', 3, 'Trống', NULL, '2026-04-03 23:23:40', '2026-04-04 15:09:04', 26, 12, NULL, 2),
(6, 'C01', 1, 'Trống', NULL, '2026-04-03 23:24:07', '2026-04-04 15:09:09', 14, 11, NULL, 3),
(7, 'C02', 4, 'Trống', NULL, '2026-04-03 23:26:51', '2026-04-04 15:16:59', 126, 15, NULL, 3),
(8, 'D01', 3, 'Trống', NULL, '2026-04-04 00:27:15', '2026-04-04 15:09:16', 16, 11, NULL, 4),
(9, 'A02', 5, 'Trống', NULL, '2026-04-04 15:08:17', '2026-04-04 15:16:47', 122, 8, NULL, 1),
(10, 'VIP1', 10, 'Trống', NULL, '2026-04-04 15:08:40', '2026-04-04 20:47:09', 410, 234, NULL, 5);

-- --------------------------------------------------------

--
-- Table structure for table `user_login`
--

CREATE TABLE `user_login` (
  `login_ID` int(11) NOT NULL,
  `employee_ID` int(11) DEFAULT NULL,
  `login_time` datetime DEFAULT NULL,
  `logout_time` datetime DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `recipe_with_cost`
--
DROP TABLE IF EXISTS `recipe_with_cost`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `recipe_with_cost`  AS SELECT `r`.`recipe_ID` AS `recipe_ID`, `r`.`menu_ID` AS `menu_ID`, `r`.`ingredient_ID` AS `ingredient_ID`, `r`.`quantity_required` AS `quantity_required`, `r`.`unit` AS `unit`, `i`.`ingredient_name` AS `ingredient_name`, `m`.`menu_name` AS `menu_name`, CASE WHEN `r`.`unit` = 'kg' THEN `r`.`quantity_required`* `i`.`price` WHEN `r`.`unit` = 'g' THEN `r`.`quantity_required`/ 1000 * `i`.`price` WHEN `r`.`unit` = 'l' THEN `r`.`quantity_required`* `i`.`price` WHEN `r`.`unit` = 'ml' THEN `r`.`quantity_required`/ 1000 * `i`.`price` ELSE `r`.`quantity_required`* `i`.`price` END AS `cost` FROM ((`recipe` `r` join `ingredient` `i` on(`r`.`ingredient_ID` = `i`.`ingredient_ID`)) join `menu` `m` on(`r`.`menu_ID` = `m`.`menu_ID`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`audit_ID`),
  ADD KEY `employee_ID` (`employee_ID`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_ID`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`coupon_ID`),
  ADD UNIQUE KEY `coupon_code` (`coupon_code`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_ID`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`employee_ID`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `employee_shift`
--
ALTER TABLE `employee_shift`
  ADD PRIMARY KEY (`employee_shift_ID`),
  ADD KEY `employee_ID` (`employee_ID`),
  ADD KEY `shift_ID` (`shift_ID`);

--
-- Indexes for table `floor`
--
ALTER TABLE `floor`
  ADD PRIMARY KEY (`floor_ID`),
  ADD UNIQUE KEY `floor_name` (`floor_name`);

--
-- Indexes for table `ingredient`
--
ALTER TABLE `ingredient`
  ADD PRIMARY KEY (`ingredient_ID`),
  ADD KEY `fk_ingredient_category` (`category_ID`);

--
-- Indexes for table `ingredient_category`
--
ALTER TABLE `ingredient_category`
  ADD PRIMARY KEY (`category_ID`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventory_ID`),
  ADD KEY `ingredient_ID` (`ingredient_ID`);

--
-- Indexes for table `inventory_transaction`
--
ALTER TABLE `inventory_transaction`
  ADD PRIMARY KEY (`transaction_ID`),
  ADD KEY `ingredient_ID` (`ingredient_ID`),
  ADD KEY `employee_ID` (`employee_ID`),
  ADD KEY `supplier_ID` (`supplier_ID`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`menu_ID`),
  ADD UNIQUE KEY `menu_code` (`menu_code`),
  ADD KEY `category_ID` (`category_ID`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`notification_ID`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`order_ID`),
  ADD KEY `table_ID` (`table_ID`),
  ADD KEY `employee_ID` (`employee_ID`),
  ADD KEY `customer_ID` (`customer_ID`);

--
-- Indexes for table `order_coupon`
--
ALTER TABLE `order_coupon`
  ADD PRIMARY KEY (`order_coupon_ID`),
  ADD KEY `order_ID` (`order_ID`),
  ADD KEY `coupon_ID` (`coupon_ID`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`order_detail_ID`),
  ADD KEY `order_ID` (`order_ID`),
  ADD KEY `menu_ID` (`menu_ID`);

--
-- Indexes for table `promotion`
--
ALTER TABLE `promotion`
  ADD PRIMARY KEY (`promotion_ID`),
  ADD KEY `menu_ID` (`menu_ID`);

--
-- Indexes for table `recipe`
--
ALTER TABLE `recipe`
  ADD PRIMARY KEY (`recipe_ID`),
  ADD KEY `menu_ID` (`menu_ID`),
  ADD KEY `ingredient_ID` (`ingredient_ID`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_ID`);

--
-- Indexes for table `shift`
--
ALTER TABLE `shift`
  ADD PRIMARY KEY (`shift_ID`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplier_ID`);

--
-- Indexes for table `table`
--
ALTER TABLE `table`
  ADD PRIMARY KEY (`table_ID`),
  ADD KEY `fk_floor` (`floor_ID`);

--
-- Indexes for table `user_login`
--
ALTER TABLE `user_login`
  ADD PRIMARY KEY (`login_ID`),
  ADD KEY `employee_ID` (`employee_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `audit_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `coupon`
--
ALTER TABLE `coupon`
  MODIFY `coupon_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `employee_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employee_shift`
--
ALTER TABLE `employee_shift`
  MODIFY `employee_shift_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `floor`
--
ALTER TABLE `floor`
  MODIFY `floor_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ingredient`
--
ALTER TABLE `ingredient`
  MODIFY `ingredient_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `ingredient_category`
--
ALTER TABLE `ingredient_category`
  MODIFY `category_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventory_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_transaction`
--
ALTER TABLE `inventory_transaction`
  MODIFY `transaction_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `menu_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `notification_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `order_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `order_coupon`
--
ALTER TABLE `order_coupon`
  MODIFY `order_coupon_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `order_detail_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `promotion`
--
ALTER TABLE `promotion`
  MODIFY `promotion_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recipe`
--
ALTER TABLE `recipe`
  MODIFY `recipe_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `role_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shift`
--
ALTER TABLE `shift`
  MODIFY `shift_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplier_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `table`
--
ALTER TABLE `table`
  MODIFY `table_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_login`
--
ALTER TABLE `user_login`
  MODIFY `login_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`employee_ID`) REFERENCES `employee` (`employee_ID`);

--
-- Constraints for table `employee_shift`
--
ALTER TABLE `employee_shift`
  ADD CONSTRAINT `employee_shift_ibfk_1` FOREIGN KEY (`employee_ID`) REFERENCES `employee` (`employee_ID`),
  ADD CONSTRAINT `employee_shift_ibfk_2` FOREIGN KEY (`shift_ID`) REFERENCES `shift` (`shift_ID`);

--
-- Constraints for table `ingredient`
--
ALTER TABLE `ingredient`
  ADD CONSTRAINT `fk_ingredient_category` FOREIGN KEY (`category_ID`) REFERENCES `ingredient_category` (`category_ID`) ON DELETE SET NULL;

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`ingredient_ID`) REFERENCES `ingredient` (`ingredient_ID`);

--
-- Constraints for table `inventory_transaction`
--
ALTER TABLE `inventory_transaction`
  ADD CONSTRAINT `inventory_transaction_ibfk_1` FOREIGN KEY (`ingredient_ID`) REFERENCES `ingredient` (`ingredient_ID`),
  ADD CONSTRAINT `inventory_transaction_ibfk_2` FOREIGN KEY (`employee_ID`) REFERENCES `employee` (`employee_ID`),
  ADD CONSTRAINT `inventory_transaction_ibfk_3` FOREIGN KEY (`supplier_ID`) REFERENCES `supplier` (`supplier_ID`);

--
-- Constraints for table `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`category_ID`) REFERENCES `category` (`category_ID`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`table_ID`) REFERENCES `table` (`table_ID`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`employee_ID`) REFERENCES `employee` (`employee_ID`),
  ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`customer_ID`) REFERENCES `customer` (`customer_ID`);

--
-- Constraints for table `order_coupon`
--
ALTER TABLE `order_coupon`
  ADD CONSTRAINT `order_coupon_ibfk_1` FOREIGN KEY (`order_ID`) REFERENCES `order` (`order_ID`),
  ADD CONSTRAINT `order_coupon_ibfk_2` FOREIGN KEY (`coupon_ID`) REFERENCES `coupon` (`coupon_ID`);

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_ID`) REFERENCES `order` (`order_ID`),
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`menu_ID`) REFERENCES `menu` (`menu_ID`);

--
-- Constraints for table `promotion`
--
ALTER TABLE `promotion`
  ADD CONSTRAINT `promotion_ibfk_1` FOREIGN KEY (`menu_ID`) REFERENCES `menu` (`menu_ID`);

--
-- Constraints for table `recipe`
--
ALTER TABLE `recipe`
  ADD CONSTRAINT `recipe_ibfk_1` FOREIGN KEY (`menu_ID`) REFERENCES `menu` (`menu_ID`),
  ADD CONSTRAINT `recipe_ibfk_2` FOREIGN KEY (`ingredient_ID`) REFERENCES `ingredient` (`ingredient_ID`);

--
-- Constraints for table `table`
--
ALTER TABLE `table`
  ADD CONSTRAINT `fk_floor` FOREIGN KEY (`floor_ID`) REFERENCES `floor` (`floor_ID`) ON DELETE SET NULL;

--
-- Constraints for table `user_login`
--
ALTER TABLE `user_login`
  ADD CONSTRAINT `user_login_ibfk_1` FOREIGN KEY (`employee_ID`) REFERENCES `employee` (`employee_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
