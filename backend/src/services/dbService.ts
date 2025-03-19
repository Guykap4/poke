export const dbService = require('knex')({
	client: 'mysql2',
	connection: {
		host: '',
		port: 3306,
		user: '',
		password: '',
		database: ''
	},
});