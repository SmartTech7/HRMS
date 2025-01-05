document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();  // Prevent form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/.netlify/functions/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    
    if (result.success) {
        if (result.role === "admin") {
            window.location.href = "/admin-dashboard.html";  // Redirect to Admin Dashboard
        } else if (result.role === "employee") {
            window.location.href = "/employee-dashboard.html";  // Redirect to Employee Dashboard
        }
    } else {
        document.getElementById("error-message").innerText = result.message;
    }
});
