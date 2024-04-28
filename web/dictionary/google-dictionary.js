const fs = require('fs'),
	_ = require('lodash'),
	https = require('https'),
	fetch = require('node-fetch'),
	// { JSDOM } = require('jsdom'),
	utils = require('./utils.js'),
	errors = require('./errors.js'),

	// { DOMParser } = new JSDOM().window,
    // parser = new DOMParser(),
	httpsAgent = new https.Agent({ keepAlive: true });

function transformV2toV1 (data) {
	return data.map((entry) => {
    	let {
    		meanings,
    		...otherProps
    	} = entry;
    
    	meanings = meanings.reduce((meanings, meaning) => {
    		let partOfSpeech, definitions;
    
    		({
    			partOfSpeech,
    			definitions
    		} = meaning);
    		meanings[partOfSpeech] = definitions;
    
    		return meanings;
    	}, {});
    
    	return {
    		...otherProps,
    		meaning: meanings
    	};
    });
}

function transform (word, language, data, { include }) {
	return data
	        .map(e => e.entry)
	        .filter(e => e)
			.reduce((accumulator, entry) => {
				if (!entry.subentries) { return accumulator.push(entry) && accumulator; }

				let { subentries } = entry,
					mappedSubentries;

				if (subentries.length > 1) {
					utils.logEvent(word, language, 'subentries length is greater than 1', { data });
				}

				if (entry.sense_families) {
					utils.logEvent(word, language, 'entry has subentries and sense families', { data });
				}

				if (entry.etymology) {
					utils.logEvent(word, language, 'entry has subentries and etymology', { data });
				}

				mappedSubentries = subentries
						.map((subentry) => {
							if (subentry.sense_families) {
								utils.logEvent(word, language, 'subentry has sense families', { data });
							}

							if (subentry.sense_family) {
								subentry.sense_families = [];
								subentry.sense_families.push(subentry.sense_family);
							}

							return _.defaults(subentry, _.pick(entry, ['phonetics', 'etymology']))
						})

				return accumulator.concat(mappedSubentries);
			}, [])
			.map((entry) => {
				let { headword, lemma, phonetics = [], etymology = {}, sense_families = [] } = entry;
				
				return {
					word: lemma || headword,
					phonetic: _.get(phonetics, '0.text'),
					phonetics: phonetics.map((e) => {
						return {
							text: e.text,
							audio: e.oxford_audio
						};
					}),
					origin: _.get(etymology, 'etymology.text'),
					meanings: sense_families.map((sense_family) => {
						let { parts_of_speech, senses = []} = sense_family;

						// if parts of speech is empty at this level.
						// Current hypothesis tells that it means only one sense is present
						// We need to take out parts_of_speech from it and use it.
						if (!parts_of_speech) {
							parts_of_speech = _.get(senses[0], 'parts_of_speech', []);

							if (senses.length > 1) {
								utils.logEvent(word, language, 'part of speech missing but more than one sense present', { data });
							}
						}
						
						if (parts_of_speech.length > 1) {
							utils.logEvent(word, language, 'more than one part of speech present', { data });
						}

						return {
							partOfSpeech: _.get(parts_of_speech[0], 'value'),
							definitions: senses.map((sense) => {							
								let { definition = {}, example_groups = [], thesaurus_entries = [] } = sense,
									result = {
										definition: definition.text,
										example: _.get(example_groups[0], 'examples.0'),
										synonyms: _.get(thesaurus_entries[0], 'synonyms.0.nyms', [])
											.map(e => e.nym),
										antonyms: _.get(thesaurus_entries[0], 'antonyms.0.nyms', [])
											.map(e => e.nym)
									};

								if (include.example) {
									result.examples =  _.reduce(example_groups, (accumulator, example_group) => {
										let example = _.get(example_group, 'examples', []);

										accumulator = accumulator.concat(example);

										return accumulator;
									}, []);
								}

								return result;
							})
						};
					})
				};
			});
}

async function queryInternet (word, language) {
	// https://www.google.com/async/callback:5493?fc=EswBCowBQU51V2hjbE5WRGtvSF8xdFZST093blpfczVHU1ZGQmxzWGFXR2FqRHFleDdad3V1MlN2S2hhLWtHdk1iM1o4TkxnZ3lURDRMMFNCMnJqVllQeXk1QkVqSFBLZG1rTzVQdGNEOFNkZXdreW5xZmZ3ckdYWlFsMEFGUE5DQVM2OWFNZV9GUXgxb2p3cU4SF3BXc1BadGpXRjhUdXNlTVB4ck9OaUE0GiJBUFhobTVhd3ZTVkJpZzZpekxYQUpDX0s3V2FVOU90ZkpR&fcv=3&vet=12ahUKEwiYvbHijKqFAxVEd2wGHcZZA-EQg4MCegQIDxAB..i&ved=2ahUKEwiYvbHijKqFAxVEd2wGHcZZA-EQu-gBegQIDxAK&bl=mAI8&s=web&opi=89978449&sca_esv=62a6ce05eaac911e&sca_upv=1&yv=3&oq=hello&gs_l=dictionary-widget.12..0l4.26142.27159.0.32318.5.5.0.0.0.0.205.701.0j4j1.5.0....0....1.64.dictionary-widget..0.5.701....0.tr5lq8jKWss&expnd=0&cs=0&async=term:hello,corpus:en,hhdr:false,hwdgt:true,wfp:true,ttl:,tsl:,ptl:,htror:false,_ck:xjs.s.JrvRdA_p_jA.L.W.O,_k:xjs.s.en_GB.-hE1fqiRdQ8.O,_am:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAIAkEAQAAFAAAAABAAAAAIJCABAAIACLELIQIEAQADAAhCCAn_8EAAAACAAAIGACAAAAXACAEIAgAAAIAAAAFAAAAAAAAAAAAGCAAP0AAAAAAAAAAAAAIBoQ_AAQAAABOIwgAAABAAAA5AF4HhgOUlgAAAAAAAAAAAAAQAASBHNA-gsCgAAAAAAAAAAAAAAAUmli5TEAaAI,_cssam:gAMKAQCAwKABAQAAAAAAAAAAAAAAEgBAAAAAACAEAAAQDhAANgQAwAdHAAACABAAAACCMAAAAEAQADAAACAAAAAAAIADCAAAIAQAAgQgQACJEGQgAAAJTDAgFQAYdwIAAEACAACAgAAAAgYgAHiIAAGAABAgAgFAEAAAOIwgAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAQA,_csss:ACT90oFARAYDlxSA_4WdgyioJY-F22tjQw,_fmt:prog,_id:fc_1

	let url = new URL('https://www.google.com/async/callback:5493');

	url.searchParams.set('fc', 'ErUBCndBTlVfTnFUN29LdXdNSlQ2VlZoWUIwWE1HaElOclFNU29TOFF4ZGxGbV9zbzA3YmQ2NnJyQXlHNVlrb3l3OXgtREpRbXpNZ0M1NWZPeFo4NjQyVlA3S2ZQOHpYa292MFBMaDQweGRNQjR4eTlld1E4bDlCbXFJMBIWU2JzSllkLVpHc3J5OVFPb3Q2aVlDZxoiQU9NWVJ3QmU2cHRlbjZEZmw5U0lXT1lOR3hsM2xBWGFldw');
	url.searchParams.set('fcv', '3');
	url.searchParams.set('async', `term:${encodeURIComponent(word)},corpus:${language},hhdr:false,hwdgt:true,wfp:true,ttl:,tsl:,ptl:,htror:false,_ck:xjs.s.JrvRdA_p_jA.L.W.O,_k:xjs.s.en_GB.-hE1fqiRdQ8.O,_am:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAIAkEAQAAFAAAAABAAAAAIJCABAAIACLELIQIEAQADAAhCCAn_8EAAAACAAAIGACAAAAXACAEIAgAAAIAAAAFAAAAAAAAAAAAGCAAP0AAAAAAAAAAAAAIBoQ_AAQAAABOIwgAAABAAAA5AF4HhgOUlgAAAAAAAAAAAAAQAASBHNA-gsCgAAAAAAAAAAAAAAAUmli5TEAaAI,_cssam:gAMKAQCAwKABAQAAAAAAAAAAAAAAEgBAAAAAACAEAAAQDhAANgQAwAdHAAACABAAAACCMAAAAEAQADAAACAAAAAAAIADCAAAIAQAAgQgQACJEGQgAAAJTDAgFQAYdwIAAEACAACAgAAAAgYgAHiIAAGAABAgAgFAEAAAOIwgAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAQA,_csss:ACT90oFARAYDlxSA_4WdgyioJY-F22tjQw,_fmt:prog,_id:fc_1`);

	url = url.toString();
	
	let response;
	try {
		response = await fetch(url, {
			agent: httpsAgent,
			headers: new fetch.Headers({
				"Accept": "*/*",
				"Accept-Encoding": "gzip, deflate, br",
				"Accept-Language": "en-US,en;q=0.9",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
			})
		});
	} catch (error) {
		console.error(error);
	}
	console.log('-----------1');
	if (response.status === 404) { throw new errors.NoDefinitionsFound({ reason: 'Website returned 404.'}); }

	if (response.status === 429) { throw new errors.RateLimitError(); }

	if (response.status !== 200) { throw new errors.NoDefinitionsFound({ reason: 'Threw non 200 status code.'}); }
	console.log('-----------2');

	let body = await response.text(),
		data = JSON.parse(body.substring(4)),
		single_results = _.get(data, 'feature-callback.payload.single_results', []),
			error = _.chain(single_results)
					.find('widget')
					.get('widget.error')
					.value()
	console.log('-----------3');

	if (single_results.length === 0) { throw new errors.NoDefinitionsFound({ word, language }); }

	if (error === 'TERM_NOT_FOUND_ERROR') { throw new errors.NoDefinitionsFound({ word, language }); }

	if (error) { throw new errors.UnexpectedError({ error }); }
	console.log('-----------1');

	return single_results;
}

async function fetchFromSource (word, language) {
	let dictionaryData = await queryInternet(word, language);
	return dictionaryData;
}

async function findDefinitions (word, language, { include }) {
	console.log('_____', word, language);
	let dictionaryData = await fetchFromSource(word, language);

	if (_.isEmpty(dictionaryData)) { throw new errors.UnexpectedError(); }

	const definitions = transform(word, language, dictionaryData, { include });

	body = JSON.stringify(definitions, (key, value) => {
		if (typeof value === 'object') { return value; }
		if (!value) { return value; }
		console.log('--------', value);
		// return parser
		// 	.parseFromString(value, "text/html")
		// 	.body.textContent;
	});
}

async function query () {
	try {
		const response = await fetch(url, {
			agent: httpsAgent,
			headers: new fetch.Headers({
				"Accept": "*/*",
				"Accept-Encoding": "gzip, deflate, br",
				"Accept-Language": "en-US,en;q=0.9",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
			})
		});
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	query,
	findDefinitions,
	transformV2toV1
};