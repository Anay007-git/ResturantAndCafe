// EmailJS implementation with fallback
export const sendOTP = async (email, otp) => {
  try {
    // Import EmailJS dynamically
    const emailjs = await import('@emailjs/browser');
    
    const currentTime = new Date();
    const expiryTime = new Date(currentTime.getTime() + 15 * 60000);
    const formattedTime = expiryTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const templateParams = {
      to_email: email,
      passcode: otp,
      time: formattedTime
    };
    
    const result = await emailjs.send(
      'service_369z29l',
      'template_glt5mke', 
      templateParams,
      '-x6pionKVpG71eDz4'
    );
    
    console.log('📧 OTP sent successfully:', result.text);
    return true;
    
  } catch (error) {
    console.error('EmailJS failed:', error);
    
    // Fallback to mock for demo
    console.log(`📧 Fallback: OTP for ${email} is ${otp}`);
    alert(`Demo Mode - Your OTP: ${otp}\n\nEmailJS failed, using demo mode.\nIn production, check your EmailJS configuration.`);
    return true;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simple mock for testing
export const sendOTPMock = async (email, otp) => {
  console.log(`📧 Mock OTP sent to ${email}: ${otp}`);
  alert(`Demo Mode: Your OTP is ${otp}`);
  return true;
};

// Alternative: Direct fetch implementation
export const sendOTPDirect = async (email, otp) => {
  try {
    const currentTime = new Date();
    const expiryTime = new Date(currentTime.getTime() + 15 * 60000);
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
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Direct EmailJS failed:', error);
    // Fallback to demo
    alert(`Demo Mode - Your OTP: ${otp}`);
    return true;
  }
};