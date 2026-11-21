import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'
import { vuelos, hoteles } from './graphql-data.js'

const schema = createSchema({
  typeDefs: `
    type Vuelo {
      id: ID!
      destinoId: ID!
      aerolinea: String!
      precio: Int!
      fechaSalida: String!
      fechaLlegada: String!
      disponible: Boolean!
    }

    type Hotel {
      id: ID!
      destinoId: ID!
      nombre: String!
      precioPorNoche: Int!
      fechaEntrada: String!
      fechaSalida: String!
      disponible: Boolean!
    }

    type Query {
      vuelos(destinoId: ID!): [Vuelo!]!
      hoteles(destinoId: ID!): [Hotel!]!
    }
  `,
  resolvers: {
    Query: {
      vuelos: (_, { destinoId }) =>
        vuelos.filter((vuelo) => vuelo.destinoId === destinoId),

      hoteles: (_, { destinoId }) =>
        hoteles.filter((hotel) => hotel.destinoId === destinoId),
    },
  },
})

const yoga = createYoga({ schema })
const server = createServer(yoga)

server.listen(4000, () => {
  console.log('GraphQL disponible en http://localhost:4000/graphql')
})