-- example entry
-- please use {number} - {name} as your format to keep migrations in an consistent order
-- Top comment explaining why this is needed
-- 'migrations' table to track executed DB migrations
create table if not exists migrations
(
  -- Each migration gets a unique ID
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  -- Timestamp of when the migration was executed
  createdAt timestamp default current_timestamp() not null,

  -- Name of the executed migration script
  filename varchar(255) not null
)