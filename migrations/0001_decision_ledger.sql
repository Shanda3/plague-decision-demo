CREATE TABLE `decision_ledger` (
	`id` text PRIMARY KEY NOT NULL,
	`month` text NOT NULL,
	`preset` text NOT NULL,
	`reserved_cents` integer NOT NULL,
	`status` text NOT NULL,
	`model` text NOT NULL,
	`topic` text,
	`input_tokens` integer
);
