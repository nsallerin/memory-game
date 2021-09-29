CREATE TABLE game (
  "id" uuid NOT NULL,
  "player" varchar(255),
  "time" smallint,
  "attempts" smallint,
  "is_won" boolean
)
