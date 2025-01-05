// functions/update-attendance.js
const faunadb = require('faunadb');
const q = faunadb.query;

// Initialize FaunaDB client
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET_KEY,
});

exports.handler = async (event, context) => {
  try {
    const { date, clockInTime, clockOutTime } = JSON.parse(event.body);

    const result = await client.query(
      q.Let(
        {
          attendanceDoc: q.If(
            q.Exists(q.Match(q.Index('attendance_by_date'), date)),
            q.Get(q.Match(q.Index('attendance_by_date'), date)),
            q.Create(q.Collection('attendance_logs'), { data: { date } })
          ),
        },
        q.Update(
          q.Select(['ref'], q.Var('attendanceDoc')),
          {
            data: {
              clockInTime: clockInTime || q.Select(['data', 'clockInTime'], q.Var('attendanceDoc')),
              clockOutTime: clockOutTime || q.Select(['data', 'clockOutTime'], q.Var('attendanceDoc')),
            },
          }
        )
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (error) {
    console.error('Error updating attendance:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
