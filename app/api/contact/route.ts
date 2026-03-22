import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        // Create a transporter
        // NOTE: In a real production app, use environment variables for these credentials
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER || 'ethereal_user',
                pass: process.env.EMAIL_PASS || 'ethereal_pass',
            },
        });

        // If no real credentials, we just log and pretend it worked for dev/demo
        if (!process.env.EMAIL_HOST) {
            console.log('---------------------------------------------------');
            console.log('MOCK EMAIL SENDING (No credentials provided in .env)');
            console.log('To:', process.env.CONTACT_EMAIL || 'admin@thoon.com');
            console.log('From:', email);
            console.log('Subject:', `New Contact Form Submission from ${name}`);
            console.log('Message:', message);
            console.log('---------------------------------------------------');
            return NextResponse.json({ success: true, message: 'Mock email sent successfully' });
        }

        // Send mail with defined transport object
        await transporter.sendMail({
            from: `"${name}" <${process.env.EMAIL_FROM || 'no-reply@thoon.com'}>`, // sender address
            to: process.env.CONTACT_EMAIL || 'admin@thoon.com', // list of receivers
            replyTo: email,
            subject: `New Inquiry from ${name}`, // Subject line
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // plain text body
            html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `, // html body
        });

        return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ success: false, message: 'Error sending email' }, { status: 500 });
    }
}
