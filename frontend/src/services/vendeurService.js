import { hibernateApi, jpaApi } from './api';

// CRUD => Hibernate
export const vendeurService = {
  list:   ()        => hibernateApi.get('/vendeurs').then(r => r.data),
  get:    (id)      => hibernateApi.get(`/vendeurs/${id}`).then(r => r.data),
  create: (payload) => hibernateApi.post('/vendeurs', payload).then(r => r.data),
  update: (id, p)   => hibernateApi.put(`/vendeurs/${id}`, p).then(r => r.data),
  remove: (id)      => hibernateApi.delete(`/vendeurs/${id}`).then(r => r.data),

  // Recherche avancée => JPA
  search:      (q)  => jpaApi.get('/vendeurs/search', { params: { q } }).then(r => r.data),
  classement:  ()   => jpaApi.get('/statistiques/classement-vendeurs').then(r => r.data),
  page:        (p)  => jpaApi.get('/vendeurs/page', { params: p }).then(r => r.data),
};
