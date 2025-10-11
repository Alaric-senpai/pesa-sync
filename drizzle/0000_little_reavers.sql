CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`createdAt` integer DEFAULT 1760006911,
	`updatedAt` integer DEFAULT 1760006911
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_phone_unique` ON `users_table` (`phone`);--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`balance` integer DEFAULT 0,
	`currency` text DEFAULT 'KES',
	`created_at` integer DEFAULT 1760006911,
	`updated_at` integer DEFAULT 1760006911
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_phone_unique` ON `contacts` (`phone`);--> statement-breakpoint
CREATE TABLE `debts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contact_id` integer NOT NULL,
	`amount` real NOT NULL,
	`direction` text NOT NULL,
	`reason` text,
	`due_date` integer,
	`settled` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `evidence` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transaction_id` integer,
	`debt_id` integer,
	`message` text NOT NULL,
	`type` text DEFAULT 'message',
	`created_at` integer DEFAULT 1760006911,
	`updated_at` integer DEFAULT 1760006911
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`amount` real NOT NULL,
	`description` text,
	`message_key` text,
	`account_id` integer NOT NULL,
	`contact_id` integer,
	`created_at` integer DEFAULT 1760006911
);
