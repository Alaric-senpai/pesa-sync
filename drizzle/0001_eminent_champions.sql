PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`amount` real NOT NULL,
	`description` text,
	`message_key` text,
	`account_id` integer NOT NULL,
	`contact_id` integer,
	`createdAt` integer DEFAULT 1760006933,
	`updatedAt` integer DEFAULT 1760006933
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "type", "amount", "description", "message_key", "account_id", "contact_id", "createdAt", "updatedAt") SELECT "id", "type", "amount", "description", "message_key", "account_id", "contact_id", "createdAt", "updatedAt" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`createdAt` integer DEFAULT 1760006933,
	`updatedAt` integer DEFAULT 1760006933
);
--> statement-breakpoint
INSERT INTO `__new_users_table`("id", "username", "name", "age", "email", "phone", "createdAt", "updatedAt") SELECT "id", "username", "name", "age", "email", "phone", "createdAt", "updatedAt" FROM `users_table`;--> statement-breakpoint
DROP TABLE `users_table`;--> statement-breakpoint
ALTER TABLE `__new_users_table` RENAME TO `users_table`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_phone_unique` ON `users_table` (`phone`);--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`balance` integer DEFAULT 0,
	`currency` text DEFAULT 'KES',
	`created_at` integer DEFAULT 1760006933,
	`updated_at` integer DEFAULT 1760006933
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "name", "type", "balance", "currency", "created_at", "updated_at") SELECT "id", "name", "type", "balance", "currency", "created_at", "updated_at" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
CREATE TABLE `__new_evidence` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transaction_id` integer,
	`debt_id` integer,
	`message` text NOT NULL,
	`type` text DEFAULT 'message',
	`created_at` integer DEFAULT 1760006933,
	`updated_at` integer DEFAULT 1760006933
);
--> statement-breakpoint
INSERT INTO `__new_evidence`("id", "transaction_id", "debt_id", "message", "type", "created_at", "updated_at") SELECT "id", "transaction_id", "debt_id", "message", "type", "created_at", "updated_at" FROM `evidence`;--> statement-breakpoint
DROP TABLE `evidence`;--> statement-breakpoint
ALTER TABLE `__new_evidence` RENAME TO `evidence`;--> statement-breakpoint
ALTER TABLE `contacts` ADD `createdAt` integer DEFAULT 1760006933;--> statement-breakpoint
ALTER TABLE `contacts` ADD `updatedAt` integer DEFAULT 1760006933;--> statement-breakpoint
ALTER TABLE `debts` ADD `createdAt` integer DEFAULT 1760006933;--> statement-breakpoint
ALTER TABLE `debts` ADD `updatedAt` integer DEFAULT 1760006933;