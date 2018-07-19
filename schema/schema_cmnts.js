const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;
const _ = require('lodash');
const axios = require('axios');

// Declaring the Schema Type
const UserType = new GraphQLObjectType({
	name: 'User', // Each Type MUST have Name and Fields
	fields: {
		id: { type: GraphQLString }, // Each Field has Type:
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt }
	}
});

// Declare ROOTQUERY
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } }, // required args for user,
			//give ID will give back the user from UserType
			// resolve func goes to db and grab the data
			resolve(parentValue, args) {
				// return _.find(users, { id: args.id });
				// _ go through all users and give 1st user with the ID
				return axios
					.get(`http://localhost:3000/users/${args.id}`)
					.then(res => res.data); // because axios returns { data :{ firstName:....}}
			}
		}
	}
});

// Declare GQL schema and the root query
module.exports = new GraphQLSchema({
	query: RootQuery
});
