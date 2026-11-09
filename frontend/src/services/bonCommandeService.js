import { hibernateApi } from './api';

export const bonCommandeService = {
  list:   ()        => hibernateApi.get('/bons-commandes').then(r => r.data),
  get:    (id)      => hibernateApi.get(`/bons-commandes/${id}`).then(r => r.data),
  create: (payload) => hibernateApi.post('/bons-commandes', payload).then(r => r.data),
  update: (id, p)   => hibernateApi.put(`/bons-commandes/${id}`, p).then(r => r.data),
  remove: (id)      => hibernateApi.delete(`/bons-commandes/${id}`).then(r => r.data),
};
