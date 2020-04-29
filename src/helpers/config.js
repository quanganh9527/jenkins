export const config = {
  gateway_url_uaa: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1337',
  gateway_url: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8081',
  client_id: 'web_app',
  client_secret: 'changeit'
}