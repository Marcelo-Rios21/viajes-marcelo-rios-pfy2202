import jsonServer from 'json-server'
import { fileURLToPath } from 'node:url'
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

const app = jsonServer.create()
const yoga = createYoga({ schema })

const router = jsonServer.router(
  fileURLToPath(new URL('./db.json', import.meta.url)),
)

app.use(jsonServer.defaults())
app.use(yoga.graphqlEndpoint, yoga)

app.use((req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next()
  }

  return res.status(405).json({ error: 'Metodo no permitido' })
})

app.use(router)

const port = Number(process.env.PORT) || 4000

app.listen(port, '0.0.0.0', () => {
  console.log(`REST: http://localhost:${port}/destinos`)
  console.log(`GraphQL: http://localhost:${port}/graphql`)
})