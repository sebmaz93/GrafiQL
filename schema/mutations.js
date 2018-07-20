const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } = graphql;
const axios = require('axios');

const UserType = require('./user_type');
// const CompanyType = require('./company_type');

// Root Mutation ( add, edit, remove ) data
const Mutations = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addUser: {
			type: UserType, // the type that will return from this func
			args: {
				// the args that will pass to this func
				firstName: { type: new GraphQLNonNull(GraphQLString) }, // NonNull = must set Value
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, { firstName, age }) {
				return axios
					.post(`http://localhost:3000/users`, { firstName, age }) // {args} 2nd argument as BODY
					.then(res => res.data);
			}
		},
		deleteUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parentValue, { id }) {
				return axios
					.delete(`http://localhost:3000/users/${id}`)
					.then(res => res.data);
			}
		},
		editUser: {
			type: UserType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: GraphQLString },
				age: { type: GraphQLString },
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				return axios
					.patch(`http://localhost:3000/users/${args.id}`, args)
					.then(res => res.data);
			}
		}
	}
});

module.exports = Mutations;
