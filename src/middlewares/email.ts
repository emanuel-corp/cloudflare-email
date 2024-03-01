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
	const contentType = request.headers.get('Content-Type') || '';
	let content = {};

	if (contentType.includes('application/json')) {
		content = await request.clone().json();
	} else if (contentType.includes('application/x-www-form-urlencoded')) {
		const formData = await request.clone().formData();
		for (const [key, value] of formData) {
			content[key] = value;
		}
	}

	const email = iEmailSchema.safeParse(content);

	if (email.success) {
		request.email = email.data;
		return;
	}

	return Response.redirect('https://edtek.ai/fail', 302);
};

export default EmailSchemaMiddleware;
