# Agencia de Viajes

Proyecto academico desarrollado con React, HTML, JavaScript y CSS.

La aplicacion permite explorar destinos turisticos y consultar vuelos y hoteles mediante servicios mock REST y GraphQL.

## Funcionalidades

- Listado de destinos con pais y actividades populares.
- Consulta de destinos mediante API REST.
- Consulta de vuelos y hoteles mediante API GraphQL.
- Visualizacion de precios, fechas y disponibilidad.
- Navegacion con React Router.
- Interfaz responsiva.
- Manejo de estados de carga y errores.

## Tecnologias

- React 19
- Vite 8
- React Router 8
- HTML, JavaScript y CSS
- JSON Server
- GraphQL y GraphQL Yoga
- Node.js
- Oxlint

## Requisitos

- Node.js 24
- npm

## Instalacion

Clonar el repositorio:

    git clone https://github.com/Marcelo-Rios21/viajes-marcelo-rios-pfy2202.git

Ingresar al proyecto:

    cd viajes-marcelo-rios-pfy2202

Instalar dependencias:

    npm install

## Ejecucion local

La aplicacion utiliza un frontend React y un backend unificado.

### Backend REST y GraphQL

En una terminal ejecutar:

    npm start

El servidor utiliza el puerto 4000.

Endpoints:

- REST: http://localhost:4000/destinos
- GraphQL: http://localhost:4000/graphql

### Frontend React

En otra terminal ejecutar:

    npm run dev

Abrir la direccion indicada por Vite, normalmente:

http://localhost:5173/

La configuracion local se encuentra en .env.development:

    VITE_API_BASE_URL=http://localhost:4000

## API REST mock

El endpoint GET /destinos devuelve los destinos disponibles.

Cada destino incluye:

- Identificador
- Nombre
- Pais
- Actividades populares

Los datos se encuentran en mock/db.json.

## API GraphQL mock

El endpoint POST /graphql permite consultar vuelos y hoteles utilizando el identificador del destino.

Ejemplo de consulta:

    query {
      vuelos(destinoId: "2") {
        aerolinea
        precio
        fechaSalida
        fechaLlegada
        disponible
      }
      hoteles(destinoId: "2") {
        nombre
        precioPorNoche
        fechaEntrada
        fechaSalida
        disponible
      }
    }

Los datos simulados se encuentran en mock/graphql-data.js.

Los precios estan expresados en pesos chilenos (CLP).

Las ofertas y disponibilidades son ficticias.

## Verificaciones

Comprobar el codigo:

    npm run lint

Generar la compilacion:

    npm run build

Probar la compilacion local:

    npm run preview

El backend debe estar funcionando para realizar las consultas REST y GraphQL.

## Publicacion

El proyecto contempla dos servicios:

- Frontend: GitHub Pages mediante GitHub Actions.
- Backend: servicio Node.js en Render.

El workflow se encuentra en:

    .github/workflows/deploy.yml

Para publicar el frontend, se debe configurar la variable VITE_API_BASE_URL en GitHub Actions con la direccion publica del backend.

El despliegue se ejecuta manualmente mediante el workflow.

## Repositorio

https://github.com/Marcelo-Rios21/viajes-marcelo-rios-pfy2202