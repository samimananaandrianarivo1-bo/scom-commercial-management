import { hibernateApi, jpaApi } from './api';

export const rayonService = {
  list:   ()        => hibernateApi.get('/rayons').then(r => r.data),
  get:    (id)      => hibernateApi.get(`/rayons/${id}`).then(r => r.data),
  create: (payload) => hibernateApi.post('/rayons', payload).then(r => r.data),
  update: (id, p)   => hibernateApi.put(`/rayons/${id}`, p).then(r => r.data),
  remove: (id)      => hibernateApi.delete(`/rayons/${id}`).then(r => r.data),

  statistiques: ()  => jpaApi.get('/statistiques/rayons').then(r => r.data),
};
