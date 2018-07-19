const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const app = express();

app.use(
	'/graphql',
	expressGraphQL({
		schema, // schema : schema we made
		graphiql: true
	})
);

app.listen(4000, () => {
	console.log('listening on port 4000');
});
