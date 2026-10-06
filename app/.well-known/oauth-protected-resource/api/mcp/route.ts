// Path-specific form of the protected resource metadata (RFC 9728 §3.1): for the
// resource https://host/api/mcp some clients look here first.
export { GET, OPTIONS } from "../../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
