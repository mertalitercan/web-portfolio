import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // For now, we'll log the message and return success
    console.log("Contact form submission:", { name, email, message })

    // In a real implementation, you would send the email here
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'contact@yourdomain.com',
    //   to: 'your-email@example.com',
    //   subject: `New contact from ${name}`,
    //   html: `
    //     <h3>New contact form submission</h3>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
