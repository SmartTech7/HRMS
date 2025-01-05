// functions/get-attendance.js
const faunadb = require('faunadb');
const q = faunadb.query;

// Initialize FaunaDB client
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET_KEY,
});

exports.handler = async (event, context) => {
  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('attendance_logs'))),
        q.Lambda('X', q.Get('X'))
      )
    );

    const attendanceData = result.data.map(doc => doc.data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: attendanceData,
      }),
    };
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch attendance data.',
      }),
    };
  }
};
