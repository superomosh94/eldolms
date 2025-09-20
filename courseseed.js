require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course'); // adjust if needed

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const seedCourses = async () => {
  try {
    await Course.deleteMany();

    const courses = [
      {
        title: 'Introduction to Web Development',
        description: 'Learn HTML, CSS, and JavaScript to build basic websites.',
        code: 'WEB101',
      },
      {
        title: 'Backend Development with Node.js',
        description: 'Build APIs and server-side apps using Node.js and Express.',
        code: 'NODE201',
      },
      {
        title: 'Database Management with MongoDB',
        description: 'Understand NoSQL concepts and work with MongoDB databases.',
        code: 'DB301',
      },
      {
        title: 'Frontend Frameworks with React',
        description: 'Learn component-based development using React.js.',
        code: 'REACT401',
      },
      {
        title: 'Cybersecurity Basics',
        description: 'Get started with security concepts, vulnerabilities, and defense strategies.',
        code: 'SEC501',
      },
    ];

    await Course.insertMany(courses);

    console.log('✅ Seeded 5 tech courses successfully.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCourses();
