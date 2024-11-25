"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClubIcon as Soccer, User, Trophy } from 'lucide-react'

const habilidades = [
  { clave: 'pase', etiqueta: 'Pase', icono: <Soccer className="w-4 h-4" /> },
  { clave: 'tiro', etiqueta: 'Tiro', icono: <Soccer className="w-4 h-4" /> },
  { clave: 'regate', etiqueta: 'Regate', icono: <Soccer className="w-4 h-4" /> },
  { clave: 'defensa', etiqueta: 'Defensa', icono: <Soccer className="w-4 h-4" /> },
  { clave: 'arquero', etiqueta: 'Arquero', icono: <Soccer className="w-4 h-4" /> },
  { clave: 'estadoFisico', etiqueta: 'Estado Físico', icono: <User className="w-4 h-4" /> }
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
  const [jugadoresGuardados, setJugadoresGuardados] = useState([]);

  useEffect(() => {
    const jugadoresAlmacenados = localStorage.getItem('jugadores');
    if (jugadoresAlmacenados) {
      setJugadores(JSON.parse(jugadoresAlmacenados));
    }
    actualizarListaJugadoresGuardados();
  }, []);

  useEffect(() => {
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
    actualizarListaJugadoresGuardados();
  }, [jugadores]);

  const actualizarListaJugadoresGuardados = () => {
    const nombres = JSON.parse(localStorage.getItem('jugadores') || '[]').map(j => j.nombre);
    setJugadoresGuardados(nombres);
  };

  const manejarCambioInput = (nombre, valor) => {
    setNuevoJugador(prev => {
      const jugadorActualizado = { ...prev, [nombre]: nombre === 'nombre' ? valor : Math.round(Number(valor)) };
      const { pase, tiro, regate, defensa, arquero, estadoFisico } = jugadorActualizado;
      jugadorActualizado.general = Math.round(((pase + tiro + regate + defensa + arquero + estadoFisico) / 6) * 10);
      return jugadorActualizado;
    });
  };

  const agregarJugador = () => {
    if (
      nuevoJugador.nombre &&
      nuevoJugador.pase >= 1 && nuevoJugador.pase <= 10 &&
      nuevoJugador.tiro >= 1 && nuevoJugador.tiro <= 10 &&
      nuevoJugador.regate >= 1 && nuevoJugador.regate <= 10 &&
      nuevoJugador.defensa >= 1 && nuevoJugador.defensa <= 10 &&
      nuevoJugador.arquero >= 1 && nuevoJugador.arquero <= 10 &&
      nuevoJugador.estadoFisico >= 1 && nuevoJugador.estadoFisico <= 10
    ) {
      setJugadores(prev => {
        const index = prev.findIndex(j => j.nombre === nuevoJugador.nombre);
        if (index !== -1) {
          const nuevosJugadores = [...prev];
          nuevosJugadores[index] = nuevoJugador;
          return nuevosJugadores;
        } else {
          return [...prev, nuevoJugador];
        }
      });
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
    } else {
      alert('Por favor, asegúrate de que todas las habilidades estén entre 1 y 10.');
    }
  };

  const cargarJugador = (nombre) => {
    const jugadorCargado = jugadores.find(j => j.nombre === nombre);
    if (jugadorCargado) {
      setNuevoJugador(jugadorCargado);
    }
  };

  const generarEquipos = () => {
    const jugadoresOrdenados = [...jugadores].sort((a, b) => b.general - a.general);
    const equipo1 = [];
    const equipo2 = [];

    jugadoresOrdenados.forEach((jugador, index) => {
      const sumaEquipo1 = equipo1.reduce((sum, j) => sum + j.general, 0);
      const sumaEquipo2 = equipo2.reduce((sum, j) => sum + j.general, 0);

      if (index % 2 === 0) {
        if (sumaEquipo1 <= sumaEquipo2) {
          equipo1.push(jugador);
        } else {
          equipo2.push(jugador);
        }
      } else {
        if (sumaEquipo2 <= sumaEquipo1) {
          equipo2.push(jugador);
        } else {
          equipo1.push(jugador);
        }
      }
    });

    setEquipos([equipo1, equipo2]);
  };

  const calcularPromedioEquipo = (equipo) => {
    const suma = equipo.reduce((acc, jugador) => acc + jugador.general, 0);
    return equipo.length > 0 ? suma / equipo.length : 0;
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-b from-green-100 to-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800 flex items-center justify-center">
        <Soccer className="w-10 h-10 mr-2" />
        Igor/Nico 2025
      </h1>
      
      <Card className="mb-8 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Agregar o Editar Jugador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <Label htmlFor="nombre">Nombre</Label>
              <div className="flex gap-2">
                <Input
                  id="nombre"
                  name="nombre"
                  value={nuevoJugador.nombre}
                  onChange={(e) => manejarCambioInput('nombre', e.target.value)}
                  placeholder="Nombre del jugador"
                  className="mt-1"
                />
                <Select onValueChange={cargarJugador}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Cargar jugador" />
                  </SelectTrigger>
                  <SelectContent>
                    {jugadoresGuardados.map((nombre) => (
                      <SelectItem key={nombre} value={nombre}>{nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {habilidades.map(({ clave, etiqueta, icono }) => (
              <div key={clave}>
                <Label htmlFor={clave} className="flex items-center">
                  {icono}
                  <span className="ml-2">{etiqueta}</span>
                </Label>
                <Slider
                  id={clave}
                  min={1}
                  max={10}
                  step={1}
                  value={[nuevoJugador[clave]]}
                  onValueChange={(value) => manejarCambioInput(clave, value[0])}
                  className="mt-2"
                />
                <span className="text-sm text-gray-500 mt-1 block">
                  {nuevoJugador[clave]}
                </span>
              </div>
            ))}
            <div className="col-span-full flex justify-center mt-4">
              <Button onClick={agregarJugador} className="w-full md:w-auto">
                {jugadoresGuardados.includes(nuevoJugador.nombre) ? 'Actualizar Jugador' : 'Agregar Jugador'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center">
              <User className="w-6 h-6 mr-2" />
              Jugadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {jugadores.map((jugador, index) => (
                <div key={index} className="mb-4 p-4 bg-green-50 rounded-lg shadow">
                  <h3 className="font-bold text-lg mb-2">{jugador.nombre}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {habilidades.map(({ clave, etiqueta, icono }) => (
                      <Badge key={clave} variant="secondary" className="text-xs flex items-center">
                        {icono}
                        <span className="ml-1">{etiqueta}: {jugador[clave]}</span>
                      </Badge>
                    ))}
                  </div>
                  <Badge className="mt-2 text-sm" variant="default">
                    General: {jugador.general}
                  </Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center">
              <Trophy className="w-6 h-6 mr-2" />
              Equipos Generados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={generarEquipos} className="w-full mb-4">Generar Equipos Equilibrados</Button>
            {equipos.length > 0 && (
              <div className="grid gap-4">
                {equipos.map((equipo, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>Equipo {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        {equipo.map((jugador, jugadorIndex) => (
                          <div key={jugadorIndex} className="mb-2 p-2 bg-blue-50 rounded">
                            <span className="font-semibold">{jugador.nombre}</span>
                            <div className="mt-1 grid grid-cols-2 gap-1">
                              {habilidades.map(({ clave, etiqueta, icono }) => (
                                <Badge key={clave} variant="secondary" className="text-xs flex items-center">
                                  {icono}
                                  <span className="ml-1">{etiqueta}: {jugador[clave]}</span>
                                </Badge>
                              ))}
                              <Badge variant="default" className="col-span-2">
                                General: {jugador.general}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                      <p className="mt-4 font-bold text-center">
                        Promedio del equipo: {calcularPromedioEquipo(equipo).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreadorEquiposFutbol;

