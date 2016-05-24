hintSets = {};
hints = [];
hintsDict = {};

hintSets['Triple Threat'] = [
	{
		id: 'human',
		desc: 'The criminal appeared to be human.',
		query: {'species': 'Human'}
	},
	{
		id: 'robot',
		desc: 'The criminal appeared to be a robot.',
		query: {'species': 'Robot'}
	},
	{
		id: 'alien',
		desc: 'The criminal appeared to be an alien.',
		query: {'species': 'Alien'}
	},
	{
		id: '<=100',
		desc: 'The criminal looked at most 1 metre tall.',
		query: {'height': {$lte: 100}}
	},
	{
		id: '101-149',
		desc: 'The criminal looked between 100cm and 150cm tall.',
		query: {'height': {$gt: 100, $lt: 150}}
	},
	{
		id: '>=150',
		desc: 'The criminal looked at least 150cm tall.',
		query: {'height': {$gte: 150}}
	},
	{
		id: 'male',
		desc: 'The criminal appeared to be male.',
		query: {'gender': 'Male'}
	},
	{
		id: 'female',
		desc: 'The criminal appeared to be female.',
		query: {'gender': 'Female'}
	},
];

hintSets['Double Trouble'] = [
	{
		id: 'male',
		desc: 'The criminal appeared to be male.',
		query: {'gender': 'Male'}
	},
	{
		id: 'female',
		desc: 'The criminal appeared to be female.',
		query: {'gender': 'Female'}
	},
	{
		id: 'young',
		desc: 'The criminal appeared to be young.',
		query: {'age': 'Young'}
	},
	{
		id: 'old',
		desc: 'The criminal appeared to be old.',
		query: {'age': 'Old'}
	},
	{
		id: 'short',
		desc: 'The criminal appeared to be short.',
		query: {'height': 'Short'}
	},
	{
		id: 'tall',
		desc: 'The criminal appeared to be tall.',
		query: {'height': 'Tall'}
	},
	{
		id: 'human',
		desc: 'The criminal appeared to be human.',
		query: {'species': 'Human'}
	},
	{
		id: 'zombie',
		desc: 'The criminal appeared to be a zombie.',
		query: {'species': 'Zombie'}
	},
];
