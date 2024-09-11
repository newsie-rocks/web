/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
	return new Response(String('Hello !'));
}
