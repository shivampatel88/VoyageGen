import { WEB3FORMS_ACCESS_KEY } from '../config/env';

export const sendQuoteEmail = async (
    toEmail: string, 
    toName: string, 
    quoteUrl: string, 
    destination: string
) => {
    if (!WEB3FORMS_ACCESS_KEY) {
        console.warn('⚠️ Web3Forms Access Key is missing in .env. Falling back to console logging.');
        console.log(`\n📧 [MOCK EMAIL]`);
        console.log(`To: ${toName} <${toEmail}>`);
        console.log(`Subject: Your customized trip to ${destination} is ready!`);
        console.log(`Body: Hello ${toName}, your curated quote for ${destination} is ready. View it here: ${quoteUrl}\n`);
        return true;
    }

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                name: "VoyageGen Team",
                from_name: "VoyageGen",
                email: "noreply@voyagegen.com",
                subject: `Your customized trip to ${destination} is ready!`,
                message: `Hello ${toName},\n\nYour curated quote for your trip to ${destination} is ready! Please review it by clicking the link below:\n\n${quoteUrl}\n\nBest,\nThe VoyageGen Team`,
                // Adding custom data for Web3Forms to display in email
                recipient_email: toEmail,
                quote_link: quoteUrl,
                destination: destination
            })
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Email sent successfully via Web3Forms');
            return true;
        } else {
            console.error('❌ Web3Forms Error:', result.message);
            throw new Error(result.message || 'Failed to send email via Web3Forms');
        }
    } catch (error) {
        console.error('❌ Error sending email via Web3Forms:', error);
        throw new Error('Failed to send email');
    }
};
