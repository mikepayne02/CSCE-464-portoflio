/** @jsxImportSource react */
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text
} from '@react-email/components'

interface ContactAuthorEmailProps {
  fullName: string
  message: string
}

const baseUrl = import.meta.env.SITE ?? ''

export const ContactAuthorEmail = ({
  fullName,
  message
}: ContactAuthorEmailProps) => (
  <Html>
    <Head />
    <Preview>Message from {fullName?.split(' ')[0] ?? fullName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/email-logo.png`}
          width={48}
          height={48}
          alt='Logo'
        />
        <Section style={body}>
          <Text style={paragraph}>Message from {fullName}</Text>
          <Text style={paragraph}>{message}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

ContactAuthorEmail.PreviewProps = {
  fullName: 'FIRST LAST',
  message: 'Example message'
} as ContactAuthorEmailProps

export default ContactAuthorEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
}

const container = {
  margin: '0 auto',
  padding: '20px 25px 48px'
}

const body = {
  margin: '24px 0'
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px'
}
