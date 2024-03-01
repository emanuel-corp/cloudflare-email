/**
 * Middleware to check if the user is authenticated
 * @param request
 * @constructors
 */
const AuthMiddleware = async (request: Request, env: Env) => {
	let token = request.headers.get("Authorization");
	if (!token && request.method === 'POST') {
		const contentType = request.headers.get('Content-Type') || '';

		if (contentType.includes('application/x-www-form-urlencoded')) {
			const formData = await request.formData();
			token = formData.get('token') || '';
		}

		if (contentType.includes('application/json')) {
			const body = await request.json() as {token?: string};
			token = body?.token || '';
		}
	}

	// Strict check for token existence
	if (!env.TOKEN || env.TOKEN.length === 0) {
		return new Response('You must set the TOKEN environment variable.', {
			status: 401,
		});
	}

	if (token !== env.TOKEN) {
		return new Response('Unauthorized', { status: 401 });
	}
};

export default AuthMiddleware;
