CREATE TABLE chatterbox_users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(128) NOT NULL UNIQUE
    passhash VARCHAR NOT NULL
    userid VARCHAR NOT NULL UNIQUE
)

INSERT INTO chatterbox_users(username, passhash, userid) values($1, $2)
