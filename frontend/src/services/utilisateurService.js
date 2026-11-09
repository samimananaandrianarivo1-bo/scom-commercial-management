import { hibernateApi } from './api';

export const utilisateurService = {
  list:   ()        => hibernateApi.get('/utilisateurs').then(r => r.data),
  get:    (id)      => hibernateApi.get(`/utilisateurs/${id}`).then(r => r.data),
  create: (payload) => hibernateApi.post('/utilisateurs', payload).then(r => r.data),
  update: (id, p)   => hibernateApi.put(`/utilisateurs/${id}`, p).then(r => r.data),
  remove: (id)      => hibernateApi.delete(`/utilisateurs/${id}`).then(r => r.data),

  login: (login, password) =>
    hibernateApi.post('/utilisateurs/login', { login, password }).then(r => r.data),

  updatePhoto: (id, photo) =>
    hibernateApi.put(`/utilisateurs/${id}/photo`, { photo }).then(r => r.data),
};
