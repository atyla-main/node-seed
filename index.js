//Fetching modules and environment setup
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const Joi = require('joi');
const port = process.env.PORT || 3000;


//Fetching database datas (fake)
const icos = [
	{ id: 1, name: 'ico1' },
	{ id: 2, name: 'ico2' },
	{ id: 3, name: 'ico3' }
];


//Midlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

//JOI validation schemas
function validateCourse(course){
	const schema = {
		name: Joi.string().min(3).required()
	};

	return Joi.validate(course, schema)
}


//GET routes
app.get('/', (req, res) => {
	res.render('index', {
		var1: 'Test numéro 1',
		icos : icos
	});
});

app.get('/api/icos', (req, res) => {
	res.json(icos);
});

app.get('/api/icos/:id', (req, res) => {
	const ico = icos.find(c => c.id === parseInt(req.params.id));
	if (!ico) return res.status(404).send('ICO non trouvée');
	res.json(ico);
});


//Post routes
app.post('/api/icos', (req, res) => {
	const {error} = validateCourse(req.body);
	if (error) return res.status(400).send(error.details[0].message);
		
	const ico = {
		id: icos.length + 1,
		name: req.body.name
	}
	icos.push(ico);
	res.json(ico);
});


//Put routes
app.put('/api/icos/:id', (req, res) => {
	const ico = icos.find(c => c.id === parseInt(req.params.id));
	if (!ico) return res.status(404).send('ICO non trouvée');

	const {error} = validateCourse(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	ico.name = req.body.name;
	res.json(ico);
});


//Delete routes
app.delete('/api/icos/:id', (req, res) => {
	const ico = icos.find(c => c.id === parseInt(req.params.id));
	if (!ico) return res.status(404).send('ICO non trouvée');

	const index = icos.indexOf(ico);
	icos.splice(index, 1);
	res.json(ico);
});


//Starting the server
app.listen(port, () => console.log(`Listening on port ${port}...`))