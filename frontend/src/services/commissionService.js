import { hibernateApi } from './api';

export const commissionService = {
  list:   ()        => hibernateApi.get('/commissions').then(r => r.data),
  get:    (id)      => hibernateApi.get(`/commissions/${id}`).then(r => r.data),
  create: (payload) => hibernateApi.post('/commissions', payload).then(r => r.data),
  update: (id, p)   => hibernateApi.put(`/commissions/${id}`, p).then(r => r.data),
  remove: (id)      => hibernateApi.delete(`/commissions/${id}`).then(r => r.data),
};
