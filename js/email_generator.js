const user = "jinwen.pan";
const domain = "rutgers.edu";
const email = user + "@" + domain;
const link = document.createElement("a");
link.href = "mailto:" + email;
link.textContent = email;
document.getElementById("email-link").appendChild(link);