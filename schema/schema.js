const graphql = require('graphql');
const { GraphQLSchema } = graphql;

const RootQuery = require('./root_query');
const Mutations = require('./mutations');

// Declare GQL schema and the RootQuery
module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutations
});
