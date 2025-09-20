require("dotenv").config();
const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.DB_NAME || "eldolms"
    });

    console.log("✅ Connected to MongoDB");

    // Define schemas
    const roleSchema = new mongoose.Schema({
      role_name: { type: String, unique: true },
      role_level: Number
    });

    const userSchema = new mongoose.Schema({
      username: { type: String, unique: true },
      full_name: String,
      email: { type: String, unique: true },
      password_hash: String,
      role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
      created_at: { type: Date, default: Date.now }
    });

    const courseSchema = new mongoose.Schema({
      title: String,
      code: { type: String, unique: true },
      description: String,
      created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      created_at: { type: Date, default: Date.now }
    });

    const moduleSchema = new mongoose.Schema({
      course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      title: String,
      position: Number
    });

    const lessonSchema = new mongoose.Schema({
      module_id: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
      title: String,
      content: String,
      position: Number
    });

    const enrollmentSchema = new mongoose.Schema({
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      role_in_course: { type: String, default: "student" },
      enrolled_at: { type: Date, default: Date.now }
    });

    const assignmentSchema = new mongoose.Schema({
      course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      title: String,
      description: String,
      due_date: Date,
      max_score: { type: Number, default: 100 },
      created_at: { type: Date, default: Date.now }
    });

    const submissionSchema = new mongoose.Schema({
      assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: String,
      submitted_at: { type: Date, default: Date.now },
      file_path: String
    });

    const gradeSchema = new mongoose.Schema({
      submission_id: { type: mongoose.Schema.Types.ObjectId, ref: "Submission" },
      grader_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: Number,
      feedback: String,
      graded_at: { type: Date, default: Date.now }
    });

    const notificationSchema = new mongoose.Schema({
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      title: String,
      body: String,
      is_read: { type: Boolean, default: false },
      created_at: { type: Date, default: Date.now }
    });

    // Create models
    const Role = mongoose.model("Role", roleSchema);
    const User = mongoose.model("User", userSchema);
    const Course = mongoose.model("Course", courseSchema);
    const Module = mongoose.model("Module", moduleSchema);
    const Lesson = mongoose.model("Lesson", lessonSchema);
    const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
    const Assignment = mongoose.model("Assignment", assignmentSchema);
    const Submission = mongoose.model("Submission", submissionSchema);
    const Grade = mongoose.model("Grade", gradeSchema);
    const Notification = mongoose.model("Notification", notificationSchema);

    // Clear old data
    await Promise.all([
      Role.deleteMany({}),
      User.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Lesson.deleteMany({}),
      Enrollment.deleteMany({}),
      Assignment.deleteMany({}),
      Submission.deleteMany({}),
      Grade.deleteMany({}),
      Notification.deleteMany({})
    ]);

    // Insert roles
    const roles = await Role.insertMany([
      { role_name: "Super Admin", role_level: 1 },
      { role_name: "Admin", role_level: 2 },
      { role_name: "Instructor", role_level: 3 },
      { role_name: "Teaching Assistant", role_level: 4 },
      { role_name: "Student", role_level: 5 },
      { role_name: "Guest", role_level: 6 }
    ]);

    // Insert users
    const users = await User.insertMany([
      { username: "super_mato", full_name: "Mato Super", email: "super@example.com", password_hash: "hash_super", role_id: roles[0]._id },
      { username: "admin_anne", full_name: "Anne Admin", email: "anne.admin@example.com", password_hash: "hash_admin", role_id: roles[1]._id },
      { username: "prof_john", full_name: "John Instructor", email: "john.instructor@example.com", password_hash: "hash_instructor", role_id: roles[2]._id },
      { username: "ta_rita", full_name: "Rita TA", email: "rita.ta@example.com", password_hash: "hash_ta", role_id: roles[3]._id },
      { username: "student_tom", full_name: "Tom Student", email: "tom.student@example.com", password_hash: "hash_student", role_id: roles[4]._id },
      { username: "student_aisy", full_name: "Aisy Student", email: "aisy.student@example.com", password_hash: "hash_student2", role_id: roles[4]._id },
      { username: "guest_sam", full_name: "Sam Guest", email: "sam.guest@example.com", password_hash: "hash_guest", role_id: roles[5]._id }
    ]);

    // Insert courses
    const courses = await Course.insertMany([
      { title: "Capstone Project Fundamentals", code: "CAP101", description: "Project planning and DB design", created_by: users[2]._id },
      { title: "Advanced Web Systems", code: "WEB201", description: "Fullstack topics", created_by: users[2]._id }
    ]);

    // Insert modules
    const modules = await Module.insertMany([
      { course_id: courses[0]._id, title: "Project Setup", position: 1 },
      { course_id: courses[0]._id, title: "Database Design", position: 2 },
      { course_id: courses[0]._id, title: "Seeding and Testing", position: 3 },
      { course_id: courses[1]._id, title: "Frontend", position: 1 },
      { course_id: courses[1]._id, title: "Backend", position: 2 }
    ]);

    // Insert lessons
    await Lesson.insertMany([
      { module_id: modules[0]._id, title: "Introduction", content: "Overview", position: 1 },
      { module_id: modules[1]._id, title: "ERD Basics", content: "ERD content", position: 1 },
      { module_id: modules[1]._id, title: "Normalization", content: "1NF 2NF 3NF", position: 2 }
    ]);

    // Enrollments
    await Enrollment.insertMany([
      { user_id: users[4]._id, course_id: courses[0]._id, role_in_course: "student" },
      { user_id: users[5]._id, course_id: courses[0]._id, role_in_course: "student" },
      { user_id: users[3]._id, course_id: courses[0]._id, role_in_course: "ta" },
      { user_id: users[2]._id, course_id: courses[0]._id, role_in_course: "instructor" },
      { user_id: users[1]._id, course_id: courses[0]._id, role_in_course: "admin" }
    ]);

    // Assignments
    const assignments = await Assignment.insertMany([
      { course_id: courses[0]._id, title: "DB Schema", description: "Design DB and SQL", due_date: new Date("2025-10-01T23:59:00") },
      { course_id: courses[0]._id, title: "Seed Script", description: "Provide seed data", due_date: new Date("2025-10-05T23:59:00") }
    ]);

    // Submissions
    const submissions = await Submission.insertMany([
      { assignment_id: assignments[0]._id, user_id: users[4]._id, content: "SQL file upload", file_path: "/uploads/tom_db.sql" },
      { assignment_id: assignments[0]._id, user_id: users[5]._id, content: "SQL file upload", file_path: "/uploads/aisy_db.sql" }
    ]);

    // Grades
    await Grade.insertMany([
      { submission_id: submissions[0]._id, grader_id: users[2]._id, score: 85, feedback: "Good structure" },
      { submission_id: submissions[1]._id, grader_id: users[2]._id, score: 78, feedback: "Fix some constraints" }
    ]);

    // Notifications
    await Notification.insertMany([
      { user_id: users[4]._id, title: "Assignment due", body: "DB Schema due on 2025-10-01" },
      { user_id: users[5]._id, title: "Missing submission", body: "You did not submit assignment 2" }
    ]);

    console.log("✅ EldoLMS MongoDB database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
