DELETE FROM roadmapProgress WHERE data IS NULL OR JSON_VALID(data) = 0;

ALTER TABLE roadmapProgress MODIFY data JSON;