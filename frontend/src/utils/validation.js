export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const getPasswordStrength = (password) => {
  if (!password) return 0;
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  return strength;
};

export const getPasswordStrengthText = (strength) => {
  const texts = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  return texts[strength] || 'Weak';
};

export const getPasswordStrengthColor = (strength) => {
  const colors = ['red', 'orange', 'yellow', 'lime', 'green'];
  return colors[strength] || 'red';
};
