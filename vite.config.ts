import path from "node:path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import type { Connect, Plugin } from "vite";
import { defineConfig } from "vite";

/**
 * Vite plugin to handle API routes during development.
 * Intercepts /api/* requests and executes the appropriate handler from api/ directory.
 * This allows Vercel serverless functions to work during Vite dev without a separate server.
 */
function apiRoutesPlugin(): Plugin {
	return {
		name: "api-routes",
		configureServer(server) {
			server.middlewares.use("/api", (async (req, res, next) => {
				try {
					// Extract the API route from the URL
					const url = new URL(req.url || "", `http://${req.headers.host}`);
					const routePath = url.pathname.replace("/api/", "");

					// Construct the handler path
					const handlerPath = path.resolve(
						process.cwd(),
						"api",
						`${routePath}.ts`,
					);

					// Check if the handler file exists
					const fs = await import("node:fs");
					if (!fs.existsSync(handlerPath)) {
						return next();
					}

					// Dynamically import the handler
					const handlerModule = await import(handlerPath);
					const handler = handlerModule.default;

					if (typeof handler !== "function") {
						res.statusCode = 500;
						res.end(JSON.stringify({ error: "Handler is not a function" }));
						return;
					}

					// Parse request body for POST/PUT/PATCH requests
					let body = {};
					if (
						req.method === "POST" ||
						req.method === "PUT" ||
						req.method === "PATCH"
					) {
						const chunks: Buffer[] = [];
						for await (const chunk of req) {
							chunks.push(chunk);
						}
						const rawBody = Buffer.concat(chunks).toString();
						if (rawBody) {
							try {
								body = JSON.parse(rawBody);
							} catch {
								body = rawBody;
							}
						}
					}

					// Create mock VercelRequest and VercelResponse objects
					const vercelReq = {
						method: req.method,
						url: req.url,
						query: Object.fromEntries(url.searchParams),
						body,
						headers: req.headers,
						cookies: {},
					};

					const vercelRes = {
						statusCode: 200,
						status(code: number) {
							this.statusCode = code;
							return this;
						},
						json(data: unknown) {
							res.statusCode = this.statusCode;
							res.setHeader("Content-Type", "application/json");
							res.end(JSON.stringify(data));
							return this;
						},
						end(data?: string | Buffer) {
							if (data) {
								res.end(data);
							} else {
								res.end();
							}
							return this;
						},
						setHeader(name: string, value: string) {
							res.setHeader(name, value);
							return this;
						},
					};

					// Call the handler
					await handler(vercelReq, vercelRes);
				} catch (error) {
					console.error("[API Routes Plugin] Error:", error);
					if (!res.headersSent) {
						res.statusCode = 500;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: "Internal server error" }));
					}
				}
			}) as Connect.NextHandleFunction);
		},
	};
}

export default defineConfig({
	plugins: [basicSsl(), react(), apiRoutesPlugin()],
	server: {
		port: 3000,
		host: "0.0.0.0",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
});
