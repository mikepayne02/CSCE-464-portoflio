CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`target_url` text NOT NULL,
	`author_name` text NOT NULL,
	`email` text NOT NULL,
	`comment_text` text NOT NULL,
	`published_at` integer NOT NULL,
	`approved` integer DEFAULT true NOT NULL,
	`ip_address` text
);
--> statement-breakpoint
CREATE INDEX `target_url_idx` ON `comments` (`target_url`);--> statement-breakpoint
CREATE INDEX `approved_idx` ON `comments` (`approved`);--> statement-breakpoint
CREATE TABLE `views` (
	`path` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `path_index` ON `views` (`path`);