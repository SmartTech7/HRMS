// functions/save-attendance.js
const faunadb = require('faunadb');
const q = faunadb.query;

// Initialize FaunaDB client
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET_KEY, // Use the secret key from the environment
});

exports.handler = async (event, context) => {
  const { date, clockInTime, clockOutTime, status } = JSON.parse(event.body);

  try {
    const result = await client.query(
      q.Create(
        q.Collection('attendance_logs'),
        {
          data: { date, clockInTime, clockOutTime, status },
        }
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Attendance saved successfully!' }),
    };
  } catch (error) {
    console.error('Error saving attendance:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to save attendance.' }),
    };
  }
};
