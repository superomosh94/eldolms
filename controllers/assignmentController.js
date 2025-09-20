const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

exports.createAssignment = async (req, res) => {
  try {
    const { course, title, description, dueDate } = req.body;
    
    if (!course || !title) {
      return res.status(400).json({ message: 'Please provide course and title' });
    }
    
    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Create assignment failed' });
  }
};

// Fetch all assignments, optionally filtered by teacher/admin role
exports.getAssignments = async (req, res) => {
  try {
    let query = {};
    // If teacher, only assignments for their courses
    if (req.user.role === 'teacher') {
      const teacherCourses = await Course.find({ teacher: req.user.id }).select('_id');
      query.course = { $in: teacherCourses.map(c => c._id) };
    }

    const assignments = await Assignment.find(query)
      .populate('course', 'title') // populate course title
      .populate('submissions.student', 'name email'); // populate student details

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fetch assignments failed' });
  }
};

exports.getAssignmentsByCourse = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('submissions.student', 'name email');
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fetch assignments failed' });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const fileUrl = `/uploads/${file.filename}`;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const existingSubmission = assignment.submissions.find(
      s => s.student.toString() === req.user.id
    );
    
    if (existingSubmission) {
      existingSubmission.fileUrl = fileUrl;
      existingSubmission.submittedAt = new Date();
    } else {
      assignment.submissions.push({
        student: req.user.id,
        fileUrl
      });
    }

    await assignment.save();
    res.json({ message: 'Submission received' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Submission failed' });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { marks } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const submission = assignment.submissions.find(s => s.student.toString() === studentId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.marks = marks;
    await assignment.save();
    res.json({ message: 'Submission graded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Grading failed' });
  }
};
