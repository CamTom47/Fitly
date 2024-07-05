\echo 'Delete and recreate fitly db?'
\prompt 'Return for yes or control -C to cancel > ' foo

DROP DATABASE fitly;
CREATE DATABASE fitly;

\connect fitly

\i fitly-schema.sql

\echo 'Delete and recreate fitly_test db?'
\prompt 'Return for yes or control -C to cancel > ' foo

DROP DATABASE fitly_test;
CREATE DATABASE fitly_test;

\connect fitly_test

\i jobly-schema.sql