// Real EmailJS implementation for OTP verification
export const sendOTP = async (email, otp) => {
  try {
    const currentTime = new Date();
    const expiryTime = new Date(currentTime.getTime() + 15 * 60000); // 15 minutes from now
    const formattedTime = expiryTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_369z29l',
        template_id: 'template_glt5mke',
        user_id: '-x6pionKVpG71eDz4',
        template_params: {
          to_email: email,
          passcode: otp,
          time: formattedTime
        }
      })
    });
    
    if (response.ok) {
      console.log(`📧 OTP sent successfully to ${email}`);
      return true;
    } else {
      console.error('EmailJS API error:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return false;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Fallback mock function for testing
export const sendOTPMock = async (email, otp) => {
  console.log(`📧 Mock OTP sent to ${email}: ${otp}`);
  alert(`Demo Mode: Your OTP is ${otp}`);
  return true;
};