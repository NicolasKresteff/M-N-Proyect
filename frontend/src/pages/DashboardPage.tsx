import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { listComercios, type Comercio } from '../api/comercios';

export function DashboardPage() {
  const { logout } = useAuth();
  const [comercios, setComercios] = useState<Comercio[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listComercios()
      .then(setComercios)
      .catch(() => setError('No se pudo conectar con el backend'));
  }, []);

  return (
    <main style={{ maxWidth: 480, margin: '4rem auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>M&N — Panel</h1>
        <button onClick={logout}>Salir</button>
      </header>

      <h2>Comercios</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {!error && comercios.length === 0 && <p>Todavía no hay comercios cargados.</p>}
      <ul>
        {comercios.map((c) => (
          <li key={c.id}>
            {c.nombreComercial} ({c.identificadorFiscal})
          </li>
        ))}
      </ul>
    </main>
  );
}
