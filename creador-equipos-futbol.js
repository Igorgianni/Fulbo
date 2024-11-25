import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { database, auth } from './firebaseConfig';
import { ref, set, get, update } from "firebase/database";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

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
    pase: 5,
    tiro: 5,
    regate: 5,
    defensa: 5,
    arquero: 5,
    estadoFisico: 5,
  });
  const [equipos, setEquipos] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Autenticar al usuario anónimamente
    signInAnonymously(auth)
      .then(() => {
        console.log("Usuario autenticado anónimamente");
      })
      .catch((error) => {
        console.error("Error de autenticación:", error);
      });

    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        cargarJugadores();
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const cargarJugadores = () => {
    const jugadoresRef = ref(database, 'jugadores');
    get(jugadoresRef).then((snapshot) => {
      if (snapshot.exists()) {
        const jugadoresData = snapshot.val();
        const jugadoresArray = Object.keys(jugadoresData).map(key => ({
          id: key,
          ...jugadoresData[key],
          general: calcularPromedio(jugadoresData[key])
        }));
        setJugadores(jugadoresArray);
      }
    }).catch((error) => {
      console.error("Error al cargar jugadores:", error);
    });
  };

  const calcularPromedio = (jugador) => {
    const habilidades = ['pase', 'tiro', 'regate', 'defensa', 'arquero', 'estadoFisico'];
    const suma = habilidades.reduce((acc, hab) => {
      const calificaciones = Object.values(jugador[hab] || {});
      const promedio = calificaciones.length > 0 ? calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length : 0;
      return acc + promedio;
    }, 0);
    return Math.round((suma / habilidades.length) * 10) / 10;
  };

  const manejarCambioInput = (nombre, valor) => {
    setNuevoJugador(prev => ({
      ...prev,
      [nombre]: nombre === 'nombre' ? valor : Math.round(Number(valor))
    }));
  };

  const agregarJugador = () => {
    if (nuevoJugador.nombre && userId) {
      const jugadorRef = ref(database, `jugadores/${nuevoJugador.nombre}`);
      const nuevoJugadorData = {};
      habilidades.forEach(({ clave }) => {
        nuevoJugadorData[clave] = { [userId]: nuevoJugador[clave] };
      });
      set(jugadorRef, nuevoJugadorData)
        .then(() => {
          console.log("Jugador agregado con éxito");
          cargarJugadores();
          setNuevoJugador({
            nombre: '',
            pase: 5,
            tiro: 5,
            regate: 5,
            defensa: 5,
            arquero: 5,
            estadoFisico: 5,
          });
        })
        .catch((error) => {
          console.error("Error al agregar jugador:", error);
        });
    }
  };

  const actualizarCalificacion = (jugadorId, habilidad, valor) => {
    if (userId) {
      const jugadorRef = ref(database, `jugadores/${jugadorId}/${habilidad}/${userId}`);
      set(jugadorRef, valor)
        .then(() => {
          console.log("Calificación actualizada con éxito");
          cargarJugadores();
        })
        .catch((error) => {
          console.error("Error al actualizar calificación:", error);
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

    setEquipos([equipo1, equipo2]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 p-4">
      <div className="container mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-5xl font-bold mb-8 text-center text-blue-800 flex items-center justify-center">
          <span className="mr-2">⚽</span> Igor/Nico 2025 <span className="ml-2">⚽</span>
        </h1>
        
        <div className="mb-8 bg-blue-100 rounded-lg shadow-md p-6 border-2 border-blue-300">
          <h2 className="text-3xl font-semibold mb-4 text-center text-blue-800">Agregar o Calificar Jugador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label htmlFor="nombre" className="block text-lg font-medium text-blue-700 mb-1">Nombre del Jugador</label>
              <input
                id="nombre"
                name="nombre"
                value={nuevoJugador.nombre}
                onChange={(e) => manejarCambioInput('nombre', e.target.value)}
                placeholder="Ingrese el nombre del jugador"
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg"
              />
            </div>
            {habilidades.map(({ clave, etiqueta, icono }) => (
              <div key={clave}>
                <label htmlFor={clave} className="block text-lg font-medium text-blue-700 mb-1">
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
                <span className="text-lg text-blue-600 mt-1 block font-semibold">
                  {nuevoJugador[clave]}
                </span>
              </div>
            ))}
            <div className="col-span-full flex justify-center mt-4">
              <button
                onClick={agregarJugador}
                className="px-8 py-3 bg-yellow-400 text-blue-900 rounded-full hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 text-xl font-bold shadow-lg"
              >
                Agregar / Actualizar Jugador
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-100 rounded-lg shadow-md p-6 mb-8 border-2 border-blue-300">
          <h2 className="text-3xl font-semibold mb-4 text-center text-blue-800">Jugadores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {jugadores.map((jugador) => (
              <div key={jugador.id} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-300 ease-in-out flex flex-col items-center justify-center border-2 border-blue-200">
                <h3 className="font-bold text-lg text-center text-blue-800 mb-2">{jugador.id}</h3>
                {habilidades.map(({ clave, etiqueta, icono }) => (
                  <div key={clave} className="flex items-center justify-between w-full mb-2">
                    <span>{icono} {etiqueta}:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={jugador[clave][userId] || 5}
                      onChange={(e) => actualizarCalificacion(jugador.id, clave, parseInt(e.target.value))}
                      className="w-16 text-center border rounded"
                    />
                  </div>
                ))}
                <div className="font-bold mt-2">General: {jugador.general}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={generarEquipos}
            className="px-10 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 text-2xl font-bold shadow-lg"
          >
            Generar Equipos
          </button>
        </div>

        {equipos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {equipos.map((equipo, equipoIndex) => (
              <div key={equipoIndex} className="bg-blue-100 rounded-lg shadow-md p-6 border-2 border-blue-300">
                <h2 className="text-3xl font-semibold mb-4 text-center text-blue-800">Equipo {equipoIndex + 1}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {equipo.map((jugador) => (
                    <div key={jugador.id} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-300 ease-in-out flex flex-col items-center justify-center border-2 border-blue-200">
                      <h3 className="font-bold text-lg text-center text-blue-800 mb-2">{jugador.id}</h3>
                      <div className="font-bold">General: {jugador.general}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<CreadorEquiposFutbol />, document.getElementById('root'));

