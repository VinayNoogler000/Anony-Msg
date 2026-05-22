// import { EmailTemplate } from '../../../components/email-template';
import { Resend } from 'resend';

export const resendAPI = new Resend(process.env.RESEND_API_KEY);