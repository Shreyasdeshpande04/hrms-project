import { sendEmail } from '../config/mailer.js';

export const sendWelcomeEmail = async (userEmail, userName) => {
  const subject = 'Welcome to Modern HR System';
  const html = `<h1>Hello ${userName}</h1><p>Your account has been successfully created.</p>`;
  await sendEmail(userEmail, subject, html);
};

export const sendInterviewInvite = async (candidateEmail, jobTitle, date) => {
  const subject = `Interview Invitation: ${jobTitle}`;
  const html = `<p>You have been invited for an interview on ${new Date(date).toLocaleString()}.</p>`;
  await sendEmail(candidateEmail, subject, html);
};