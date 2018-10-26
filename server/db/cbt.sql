CREATE TABLE IF NOT EXISTS users (
   id  SERIAL PRIMARY KEY,
   firstname  VARCHAR(255) NOT NULL,
   lastname  VARCHAR(255) NOT NULL,
   email  VARCHAR(255) NOT NULL UNIQUE,
   telephone  VARCHAR(255) NOT NULL UNIQUE,
   password  VARCHAR(255) NOT NULL,
   image_url  VARCHAR(225) NOT NULL,
   created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
   id  SERIAL PRIMARY KEY,
   firstname  VARCHAR(255) NOT NULL,
   lastname  VARCHAR(255) NOT NULL,
   email  VARCHAR(255) NOT NULL UNIQUE,
   telephone  VARCHAR(255) NOT NULL UNIQUE,
   admin_password  VARCHAR(255) NOT NULL,
   image_url  VARCHAR(225) NOT NULL,
   admin_status INT NOT NULL,
   created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
   id  SERIAL PRIMARY KEY,
   course_title  VARCHAR(255) NOT NULL,
   course_availability INT NOT NULL,
   created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_questions (
   id  SERIAL PRIMARY KEY,
   admin_id  INT NOT NULL,
   course_id  INT NOT NULL,
   questions  VARCHAR(255) NOT NULL UNIQUE,
   created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        --Relationship-- 
  FOREIGN KEY( admin_id ) REFERENCES admin_users( id ) ON DELETE CASCADE,
  FOREIGN KEY( course_id ) REFERENCES courses( id ) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_answers (
   id  SERIAL PRIMARY KEY,
   question_id  INT NOT NULL,
   option_one  VARCHAR(255),
   option_two  VARCHAR(255),
   option_three  VARCHAR(255),
   option_four  VARCHAR(255),
   correct_answer  VARCHAR(255) NOT NULL,
   created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
   updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        --Relationship-- 
  FOREIGN KEY( question_id ) REFERENCES test_questions( id ) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_results (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  test_score INT NOT NULL,
          --Relationship-- 
  FOREIGN KEY( user_id ) REFERENCES users( id ) ON DELETE CASCADE,
  FOREIGN KEY( course_id ) REFERENCES courses( id ) ON DELETE CASCADE
);