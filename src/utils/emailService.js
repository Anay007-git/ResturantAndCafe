// Demo OTP service - Always shows OTP on screen
export const sendOTP = async (email, otp) => {
  console.log(`📧 Demo OTP for ${email}: ${otp}`);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { success: true, message: 'OTP generated successfully' };
};

// Generate secure 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if OTP is valid format
export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};