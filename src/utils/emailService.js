// Mock email service for OTP verification (for demo purposes)
export const sendOTP = async (email, otp) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, log the OTP to console
    console.log(`📧 OTP sent to ${email}: ${otp}`);
    
    // Show alert with OTP for demo (remove in production)
    alert(`Demo Mode: Your OTP is ${otp}\n\nIn production, this would be sent to ${email}`);
    
    // Always return true for demo
    return true;
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return false;
  }
};

// Alternative: Real EmailJS implementation (uncomment and configure)
/*
export const sendOTPReal = async (email, otp) => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_YOUR_ID', // Replace with your EmailJS service ID
        template_id: 'template_YOUR_ID', // Replace with your EmailJS template ID
        user_id: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
        template_params: {
          to_email: email,
          otp_code: otp,
          subject: 'Presto Guitar Academy - Email Verification',
          message: `Your verification code is: ${otp}. This code will expire in 10 minutes.`
        }
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return false;
  }
};
*/

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};