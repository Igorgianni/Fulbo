const { useState, useEffect } = React;

const habilidades = [
  { clave: 'pase', etiqueta: 'Pase', icono: '🦶' },
  { clave: 'tiro', etiqueta: 'Tiro', icono: '🥅' },
  { clave: 'regate', etiqueta: 'Regate', icono: '⚽' },
  { clave: 'defensa', etiqueta: 'Defensa', icono: '🛡️' },
  { clave: 'arquero', etiqueta: 'Arquero', icono: '🧤' },
  { clave: 'estadoFisico', etiqueta: 'Estado Físico', icono: '🏃' }
];

function CreadorEquiposFutbol() {
  const [jugadores, setJugadores] = useState([]);
  const [nuevoJugador, setNuevoJugador] = useState({
    nombre: '',
    pase: 1,
    tiro: 1,
    regate: 1,
    defensa: 1,
    arquero: 1,
    estadoFisico: 1,
    general: 0
  });
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    const jugadoresGuardados = localStorage.getItem('jugadores');
    if (jugadoresGuardados) {
      setJugadores(JSON.parse(jugadoresGuardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
  }, [jugadores]);

  const manejarCambioInput = (nombre, valor) => {
    setNuevoJugador(prev => {
      const jugadorActualizado = { ...prev, [nombre]: nombre === 'nombre' ? valor : Math.round(Number(valor)) };
      const { pase, tiro, regate, defensa, arquero, estadoFisico } = jugadorActualizado;
      jugadorActualizado.general = Math.round(((pase + tiro + regate + defensa + arquero + estadoFisico) / 6) * 10);
      return jugadorActualizado;
    });
  };

  const agregarJugador = () => {
    if (nuevoJugador.nombre) {
      setJugadores(prev => [...prev, nuevoJugador]);
      setNuevoJugador({
        nombre: '',
        pase: 1,
        tiro: 1,
        regate: 1,
        defensa: 1,
        arquero: 1,
        estadoFisico: 1,
        general: 0
      });
    }
  };

  const generarEquipos = () => {
    const jugadoresOrdenados = [...jugadores].sort((a, b) => b.general - a.general);
    const equipo1 = [];
    const equipo2 = [];
    let suma1 = 0;
    let suma2 = 0;

    jugadoresOrdenados.forEach((jugador) => {
      if (suma1 <= suma2) {
        equipo1.push(jugador);
        suma1 += jugador.general;
      } else {
        equipo2.push(jugador);
        suma2 += jugador.general;
      }
    });

    // Asegurarse de que ambos equipos tengan el mismo número de jugadores
    while (equipo1.length > equipo2.length) {
      const jugador = equipo1.pop();
      equipo2.push(jugador);
      suma1 -= jugador.general;
      suma2 += jugador.general;
    }
    while (equipo2.length > equipo1.length) {
      const jugador = equipo2.pop();
      equipo1.push(jugador);
      suma2 -= jugador.general;
      suma1 += jugador.general;
    }

    // Intentar equilibrar aún más intercambiando jugadores
    let intercambios = 0;
    const maxIntercambios = 100; // Límite para evitar bucles infinitos
    while (Math.abs(suma1 - suma2) > 5 && intercambios < maxIntercambios) {
      for (let i = 0; i < equipo1.length; i++) {
        for (let j = 0; j < equipo2.length; j++) {
          if (Math.abs((suma1 - equipo1[i].general + equipo2[j].general) - 
                       (suma2 - equipo2[j].general + equipo1[i].general)) < 
              Math.abs(suma1 - suma2)) {
            // Intercambiar jugadores
            const temp = equipo1[i];
            equipo1[i] = equipo2[j];
            equipo2[j] = temp;
            suma1 = suma1 - temp.general + equipo1[i].general;
            suma2 = suma2 - equipo1[i].general + temp.general;
            intercambios++;
            break;
          }
        }
        if (Math.abs(suma1 - suma2) <= 5) break;
      }
    }

    setEquipos([equipo1, equipo2]);
  };

  const calcularPromedioEquipo = (equipo) => {
    const suma = equipo.reduce((acc, jugador) => acc + jugador.general, 0);
    return equipo.length > 0 ? suma / equipo.length : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-blue-500 p-4">
      <div className="container mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-800 flex items-center justify-center">
          <span className="mr-2">⚽</span> Igor/Nico 2025 <span className="ml-2">⚽</span>
        </h1>
        
        <div className="mb-8 bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Agregar Jugador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Jugador</label>
              <input
                id="nombre"
                name="nombre"
                value={nuevoJugador.nombre}
                onChange={(e) => manejarCambioInput('nombre', e.target.value)}
                placeholder="Ingrese el nombre del jugador"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            {habilidades.map(({ clave, etiqueta, icono }) => (
              <div key={clave}>
                <label htmlFor={clave} className="block text-sm font-medium text-gray-700 mb-1">
                  {icono} {etiqueta}
                </label>
                <input
                  type="range"
                  id={clave}
                  min="1"
                  max="10"
                  value={nuevoJugador[clave]}
                  onChange={(e) => manejarCambioInput(clave, e.target.value)}
                  className="w-full"
                />
                <span className="text-sm text-gray-500 mt-1 block">
                  {nuevoJugador[clave]}
                </span>
              </div>
            ))}
            <div className="col-span-full flex justify-center mt-4">
              <button
                onClick={agregarJugador}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              >
                Agregar Jugador
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Jugadores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {jugadores.map((jugador, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition duration-300 ease-in-out">
                <h3 className="font-bold text-lg mb-2 text-green-700">{jugador.nombre}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {habilidades.map(({ clave, etiqueta, icono }) => (
                    <span key={clave} className="text-sm bg-gray-200 rounded px-2 py-1 flex items-center">
                      <span className="mr-1">{icono}</span>
                      <span>{jugador[clave]}</span>
                    </span>
                  ))}
                </div>
                <span className="mt-2 inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold">
                  General: {jugador.general}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={generarEquipos}
            className="px-8 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 text-lg font-semibold"
          >
            Generar Equipos Equilibrados
          </button>
        </div>

        {equipos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {equipos.map((equipo, equipoIndex) => (
              <div key={equipoIndex} className="bg-gray-100 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Equipo {equipoIndex + 1}</h2>
                <div className="space-y-4">
                  {equipo.map((jugador, jugadorIndex) => (
                    <div key={jugadorIndex} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition duration-300 ease-in-out">
                      <h3 className="font-bold text-lg mb-2 text-green-700">{jugador.nombre}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {habilidades.map(({ clave, etiqueta, icono }) => (
                          <span key={clave} className="text-sm bg-gray-200 rounded px-2 py-1 flex items-center">
                            <span className="mr-1">{icono}</span>
                            <span>{jugador[clave]}</span>
                          </span>
                        ))}
                      </div>
                      <span className="mt-2 inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold">
                        General: {jugador.general}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-bold text-center text-lg text-green-700">
                  Promedio del equipo: {calcularPromedioEquipo(equipo).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<CreadorEquiposFutbol />, document.getElementById('root'));


ReactDOM.render(<CreadorEquiposFutbol />, document.getElementById('root'));

