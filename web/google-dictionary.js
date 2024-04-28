const fs = require('fs');
const { request } = require('./requst');

const options = {
  hostname: 'https://api.dictionaryapi.dev',
  port: 443,
  path: '/api/v2/entries/en/',
  method: 'GET',
};

exports.dictionary = async (word, language = 'en') => {
	const path = `${__dirname}/dictionary/${word}.json`;
	if (fs.existsSync(path)) {
		return new Promise((resolve) => {
			fs.readFile(path, (err, data) => {
				if (err) throw err;
				resolve(JSON.parse(data));
			  });
		});
	}
	const response = await request({...options, path: `/api/v2/entries/${language}/${word}`});
	fs.writeFile(path, JSON.stringify(response), (err) => {
		if (err) console.error(err);
		console.log('The file has been saved!');
	  });
	return response;
}
