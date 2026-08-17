const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-development-jwt-secret";
const TOKEN_EXPIRES_IN_SECONDS = 60 * 60 * 24;

const base64UrlEncode = (value) =>
  Buffer.from(value).toString("base64url");

const sign = (value) =>
  crypto.createHmac("sha256", JWT_SECRET).update(value).digest("base64url");

const createToken = (payload) => {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRES_IN_SECONDS,
    })
  );
  const signature = sign(`${header}.${body}`);

  return `${header}.${body}.${signature}`;
};

const verifyToken = (token) => {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    throw new Error("Invalid token");
  }

  const expectedSignature = sign(`${header}.${body}`);
  const signaturesMatch = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!signaturesMatch) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
};

module.exports = { createToken, verifyToken };
