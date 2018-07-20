const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = graphql;
const axios = require('axios');

const UserType = require('./user_type');
const CompanyType = require('./company_type');

// Declare ROOTQUERY
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		// to be able to access User type from RootQuery
		user: {
			type: UserType,
			args: { id: { type: new GraphQLNonNull(GraphQLString) } }, // required args for user,
			//give ID will give back the user from UserType
			// resolve func goes to db and grab the data
			resolve(parentValue, args) {
				return axios
					.get(`http://localhost:3000/users/${args.id}`)
					.then(res => res.data); // because axios returns { data :{ firstName:....}}
			}
		},
		// to be able to access Company type from RootQuery
		company: {
			type: CompanyType,
			args: { id: { type: new GraphQLNonNull(GraphQLString) } },
			resolve(parentValue, args) {
				return axios
					.get(`http://localhost:3000/companies/${args.id}`)
					.then(res => res.data);
			}
		}
	}
});

module.exports = RootQuery;
