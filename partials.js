var theme = '...';
var blocks = ['nav'];

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

var selector = 'body > *:not(' + blocks.join(',') + ')';

var fs = require('fs-extra'),
	cheerio = require('cheerio');

files = fs.readdirSync('../themes/' + theme + '/src/');

fs.ensureDirSync('../themes/' + theme + '/templates');
fs.ensureDirSync('../themes/' + theme + '/blocks');
fs.ensureDirSync('../themes/' + theme + '/layouts');

for (i in files)
{
	if (!/.html$/.test(files[i])) continue;
	data = fs.readFileSync('../themes/' + theme + '/src/' + files[i], {encoding: 'utf8'});
	$ = cheerio.load(data);
	fs.writeFileSync('../themes/' + theme + '/templates/' + files[i], $.html(selector));
}

data = fs.readFileSync('../themes/' + theme + '/src/index.html', {encoding: 'utf8'});
$ = cheerio.load(data);

for (j in blocks)
{
	var sel = blocks[j];
	var str = blocks[j].replace(/[^a-zA-Z0-9]*|-|\./g, '');
	var html = $.html(blocks[j]);
	$(sel).replaceWith('{{' + str + '}}');
	fs.writeFileSync('../themes/' + theme + '/blocks/' + str + '.html', html);
}

$(selector).first().before('{{yield}}');
$(selector).remove();

fs.writeFileSync('../themes/' + theme + '/layouts/layout.html', $.html());

console.log("Done Extracting");
