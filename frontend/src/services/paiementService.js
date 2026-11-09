import { hibernateApi } from './api';

export const paiementService = {
  list:   ()        => hibernateApi.get('/paiements').then(r => r.data),
  get:    (id)      => hibernateApi.get(`/paiements/${id}`).then(r => r.data),
  create: (payload) => hibernateApi.post('/paiements', payload).then(r => r.data),
  update: (id, p)   => hibernateApi.put(`/paiements/${id}`, p).then(r => r.data),
  remove: (id)      => hibernateApi.delete(`/paiements/${id}`).then(r => r.data),
};
