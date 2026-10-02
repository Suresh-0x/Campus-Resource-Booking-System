const nodemailer = require('nodemailer');

// Configure transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendBookingConfirmation = async (user, booking, resource) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  try {
    const mailOptions = {
      from: `"Campus Resource Booking System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Booking Request Received: ${resource.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">Campus Resource Booking Request</h2>
          <p style="color: #475569; font-size: 14px;">Hello <strong>${user.name}</strong>,</p>
          <p style="color: #475569; font-size: 14px;">Your reservation request has been successfully submitted and is currently pending administrator review.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Facility:</strong> ${resource.name} (${resource.code})</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> ${resource.location}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${booking.date}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Time Slot:</strong> ${booking.startTime} - ${booking.endTime}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Purpose:</strong> ${booking.purpose}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> <span style="color: #d97706; font-weight: bold;">Pending Approval</span></p>
          </div>

          <p style="color: #64748b; font-size: 12px;">You will receive another notification once an administrator reviews your request.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 11px;">Campus Resource Booking System • Team O6</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Email confirmation sent to ${user.email}`);
  } catch (error) {
    console.error('Email sending failed (non-blocking):', error.message);
  }
};

exports.sendBookingStatusUpdate = async (user, booking, resource, status, remarks) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  try {
    const isApproved = status === 'approved';
    const statusColor = isApproved ? '#16a34a' : '#dc2626';

    const mailOptions = {
      from: `"Campus Resource Booking System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Booking Request ${isApproved ? 'Approved 🎉' : 'Decision'}: ${resource.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: ${statusColor}; margin-bottom: 8px;">
            Booking Request ${isApproved ? 'Approved! 🎉' : 'Rejected'}
          </h2>
          <p style="color: #475569; font-size: 14px;">Hello <strong>${user.name}</strong>,</p>
          <p style="color: #475569; font-size: 14px;">
            An administrator has reviewed your reservation request for <strong>${resource.name}</strong>.
          </p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Facility:</strong> ${resource.name} (${resource.code})</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${booking.date}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold; text-transform: uppercase;">${status}</span></p>
            ${remarks ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Administrator Remarks:</strong> "${remarks}"</p>` : ''}
          </div>

          <p style="color: #64748b; font-size: 12px;">You can view and manage all your bookings on the Campus Resource Portal.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 11px;">Campus Resource Booking System • Team O6</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Status update email sent to ${user.email}`);
  } catch (error) {
    console.error('Email status update failed (non-blocking):', error.message);
  }
};
