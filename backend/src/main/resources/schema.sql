CREATE TABLE user_account(
   account_id INT GENERATED ALWAYS AS IDENTITY,
   account_name VARCHAR(20) NOT NULL,
   account_email VARCHAR(100) NOT NULL UNIQUE,
   account_password VARCHAR(60) NOT NULL,
   avatar_path VARCHAR(500) NOT NULL,
   role VARCHAR(50) NOT NULL,
   PRIMARY KEY(account_id)
);

CREATE TABLE conversation(
   conversation_id INT GENERATED ALWAYS AS IDENTITY,
   conversation_type VARCHAR(10) NOT NULL,
   creator_id INT,
   PRIMARY KEY(conversation_id),
   FOREIGN KEY(creator_id) REFERENCES user_account(account_id) ON DELETE SET NULL
);

CREATE TABLE participates(
   account_id INT,
   conversation_id INT,
   PRIMARY KEY(account_id, conversation_id),
   FOREIGN KEY(account_id) REFERENCES user_account(account_id) ON DELETE CASCADE,
   FOREIGN KEY(conversation_id) REFERENCES conversation(conversation_id) ON DELETE CASCADE
);

CREATE TABLE message(
   message_id INT GENERATED ALWAYS AS IDENTITY,
   message_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   message_content VARCHAR(2000) NOT NULL,
   conversation_id INT NOT NULL,
   account_id INT NOT NULL,
   PRIMARY KEY(message_id),
   FOREIGN KEY(conversation_id) REFERENCES conversation(conversation_id) ON DELETE CASCADE,
   FOREIGN KEY(account_id) REFERENCES user_account(account_id)
);