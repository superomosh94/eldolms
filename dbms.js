require("dotenv").config();
const mysql = require("mysql2/promise");

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    // Create DB
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await conn.query(`USE \`${process.env.DB_NAME}\``);

    // SQL schema + sample data
    const sql = `
    SET FOREIGN_KEY_CHECKS = 0;

    DROP TABLE IF EXISTS notifications;
    DROP TABLE IF EXISTS grades;
    DROP TABLE IF EXISTS submissions;
    DROP TABLE IF EXISTS assignments;
    DROP TABLE IF EXISTS enrollments;
    DROP TABLE IF EXISTS lessons;
    DROP TABLE IF EXISTS modules;
    DROP TABLE IF EXISTS courses;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS roles;

    CREATE TABLE roles (
      role_id INT AUTO_INCREMENT PRIMARY KEY,
      role_name VARCHAR(50) NOT NULL UNIQUE,
      role_level INT NOT NULL
    );

    CREATE TABLE users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role_id INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT
    );

    CREATE TABLE courses (
      course_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      code VARCHAR(50) NOT NULL UNIQUE,
      description TEXT,
      created_by INT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
    );

    CREATE TABLE modules (
      module_id INT AUTO_INCREMENT PRIMARY KEY,
      course_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      position INT NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
    );

    CREATE TABLE lessons (
      lesson_id INT AUTO_INCREMENT PRIMARY KEY,
      module_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      content TEXT,
      position INT NOT NULL,
      FOREIGN KEY (module_id) REFERENCES modules(module_id) ON DELETE CASCADE
    );

    CREATE TABLE enrollments (
      enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      course_id INT NOT NULL,
      role_in_course VARCHAR(50) DEFAULT 'student',
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, course_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
    );

    CREATE TABLE assignments (
      assignment_id INT AUTO_INCREMENT PRIMARY KEY,
      course_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      due_date DATETIME,
      max_score INT DEFAULT 100,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
    );

    CREATE TABLE submissions (
      submission_id INT AUTO_INCREMENT PRIMARY KEY,
      assignment_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      file_path VARCHAR(255),
      UNIQUE (assignment_id, user_id),
      FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE grades (
      grade_id INT AUTO_INCREMENT PRIMARY KEY,
      submission_id INT NOT NULL,
      grader_id INT,
      score INT NOT NULL,
      feedback TEXT,
      graded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE,
      FOREIGN KEY (grader_id) REFERENCES users(user_id) ON DELETE SET NULL
    );

    CREATE TABLE notifications (
      notification_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      body TEXT,
      is_read TINYINT(1) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    INSERT INTO roles (role_name, role_level) VALUES
      ('Super Admin', 1),
      ('Admin', 2),
      ('Instructor', 3),
      ('Teaching Assistant', 4),
      ('Student', 5),
      ('Guest', 6);

    INSERT INTO users (username, full_name, email, password_hash, role_id) VALUES
      ('super_mato', 'Mato Super', 'super@example.com', 'hash_super', 1),
      ('admin_anne', 'Anne Admin', 'anne.admin@example.com', 'hash_admin', 2),
      ('prof_john', 'John Instructor', 'john.instructor@example.com', 'hash_instructor', 3),
      ('ta_rita', 'Rita TA', 'rita.ta@example.com', 'hash_ta', 4),
      ('student_tom', 'Tom Student', 'tom.student@example.com', 'hash_student', 5),
      ('student_aisy', 'Aisy Student', 'aisy.student@example.com', 'hash_student2', 5),
      ('guest_sam', 'Sam Guest', 'sam.guest@example.com', 'hash_guest', 6);

    INSERT INTO courses (title, code, description, created_by) VALUES
      ('Capstone Project Fundamentals', 'CAP101', 'Project planning and DB design', 3),
      ('Advanced Web Systems', 'WEB201', 'Fullstack topics', 3);

    INSERT INTO modules (course_id, title, position) VALUES
      (1, 'Project Setup', 1),
      (1, 'Database Design', 2),
      (1, 'Seeding and Testing', 3),
      (2, 'Frontend', 1),
      (2, 'Backend', 2);

    INSERT INTO lessons (module_id, title, content, position) VALUES
      (1, 'Introduction', 'Overview', 1),
      (2, 'ERD Basics', 'ERD content', 1),
      (2, 'Normalization', '1NF 2NF 3NF', 2);

    INSERT INTO enrollments (user_id, course_id, role_in_course) VALUES
      (5, 1, 'student'),
      (6, 1, 'student'),
      (4, 1, 'ta'),
      (3, 1, 'instructor'),
      (2, 1, 'admin');

    INSERT INTO assignments (course_id, title, description, due_date) VALUES
      (1, 'DB Schema', 'Design DB and SQL', '2025-10-01 23:59:00'),
      (1, 'Seed Script', 'Provide seed data', '2025-10-05 23:59:00');

    INSERT INTO submissions (assignment_id, user_id, content, file_path) VALUES
      (1, 5, 'SQL file upload', '/uploads/tom_db.sql'),
      (1, 6, 'SQL file upload', '/uploads/aisy_db.sql');

    INSERT INTO grades (submission_id, grader_id, score, feedback) VALUES
      (1, 3, 85, 'Good structure'),
      (2, 3, 78, 'Fix some constraints');

    INSERT INTO notifications (user_id, title, body) VALUES
      (5, 'Assignment due', 'DB Schema due on 2025-10-01'),
      (6, 'Missing submission', 'You did not submit assignment 2');

    SET FOREIGN_KEY_CHECKS = 1;
    `;

    await conn.query(sql);

    console.log("✅ EldoLMS database created sucessfully   and seeded successfully");
    await conn.end();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
