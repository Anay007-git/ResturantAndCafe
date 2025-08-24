// Demo OTP system (working implementation)
export const sendOTP = async (email, otp) => {
  try {
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log for debugging
    console.log(`📧 Demo OTP sent to ${email}: ${otp}`);
    
    // Show OTP in alert for demo purposes
    alert(`✅ Verification Code Sent!\n\nYour OTP: ${otp}\n\nEmail: ${email}\n\n(In production, this would be sent via email)`);
    
    return true;
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return false;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Quick test function
export const sendOTPTest = async (email, otp) => {
  console.log(`📧 Test OTP: ${otp} for ${email}`);
  alert(`Test OTP: ${otp}`);
  return true;
};

// For future EmailJS implementation (when configured properly)
export const sendOTPEmailJS = async (email, otp) => {
  try {
    const emailjs = await import('@emailjs/browser');
    
    const currentTime = new Date();
    const expiryTime = new Date(currentTime.getTime() + 15 * 60000);
    const formattedTime = expiryTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const result = await emailjs.send(
      'service_369z29l',
      'template_glt5mke',
      {
        to_email: email,
        passcode: otp,
        time: formattedTime
      },
      '-x6pionKVpG71eDz4'
    );
    
    console.log('📧 EmailJS success:', result.text);
    return true;
  } catch (error) {
    console.error('EmailJS error:', error);
    return false;
  }
};