// Real EmailJS OTP system
export const sendOTP = async (email, otp) => {
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
      'x6pionKVpG71eDz4'
    );
    
    console.log('📧 EmailJS success:', result.text);
    return true;
  } catch (error) {
    console.error('EmailJS error:', error);
    
    // Fallback to demo mode
    console.log(`📧 Fallback OTP for ${email}: ${otp}`);
    alert(`⚠️ Email service unavailable\n\nDemo Mode - Your OTP: ${otp}\n\nPlease use this code to continue.`);
    return true;
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

// Demo-only function for testing
export const sendOTPDemo = async (email, otp) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log(`📧 Demo OTP sent to ${email}: ${otp}`);
  alert(`✅ Demo Mode\n\nYour OTP: ${otp}`);
  return true;
};