const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull } = graphql;
const axios = require('axios');

const UserType = require('./user_type');

// Declaring the Schema Type
const CompanyType = new GraphQLObjectType({
	name: 'Company', // Each Type MUST have Name and Fields
	// wrap fields in Arrow Function , to not execute before UserType declares (JS closure)
	fields: () => ({
		id: { type: GraphQLString }, // Each Field has Type:
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		users: {
			type: new GraphQLList(UserType), // GQL-list because will return multiple users (list)
			// no args: because not going to specify what type of users to return
			resolve(parentValue, args) {
				return axios
					.get(`http://localhost:3000/companies/${parentValue.id}/users`)
					.then(res => res.data);
			}
		}
	})
});

module.exports = CompanyType;
