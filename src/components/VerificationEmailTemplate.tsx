// Template of Email consisting of Verification Code
// CSS/Styling Generated using Copilot in VS-Code

import { Html, Head, Font, Preview, Heading, Section, Text, Button, Body, Container, Hr } from "react-email";

interface VerificationEmailProps {
  username: string;
  otp: string;
  verificationLink: string;
}

export default function VerificationEmailTemplate({ username, otp, verificationLink }: VerificationEmailProps) {
  verificationLink = `${verificationLink}/verify/${username}?ref=email`;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify your AnonyMsg account</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Your AnonyMsg verification code is {otp}</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brand}>AnonyMsg</Text>
          </Section>

          <Section style={styles.content}>
            <Heading as="h1" style={styles.heading}>Verify your account</Heading>
            <Text style={styles.greeting}>Hello @{username},</Text>
            <Text style={styles.copy}>
              Use the code below to complete your AnonyMsg registration.
            </Text>

            <Section style={styles.codeBox}>
              <Text style={styles.code}>{otp}</Text>
            </Section>

            <Button href={verificationLink} style={styles.button}>
              Verify account
            </Button>

            <Text style={styles.expiry}>If you did not create this account, you can safely ignore this email.</Text>
          </Section>

          <Hr style={styles.rule} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>This is an automated message from AnonyMsg.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f4f7fb',
    color: '#172033',
    fontFamily: 'Roboto, Verdana, sans-serif',
    margin: 0,
    padding: '32px 16px',
  },
  container: {
    backgroundColor: '#ffffff',
    border: '1px solid #e4e9f0',
    borderRadius: '10px',
    margin: '0 auto',
    maxWidth: '520px',
    overflow: 'hidden' as const,
  },
  header: {
    backgroundColor: '#172033',
    padding: '20px 32px',
  },
  brand: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '0.2px',
    margin: 0,
  },
  content: {
    padding: '36px 40px 28px',
  },
  heading: {
    color: '#172033',
    fontSize: '26px',
    fontWeight: '700',
    lineHeight: '34px',
    margin: '0 0 20px',
  },
  greeting: {
    color: '#172033',
    fontSize: '15px',
    lineHeight: '24px',
    margin: '0 0 8px',
  },
  copy: {
    color: '#536176',
    fontSize: '15px',
    lineHeight: '24px',
    margin: '0 0 24px',
  },
  codeBox: {
    backgroundColor: '#f1f5f9',
    border: '1px solid #dce4ee',
    borderRadius: '8px',
    margin: '0 0 24px',
    padding: '16px',
    textAlign: 'center' as const,
  },
  code: {
    color: '#172033',
    fontSize: '30px',
    fontWeight: '700',
    letterSpacing: '7px',
    lineHeight: '36px',
    margin: 0,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: '6px',
    color: '#ffffff',
    display: 'block',
    fontSize: '15px',
    fontWeight: '700',
    lineHeight: '20px',
    padding: '13px 22px',
    textAlign: 'center' as const,
    textDecoration: 'none',
  },
  expiry: {
    color: '#718096',
    fontSize: '13px',
    lineHeight: '20px',
    margin: '24px 0 0',
  },
  rule: {
    borderColor: '#e4e9f0',
    margin: '0 40px',
  },
  footer: {
    padding: '18px 40px 24px',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: '12px',
    lineHeight: '18px',
    margin: 0,
  },
};