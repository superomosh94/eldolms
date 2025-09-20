const Course = require('../models/Course');
const Assignment = require('../models/Assignment');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, code, description, materials } = req.body;

    if (!title || !code) {
      return res.status(400).json({ message: 'Please provide title and code' });
    }

    const course = await Course.create({
      title,
      code,
      description,
      materials,
      instructor: req.user.id
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Create course failed', error: error.message });
  }
};

// Get all courses (populate instructor and optionally assignments for analytics)
exports.getCourses = async (req, res) => {
  try {
    let query = {};
    // If teacher, only return their courses
    if (req.user.role === 'teacher') {
      query.instructor = req.user.id;
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    // Optionally include assignments for analytics
    const coursesWithAssignments = await Promise.all(
      courses.map(async (course) => {
        const assignments = await Assignment.find({ course: course._id })
          .populate('submissions.student', 'name email');
        return { ...course.toObject(), assignments };
      })
    );

    res.json(coursesWithAssignments);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Fetch courses failed', error: error.message });
  }
};

// Get single course with assignments
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email');

    if (!course) return res.status(404).json({ message: 'Course not found' });

    const assignments = await Assignment.find({ course: course._id })
      .populate('submissions.student', 'name email');

    res.json({ ...course.toObject(), assignments });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Fetch course failed', error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Update course failed', error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Delete course failed', error: error.message });
  }
};
