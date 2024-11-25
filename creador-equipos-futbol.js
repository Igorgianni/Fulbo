import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Jugador {
  id: number;
  nombre: string;
  imagen: string;
  pase: number;
  tiro: number;
  regate: number;
  defensa: number;
  arquero: number;
  estadoFisico: number;
}

const habilidades = [
  { clave: 'pase', etiqueta: 'Pase', icono: '🦶' },
  { clave: 'tiro', etiqueta: 'Tiro', icono: '🥅' },
  { clave: 'regate', etiqueta: 'Regate', icono: '⚽' },
  { clave: 'defensa', etiqueta: 'Defensa', icono: '🛡️' },
  { clave: 'arquero', etiqueta: 'Arquero', icono: '🧤' },
  { clave: 'estadoFisico', etiqueta: 'Estado Físico', icono: '🏃' }
];

export default function App() {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState<number[]>([]);
  const [equipos, setEquipos] = useState<Jugador[][]>([]);

  useEffect(() => {
    fetch('/jugadores.json')
      .then(response => response.json())
      .then(data => setJugadores(data.jugadores))
      .catch(error => console.error('Error cargando jugadores:', error));
  }, []);

  const toggleJugadorSeleccionado = (jugadorId: number) => {
    setJugadoresSeleccionados(prev => 
      prev.includes(jugadorId)
        ? prev.filter(id => id !== jugadorId)
        : [...prev, jugadorId]
    );
  };

  const generarEquipos = () => {
    const jugadoresParaEquipos = jugadores.filter(jugador => jugadoresSeleccionados.includes(jugador.id));
    const jugadoresOrdenados = [...jugadoresParaEquipos].sort((a, b) => {
      const promedioA = (a.pase + a.tiro + a.regate + a.defensa + a.arquero + a.estadoFisico) / 6;
      const promedioB = (b.pase + b.tiro + b.regate + b.defensa + b.arquero + b.estadoFisico) / 6;
      return promedioB - promedioA;
    });

    const equipo1: Jugador[] = [];
    const equipo2: Jugador[] = [];

    jugadoresOrdenados.forEach((jugador, index) => {
      if (index % 2 === 0) {
        equipo1.push(jugador);
      } else {
        equipo2.push(jugador);
      }
    });

    setEquipos([equipo1, equipo2]);
  };

  const calcularPromedio = (equipo: Jugador[]) => {
    if (equipo.length === 0) return 0;
    const suma = equipo.reduce((acc, jugador) => {
      return acc + (jugador.pase + jugador.tiro + jugador.regate + jugador.defensa + jugador.arquero + jugador.estadoFisico) / 6;
    }, 0);
    return (suma / equipo.length).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 p-4">
      <div className="container mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-5xl font-bold mb-8 text-center text-blue-800 flex items-center justify-center">
          <span className="mr-2">⚽</span> Igor/Nico 2025 <span className="ml-2">⚽</span>
        </h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Seleccionar Jugadores</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {jugadores.map((jugador) => (
                  <div key={jugador.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`jugador-${jugador.id}`}
                      checked={jugadoresSeleccionados.includes(jugador.id)}
                      onCheckedChange={() => toggleJugadorSeleccionado(jugador.id)}
                    />
                    <label
                      htmlFor={`jugador-${jugador.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src={jugador.imagen} alt={jugador.nombre} />
                          <AvatarFallback>{jugador.nombre.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{jugador.nombre}</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="text-center mb-8">
          <Button onClick={generarEquipos} className="px-10 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 text-2xl font-bold shadow-lg">
            Generar Equipos
          </Button>
        </div>

        {equipos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {equipos.map((equipo, equipoIndex) => (
              <Card key={equipoIndex}>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Equipo {equipoIndex + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {equipo.map((jugador) => (
                        <div key={jugador.id} className="flex flex-col items-center p-2 bg-gray-100 rounded-lg">
                          <Avatar className="w-16 h-16 mb-2">
                            <AvatarImage src={jugador.imagen} alt={jugador.nombre} />
                            <AvatarFallback>{jugador.nombre.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-bold text-sm text-center">{jugador.nombre}</h3>
                          <div className="mt-2 text-xs">
                            {habilidades.map(({ clave, icono }) => (
                              <div key={clave}>
                                {icono} {jugador[clave as keyof Jugador]}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <p className="mt-4 font-bold text-center">
                    Promedio del equipo: {calcularPromedio(equipo)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

