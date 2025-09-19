// List of common passwords to check against (can be expanded)
const commonPasswords = new Set([
  "password", "123456", "password123", "admin", "qwerty",
  "letmein", "welcome", "monkey", "dragon", "master",
  "shadow", "123456789", "football", "baseball", "superman",
  "abc123", "iloveyou", "trustno1", "sunshine", "princess",
  "welcome123", "login", "guest", "hello", "access"
]);

// Character sets for analysis
const lowercase = /[a-z]/;
const uppercase = /[A-Z]/;
const digits = /[0-9]/;
const specialChars = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/;

// Helper function to check repeated chars (3+ in a row)
function hasRepeatedChars(pwd) {
  return /(.)\1\1/.test(pwd);
}

// Helper function to check sequential chars (abc, 123)
function hasSequentialChars(pwd) {
  pwd = pwd.toLowerCase();
  for (let i = 0; i < pwd.length - 2; i++) {
    const first = pwd.charCodeAt(i);
    const second = pwd.charCodeAt(i + 1);
    const third = pwd.charCodeAt(i + 2);
    if (second === first + 1 && third === first + 2) {
      return true;
    }
  }
  return false;
}

// Calculate password strength score
function calculateStrength(pwd) {
  let score = 0;

  // Length scoring
  if (pwd.length >= 12) score += 25;
  else if (pwd.length >= 8) score += 20;
  else if (pwd.length >= 6) score += 10;
  else if (pwd.length >= 4) score += 5;

  // Character variety scoring
  if (lowercase.test(pwd)) score += 10;
  if (uppercase.test(pwd)) score += 10;
  if (digits.test(pwd)) score += 10;
  if (specialChars.test(pwd)) score += 10;

  if (lowercase.test(pwd) && uppercase.test(pwd) && digits.test(pwd) && specialChars.test(pwd)) {
    score += 10;
  }

  // Penalties
  if (commonPasswords.has(pwd.toLowerCase())) score -= 30;
  if (hasRepeatedChars(pwd)) score -= 15;
  if (hasSequentialChars(pwd)) score -= 10;

  return Math.min(Math.max(score, 0), 100);
}

// Convert score to strength level string
function getStrengthLevel(score) {
  if (score >= 80) return "Very Strong";
  if (score >= 60) return "Strong";
  if (score >= 40) return "Medium";
  if (score >= 20) return "Weak";
  return "Very Weak";
}

// Generate feedback messages with icons and color classes
function generateFeedback(pwd, score) {
  let feedback = [];

  // Length feedback
  if (pwd.length < 8) feedback.push({icon:'fa-exclamation-triangle', text:"Use at least 8 characters (12+ recommended)", type:"warning"});
  else if (pwd.length < 12) feedback.push({icon:'fa-exclamation-triangle', text:"Consider using 12+ characters for better security", type:"warning"});
  else feedback.push({icon:'fa-check-circle', text:"Good length", type:"good"});

  // Character type feedback
  if (!lowercase.test(pwd)) feedback.push({icon:'fa-exclamation-triangle', text:"Add lowercase letters (a-z)", type:"warning"});
  if (!uppercase.test(pwd)) feedback.push({icon:'fa-exclamation-triangle', text:"Add uppercase letters (A-Z)", type:"warning"});
  if (!digits.test(pwd)) feedback.push({icon:'fa-exclamation-triangle', text:"Add numbers (0-9)", type:"warning"});
  if (!specialChars.test(pwd)) feedback.push({icon:'fa-exclamation-triangle', text:"Add special characters (!@#$%^&*)", type:"warning"});

  // Security warnings
  if (commonPasswords.has(pwd.toLowerCase())) feedback.push({icon:'fa-times-circle', text:"This is a commonly used password - avoid it!", type:"danger"});
  if (hasRepeatedChars(pwd)) feedback.push({icon:'fa-exclamation-triangle', text:"Avoid repeating characters (aaa, 111)", type:"warning"});
  if (hasSequentialChars(pwd)) feedback.push({icon:'fa-exclamation-triangle', text:"Avoid sequential characters (abc, 123)", type:"warning"});

  // Positive feedback
  if (score >= 80) feedback.push({icon:'fa-check-circle', text:"Excellent password strength!", type:"good"});
  else if (score >= 60) feedback.push({icon:'fa-check-circle', text:"Good password strength", type:"good"});

  return feedback;
}

// Update UI based on password input
function updatePasswordFeedback() {
  const input = document.getElementById("password-input");
  const feedbackDiv = document.getElementById("password-feedback");
  const strengthBar = document.getElementById("strength-bar");

  const pwd = input.value.trim();

  if (!pwd) {
    feedbackDiv.innerHTML = "";
    strengthBar.style.width = "0%";
    strengthBar.className = "";
    return;
  }

  const score = calculateStrength(pwd);
  const level = getStrengthLevel(score);
  const feedback = generateFeedback(pwd, score);

  // Decide class for strength label colour
  let labelClass = "feedback-very-weak";
  if (score >= 80) labelClass = "feedback-very-strong";
  else if (score >= 60) labelClass = "feedback-strong";
  else if (score >= 40) labelClass = "feedback-medium";
  else if (score >= 20) labelClass = "feedback-weak";

  // Build feedback HTML using Font Awesome icons and color coded list items
  let html = `<strong class="${labelClass}">Strength: ${level} (${score}/100)</strong><ul>`;
  for (const item of feedback) {
    html += `<li class="feedback-${item.type}"><i class="fas ${item.icon}" aria-hidden="true" style="margin-right: 8px;"></i>${item.text}</li>`;
  }
  html += "</ul>";

  feedbackDiv.innerHTML = html;

  // Update strength bar
  strengthBar.style.width = score + "%";
  strengthBar.className = "";

  if (score >= 80) strengthBar.classList.add("strength-very-strong");
  else if (score >= 60) strengthBar.classList.add("strength-strong");
  else if (score >= 40) strengthBar.classList.add("strength-medium");
  else if (score >= 20) strengthBar.classList.add("strength-weak");
  else strengthBar.classList.add("strength-very-weak");
}

// Attach event listener after DOM loads
window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById("password-input");
  if (input) {
    input.addEventListener("input", updatePasswordFeedback);
  }
});
