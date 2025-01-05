// functions/login.js
exports.handler = async (event, context) => {
    const { username, password } = JSON.parse(event.body);
  
    // Simulated user database (replace with actual database in production)
    const users = [
      { username: "admin", password: "password123", role: "admin" },
      { username: "employee1", password: "emp123", role: "employee" },
      { username: "employee2", password: "emp456", role: "employee" },
    ];
  
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, role: user.role }),  // Include the role in the response
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "Invalid username or password" }),
      };
    }
  };
  