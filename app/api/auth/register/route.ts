import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        
        const {
            // Account Details
            name,
            email,
            password,
            
            // Business Details (Common for both roles)
            companyName,
            gstNumber,
            businessAddress,
            city,
            state,
            pincode,
            phone,
            
            // Role Selection
            role,
            
            // Seller-specific fields
            materialCategories,
            deliveryAreas,
            businessType,
            yearsInBusiness,
            warehouseLocation,
            
            // Buyer-specific fields
            projectType,
            estimatedMaterialRequirement,
            projectLocation,
            constructionStage
        } = formData;

        // Validate required fields
        if (!name || !email || !password || !companyName || !gstNumber || !businessAddress || !city || !state || !pincode || !phone || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = db.findUserByEmail(email.toLowerCase().trim());
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Create user with pending status
        const user = db.createUser(name, email.toLowerCase().trim(), password, role, {
            phone,
            companyName,
            address: businessAddress,
            gstin: gstNumber.toUpperCase(),
            experienceYears: role === 'seller' ? parseInt(yearsInBusiness) : undefined
        });

        // Store additional profile data in a separate file or extend the user record
        // For now, we'll store it in the user record as additional properties
        const extendedUserData = {
            ...user,
            city,
            state,
            pincode,
            accountStatus: 'inactive',
            approvalStatus: 'pending',
            registrationDate: new Date().toISOString(),
            // Store role-specific data
            ...(role === 'seller' && {
                materialCategories,
                deliveryAreas,
                businessType,
                warehouseLocation
            }),
            ...(role === 'buyer' && {
                projectType,
                estimatedRequirement: estimatedMaterialRequirement,
                projectLocation,
                constructionStage
            })
        };

        // Log registration
        db.logAction(user.id, 'Register', `New ${role} account created: ${name} (${email}) - Status: pending approval`);

        // Send registration email to user
        await sendRegistrationEmail(email, name, role);

        // Send notification to admin
        await sendAdminNotification(name, email, role);

        return NextResponse.json({
            message: 'Registration successful! Your account is pending approval.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                accountStatus: 'inactive',
                approvalStatus: 'pending'
            }
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: error.message || 'Registration failed' },
            { status: 500 }
        );
    }
}

async function sendRegistrationEmail(email: string, name: string, role: string) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Your Thoon Enterprises account is under review',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e293b;">Welcome to Thoon Enterprises, ${name}!</h2>
                    <p>Thank you for registering as a ${role} on the Thoon Enterprises platform.</p>
                    <p>Your account has been successfully created and is currently under review by our team.</p>
                    <p>We will verify your business details and GST information before activating your account.</p>
                    <p>This process typically takes 24-48 hours.</p>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1e293b; margin-top: 0;">What happens next?</h3>
                        <ul style="color: #64748b;">
                            <li>Our team will review your registration details</li>
                            <li>We will verify your GST information</li>
                            <li>You will receive an approval email once verified</li>
                            <li>You can then login and access your dashboard</li>
                        </ul>
                    </div>
                    <p style="color: #64748b;">If you have any questions, please contact us at support@thoonenterprises.com</p>
                    <p style="color: #1e293b; font-weight: bold;">Best regards,<br/>The Thoon Enterprises Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email sending error:', error);
        // Don't fail the registration if email fails
    }
}

async function sendAdminNotification(name: string, email: string, role: string) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_EMAIL || 'admin@thoonenterprises.com',
            subject: `New ${role} Registration - ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e293b;">New User Registration</h2>
                    <p>A new ${role} has registered on the Thoon Enterprises platform and is awaiting approval.</p>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1e293b; margin-top: 0;">User Details:</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Role:</strong> ${role}</p>
                        <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    <p>Please review and approve this user in the admin dashboard.</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Review User</a>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Admin notification error:', error);
        // Don't fail the registration if email fails
    }
}
