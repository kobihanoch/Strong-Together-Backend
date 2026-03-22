import request from 'supertest';
import { authHeaders } from './auth.ts';

export function getMessages(app: any, accessToken: string, tz = 'Asia/Jerusalem') {
  return request(app).get('/api/messages/getmessages').query({ tz }).set(authHeaders(accessToken));
}

export function markMessageAsRead(app: any, accessToken: string, messageId: string) {
  return request(app).put(`/api/messages/markasread/${messageId}`).set(authHeaders(accessToken));
}

export function deleteMessage(app: any, accessToken: string, messageId: string) {
  return request(app).delete(`/api/messages/delete/${messageId}`).set(authHeaders(accessToken));
}
