const graphql = require('graphql');
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = graphql;
const axios = require('axios');

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

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
		company: {
			type: CompanyType,
			// Resolve because of Differnce in Real-Data in DB (companyID) and Graph-Type (company)
			resolve(parentValue, args) {
				return axios
					.get(`http://localhost:3000/companies/${parentValue.companyId}`)
					.then(res => res.data);
			}
		}
	})
});

// Declare ROOTQUERY
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		// to be able to access User type from RootQuery
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } }, // required args for user,
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
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios
					.get(`http://localhost:3000/companies/${args.id}`)
					.then(res => res.data);
			}
		}
	}
});

// Root Mutation ( add, edit, remove ) data
const Mutation = new GraphQLObjectType({
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

// Declare GQL schema and the RootQuery
module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
