/** @jsxImportSource react */
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text
} from '@react-email/components'

import { siteConfig } from '@/site-config'

const { author } = siteConfig

interface ContactEmailProps {
  firstName?: string
}

const baseUrl = import.meta.env.BASE_URL

export const ContactEmail = ({ firstName }: ContactEmailProps) => (
  <Html>
    <Head />
    <Preview>Thanks for your message</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/email-logo.png`}
          width={48}
          height={48}
          alt='Logo'
        />
        <Heading style={heading}>Hi {firstName}!</Heading>
        <Section style={body}>
          <Text style={paragraph}>
            Thanks for reaching out. I'll be sure to reply as soon as possible.
          </Text>
        </Section>
        <Text style={paragraph}>
          Sincerely,
          <br />- {author}
        </Text>
        <Hr style={hr} />
        <Img
          src={`${baseUrl}/email-logo.png`}
          width={32}
          height={32}
          style={{
            WebkitFilter: 'grayscale(100%)',
            filter: 'grayscale(100%)',
            margin: '20px 0'
          }}
        />
        <Text style={footer}>
          This is an automated message. Please do not reply.
        </Text>
      </Container>
    </Body>
  </Html>
)

ContactEmail.PreviewProps = {
  firstName: 'NAME'
} as ContactEmailProps

export default ContactEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
}

const container = {
  margin: '0 auto',
  padding: '20px 25px 48px'
}

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px'
}

const body = {
  margin: '24px 0'
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px'
}

const hr = {
  borderColor: '#dddddd',
  marginTop: '48px'
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginLeft: '4px'
}
