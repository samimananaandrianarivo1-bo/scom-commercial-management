import { jpaApi } from './api';

export const dashboardService = {
  stats: () => jpaApi.get('/dashboard').then(r => r.data),
};
