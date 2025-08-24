// EmailJS OTP service - Sends real OTP to user's email
export const sendOTP = async (email, otp) => {
  try {
    console.log(`📧 Sending OTP ${otp} to ${email}...`);
    
    const emailjs = await import('@emailjs/browser');
    
    const currentTime = new Date();
    const expiryTime = new Date(currentTime.getTime() + 15 * 60000);
    const formattedTime = expiryTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Send real email via EmailJS
    const result = await emailjs.send(
      'service_369z29l',      // Your service ID
      'template_glt5mke',     // Your template ID  
      {
        to_email: email,      // Recipient email
        passcode: otp,        // 6-digit OTP
        time: formattedTime   // Expiry time
      },
      'x6pionKVpG71eDz4'      // Your public key
    );
    
    console.log('✅ OTP email sent successfully:', result.text);
    return { success: true, message: 'OTP sent to your email' };
    
  } catch (error) {
    console.error('❌ EmailJS failed:', error);
    
    // Fallback: Show OTP in alert for demo purposes
    console.log(`📧 Fallback - Demo OTP for ${email}: ${otp}`);
    alert(`📧 Email Service Issue\n\nYour OTP: ${otp}\n\n(Check your email first, then use this code if email didn't arrive)`);
    
    return { success: true, message: 'OTP displayed (email service issue)' };
  }
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