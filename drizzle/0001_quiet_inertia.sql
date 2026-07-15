CREATE TABLE `game_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`difficulty` varchar(10) NOT NULL,
	`startTime` timestamp NOT NULL,
	`endTime` timestamp,
	`timeElapsed` int,
	`isCompleted` int NOT NULL DEFAULT 0,
	`isCorrect` int NOT NULL DEFAULT 0,
	`puzzleData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`gamesPlayed` int NOT NULL DEFAULT 0,
	`gamesCompleted` int NOT NULL DEFAULT 0,
	`bestTimeEasy` int,
	`bestTimeMedium` int,
	`bestTimeHard` int,
	`averageTime` int,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastPlayedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_stats_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_stats_userId_unique` UNIQUE(`userId`)
);
