import axios from 'axios';

/**
 * Deux clients Axios distincts vers les DEUX backends Spring Boot.
 * - hibernateApi : CRUD (Vendeurs, Rayons, Bons de commande, Commissions, Paiements, Utilisateurs, Auth)
 * - jpaApi       : Dashboard, statistiques, rapports, recherches avancées
 */
export const hibernateApi = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export const jpaApi = axios.create({
  baseURL: 'http://localhost:8082/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Intercepteur d'erreur commun pour uniformiser le message
function attachErrorInterceptor(client, label) {
  client.interceptors.response.use(
    (r) => r,
    (error) => {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const message =
        (data && (data.message || data.error)) ||
        error.message ||
        `Erreur inconnue (${label})`;
      return Promise.reject({ status, message, details: data?.details, raw: error });
    }
  );
}
attachErrorInterceptor(hibernateApi, 'hibernate');
attachErrorInterceptor(jpaApi, 'jpa');
