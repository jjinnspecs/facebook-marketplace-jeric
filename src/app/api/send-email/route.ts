import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { listing_id, seller_email, buyer_email, message } = await req.json();

  if (!listing_id || !seller_email || !buyer_email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }


  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('title')
    .eq('id', listing_id)
    .single();

  if (listingError || !listing) {
    console.error('Error fetching listing:', listingError);
  }
  
  const listingTitle = listing?.title || 'your listing';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: seller_email,
    subject: `New Message About Your Listing: "${listingTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>You've received a new message!</h2>
        <p>A potential buyer is interested in your listing: <strong>${listingTitle}</strong>.</p>
        <hr>
        <p><strong>From:</strong> ${buyer_email}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 1em; margin: 1em 0; color: #555;">
          ${message}
        </blockquote>
        <hr>
        <p style="font-size: 0.8em; color: #777;">
          This is an automated notification from Marketplace.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 