async function getLinkedInClient() {
  const openidModule = await import('openid-client');
  const { Issuer } = openidModule.default;

  if (!Issuer) {
    throw new Error('Issuer is still undefined. There may be an issue with the openid-client package or its version.');
  }

  const linkedInIssuer = await Issuer.discover('https://www.linkedin.com/oauth/.well-known/openid-configuration');

  const client = new linkedInIssuer.Client({
    client_id: process.env.LINKEDIN_CLIENT_ID,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    redirect_uris: ['http://localhost:5000/auth/linkedin/callback'],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_post'
  });

  return client;
}

module.exports = { getLinkedInClient };