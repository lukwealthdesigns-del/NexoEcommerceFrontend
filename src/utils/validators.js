export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    return re.test(email);
  },
  
  phone: (phone) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  },
  
  password: (password) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
      isValid: password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /[0-9]/.test(password) && 
               /[^A-Za-z0-9]/.test(password)
    };
  },
  
  username: (username) => {
    const re = /^[A-Za-z0-9_]{3,}$/;
    return re.test(username);
  },
  
  fullName: (name) => {
    const re = /^[A-Za-z\s]{2,}$/;
    return re.test(name);
  },
};