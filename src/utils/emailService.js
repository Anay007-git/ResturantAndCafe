// Email service using JSMailer for OTP verification
export const sendOTP = async (email, otp) => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'your_service_id', // Replace with your EmailJS service ID
        template_id: 'your_template_id', // Replace with your EmailJS template ID
        user_id: 'your_user_id', // Replace with your EmailJS user ID
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

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};