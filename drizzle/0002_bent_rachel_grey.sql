CREATE TABLE `daily_challenge_completions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`challengeDate` varchar(10) NOT NULL,
	`timeElapsed` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_challenge_completions_id` PRIMARY KEY(`id`)
);
