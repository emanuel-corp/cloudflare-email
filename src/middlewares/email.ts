import iEmailSchema, { IEmail } from '../schema/email';

export type EmailRequest = Request & {
	email?: IEmail;
};

/**
 * Middleware to validate the request body against the email schema
 * @param request
 * @constructor
 */
const EmailSchemaMiddleware = async (request: EmailRequest) => {
	const content = await request.json();
	const email = iEmailSchema.safeParse(content);
	if (email.success) {
		request.email = email.data;
		return;
	}

	return Response.redirect('https://edtek.ai/fail', 302);
};

export default EmailSchemaMiddleware;
