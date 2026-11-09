import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const stack = [
  { name: "Backend Hibernate", tech: "Spring Boot 3 · Hibernate ORM · JDK 25", port: 8081, color: "blue" },
  { name: "Backend JPA",       tech: "Spring Boot 3 · Spring Data JPA · JDK 25", port: 8082, color: "emerald" },
  { name: "Frontend React",    tech: "React 18 · Vite · Axios · Recharts",        port: 5173, color: "sky" },
  { name: "Base MySQL",        tech: "WAMP · db_scom_database",                    port: 3306, color: "slate" },
];

const entities = [
  { name: "RAYON",         desc: "Départements commerciaux" },
  { name: "VENDEUR",       desc: "Vendeurs / commerciaux" },
  { name: "BON_COMMANDE",  desc: "Bons de commande (rattachés à un vendeur)" },
  { name: "COMMISSION",    desc: "Commissions versées aux vendeurs" },
  { name: "PAIEMENT",      desc: "Encaissements" },
  { name: "UTILISATEUR",   desc: "Comptes locaux (login/mot de passe)" },
  { name: "EXPLOITER",     desc: "Association VENDEUR ↔ RAYON (n:n)" },
  { name: "ETRE_PAYE_PAR", desc: "Association BON_COMMANDE ↔ PAIEMENT (n:n)" },
];

const endpointsHibernate = [
  "GET/POST/PUT/DELETE  /api/vendeurs",
  "GET/POST/PUT/DELETE  /api/rayons",
  "GET/POST/PUT/DELETE  /api/bons-commandes",
  "GET/POST/PUT/DELETE  /api/commissions",
  "GET/POST/PUT/DELETE  /api/paiements",
  "GET/POST/PUT/DELETE  /api/utilisateurs",
  "POST                 /api/utilisateurs/login",
];

const endpointsJpa = [
  "GET  /api/dashboard",
  "GET  /api/statistiques/classement-vendeurs",
  "GET  /api/statistiques/rayons",
  "GET  /api/vendeurs",
  "GET  /api/vendeurs/page?page=0&size=10&sort=nomVendeur",
  "GET  /api/vendeurs/search?q=...",
];

export default async function HomePage() {
  // Sandbox health check (Next.js/PostgreSQL)
  let sandboxOk = false;
  try {
    await db.execute(sql`select 1`);
    sandboxOk = true;
  } catch { sandboxOk = false; }

  return (
    <main className="min-h-screen">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2861] via-[#1e40af] to-[#10b981] px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
            Projet universitaire · 100 % local
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
            SCOM <span className="text-emerald-300">— Système de Gestion Commerciale</span>
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/85 sm:text-xl">
            Deux applications Spring Boot indépendantes (Hibernate + JPA, <b>JDK 25</b>),
            un frontend React/Vite unifié, et une base MySQL WAMP.
            L'ensemble fonctionne <b>sans Internet</b>.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://github.com/" className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg hover:bg-slate-50">
              📖 Voir le README
            </a>
            <a href="#quickstart" className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              🚀 Démarrage rapide
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stack.map((s) => (
              <div key={s.name} className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">Port {s.port}</div>
                <div className="mt-1 text-sm font-bold">{s.name}</div>
                <div className="mt-1 text-xs text-white/70">{s.tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATUT SANDBOX ================= */}
      <section className="mx-auto max-w-6xl px-6 -mt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${sandboxOk ? "bg-emerald-500" : "bg-red-500"}`}></span>
            <span className="text-sm text-slate-700">
              <b>Sandbox de documentation</b> · Next.js/PostgreSQL —
              {sandboxOk ? " opérationnelle ✔" : " indisponible"}
            </span>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Le vrai projet SCOM est dans <code>backend-hibernate/</code>, <code>backend-jpa/</code>, <code>frontend/</code>
          </span>
        </div>
      </section>

      {/* ================= ARCHITECTURE ================= */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-700">Architecture</div>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">Trois briques, une base</h2>
          <p className="mt-2 text-slate-600">
            Deux backends Spring Boot exposent des API REST distinctes, consommées par un frontend unique.
          </p>
        </div>

        <pre className="overflow-x-auto rounded-2xl bg-slate-900 p-6 text-xs leading-6 text-slate-100 shadow-lg">
{`                         SCOM
                          │
                 ┌────────▼────────┐
                 │    React JS     │  :5173  (Vite)
                 └────────┬────────┘
              ┌───────────┴───────────┐
              ▼                       ▼
     ┌─────────────────┐     ┌─────────────────┐
     │ Backend         │     │ Backend         │
     │ Hibernate       │     │ Spring Data JPA │
     │ Spring Boot     │     │ Spring Boot     │
     │ JDK 25 · :8081  │     │ JDK 25 · :8082  │
     └────────┬────────┘     └────────┬────────┘
              └───────────┬───────────┘
                          ▼
                ┌──────────────────┐
                │   MySQL / WAMP   │
                │ db_scom_database │
                │      :3306       │
                └──────────────────┘`}
        </pre>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-700">Backend Hibernate</div>
            <p className="mt-2 text-sm text-slate-700">
              CRUD complet des 6 entités métier, mappé finement avec Hibernate ORM
              (relations <code>@ManyToOne</code>, <code>@OneToMany</code>, <code>@ManyToMany</code>).
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-700">Backend JPA</div>
            <p className="mt-2 text-sm text-slate-700">
              Requêtes avancées Spring Data (pagination, tri, <code>@Query</code> JPQL &amp; natives)
              pour dashboard, classements et statistiques.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-700">Frontend React</div>
            <p className="mt-2 text-sm text-slate-700">
              UI ERP/SaaS moderne : sidebar, topbar, cards, tables, modals, badges, charts (Recharts).
              Deux clients Axios <code>hibernateApi</code> / <code>jpaApi</code>.
            </p>
          </div>
        </div>
      </section>

      {/* ================= DONNÉES ================= */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-700">Modèle de données</div>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">8 tables MySQL</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Table SQL</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Description</th>
                </tr>
              </thead>
              <tbody>
                {entities.map((e) => (
                  <tr key={e.name} className="border-t border-slate-100">
                    <td className="p-4 font-mono text-sm font-bold text-blue-700">{e.name}</td>
                    <td className="p-4 text-sm text-slate-700">{e.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Le script SQL complet est disponible dans <code>database/db_scom_database.sql</code>
            (schéma + jeu de démonstration).
          </p>
        </div>
      </section>

      {/* ================= API ================= */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-700">API REST</div>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">Endpoints par backend</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">Backend Hibernate</div>
                <div className="text-xs text-slate-500">http://localhost:8081</div>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">CRUD</span>
            </div>
            <ul className="space-y-1.5 font-mono text-xs text-slate-700">
              {endpointsHibernate.map((e) => (
                <li key={e} className="rounded bg-slate-50 px-3 py-1.5">{e}</li>
              ))}
            </ul>
            <a href="http://localhost:8081/swagger-ui/index.html"
               className="mt-4 inline-block text-xs font-semibold text-blue-700 hover:underline">
              → Swagger UI
            </a>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">Backend JPA</div>
                <div className="text-xs text-slate-500">http://localhost:8082</div>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">STATS</span>
            </div>
            <ul className="space-y-1.5 font-mono text-xs text-slate-700">
              {endpointsJpa.map((e) => (
                <li key={e} className="rounded bg-slate-50 px-3 py-1.5">{e}</li>
              ))}
            </ul>
            <a href="http://localhost:8082/swagger-ui/index.html"
               className="mt-4 inline-block text-xs font-semibold text-emerald-700 hover:underline">
              → Swagger UI
            </a>
          </div>
        </div>
      </section>

      {/* ================= QUICKSTART ================= */}
      <section id="quickstart" className="bg-slate-900 py-16 text-slate-100">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Démarrage rapide</div>
            <h2 className="mt-1 text-3xl font-bold text-white">3 commandes, 3 terminaux</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "① Backend Hibernate", cmd: "cd backend-hibernate\nmvn clean install\nmvn spring-boot:run" },
              { title: "② Backend JPA",       cmd: "cd backend-jpa\nmvn clean install\nmvn spring-boot:run" },
              { title: "③ Frontend React",    cmd: "cd frontend\nnpm install\nnpm run dev" },
            ].map((s) => (
              <div key={s.title} className="rounded-xl bg-slate-800 p-5">
                <div className="mb-3 text-sm font-bold text-emerald-300">{s.title}</div>
                <pre className="whitespace-pre-wrap text-xs leading-6 text-slate-200">{s.cmd}</pre>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800 p-5">
            <div className="text-sm font-bold text-white">Prérequis</div>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              <li>✅ <b>JDK 25</b> (obligatoire — vérifier via <code>java -version</code>)</li>
              <li>✅ Maven 3.9+</li>
              <li>✅ Node.js 18+</li>
              <li>✅ WAMP démarré + base <code>db_scom_database</code> importée
                (voir <code>database/db_scom_database.sql</code>)</li>
            </ul>
            <div className="mt-4 text-sm text-slate-300">
              <b>Comptes de démo :</b>
              <code className="mx-2 rounded bg-slate-900 px-2 py-0.5">admin / admin123</code>
              <code className="mx-2 rounded bg-slate-900 px-2 py-0.5">manager / manager123</code>
              <code className="mx-2 rounded bg-slate-900 px-2 py-0.5">operateur / operateur123</code>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-slate-500">
        <p>
          <b>SCOM</b> · Projet universitaire · JDK 25 · Spring Boot · React · MySQL/WAMP · 100 % offline
        </p>
      </footer>
    </main>
  );
}
