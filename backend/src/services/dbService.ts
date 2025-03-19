export const dbService = require('knex')({
	client: 'mysql2',
	connection: {
		host: '127.0.0.1',
		port: 3306,
		user: 'root',
		password: 'q1w2e3r4t5',
		database: 'sys'
	},
});