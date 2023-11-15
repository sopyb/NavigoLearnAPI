DELETE FROM roadmaps WHERE data IS NULL OR miscData IS NULL OR JSON_VALID(data) = 0 OR JSON_VALID(miscData) = 0;

ALTER TABLE roadmaps MODIFY data JSON;
ALTER TABLE roadmaps MODIFY miscData JSON;