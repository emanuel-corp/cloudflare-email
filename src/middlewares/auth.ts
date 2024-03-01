/**
 * Middleware to check if the user is authenticated
 * @param request
 * @constructors
 */
const AuthMiddleware = async (request: Request, env: Env) => {
	let token = request.headers.get("Authorization");
	let referer = request.headers.get("Referer")

	if (!token && request.method === 'POST') {
		const contentType = request.headers.get('Content-Type') || '';

		if (contentType.includes('application/x-www-form-urlencoded')) {
			const formData = await request.formData();
			token = formData.get('token') || '';
			referer = formData.get('referer') || '';
		}

		if (contentType.includes('application/json')) {
			const body = await request.clone().json()
			token = body?.token || '';
			referer = body?.referer || '';
		}
	}

	// Strict check for token existence
	if (!env.TOKEN || env.TOKEN.length === 0) {
		return Response.redirect(referer ?? 'https://edtek.ai/fail', 302);
	}

	if (token !== env.TOKEN) {
		return Response.redirect(referer ?? 'https://edtek.ai/fail', 302);
	}
};

export default AuthMiddleware;
