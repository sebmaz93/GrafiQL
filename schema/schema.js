const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;
const _ = require('lodash');

const users = [
	{ id: '89', firstName: 'Seb', age: 24 },
	{ id: '95', firstName: 'Astgh', age: 22 }
];

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt }
	}
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return _.find(users, { id: args.id });
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});
