# EmailJS Setup Instructions

## 1. Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

## 2. Create Email Service
1. Go to Email Services in your EmailJS dashboard
2. Click "Add New Service"
3. Choose Gmail
4. Connect your Gmail account (mitrakaustav17@gmail.com)
5. Note down the Service ID

## 3. Create Email Template
1. Go to Email Templates
2. Click "Create New Template"
3. Use this template:

```
Subject: New Demo Class Booking - {{student_name}}

Dear {{to_name}},

A new demo class has been booked:

Student Details:
- Name: {{student_name}}
- Email: {{student_email}}
- Phone: {{student_phone}}
- Instrument: {{instrument}}

Class Details:
- Date: {{demo_date}}
- Time: {{time_slot}}
- Booked at: {{booking_time}}

Google Calendar Link:
{{calendar_link}}

CC: {{cc_email}}

Best regards,
Presto Guitar Academy Booking System
```

4. Note down the Template ID

## 4. Update Code
Replace in DemoBooking.js:
- -x6pionKVpG71eDz4
- service_gkueejb 
- template_dfxgdcd

## 5. Test the Integration
1. Make a test booking
2. Check if email is received
3. Verify Google Calendar link works
4. Confirm CC email is sent

## Gmail Settings
Make sure Gmail allows less secure apps or use App Passwords for better security.