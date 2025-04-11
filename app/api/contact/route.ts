import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Envoyer l'email à votre Gmail
    await resend.emails.send({
      from: "Formulaire de Contact <onboarding@resend.dev>",
      to: "apolline.diaz@gmail.com", // Votre Gmail ici
      subject: `Message de ${name}`,
      replyTo: email, // Le plus important : permet de répondre directement à l'expéditeur
      html: `
        <p><strong>De:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur d'envoi" }, { status: 500 });
  }
}
