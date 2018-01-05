var cv = [
	{
		'n': 'obtencion datos',
		'h': [
			{
				'n': 'scraping',
				'h': [
					{
						'n': 'selenium',
						'h': []
					},
					{
						'n': 'requests',
						'h': []
					},
					{
						'n': 'beautifulSoup',
						'h': []
					}
				]
			},
			{
				'n': 'BD',
				'h': [
					{
						'n': 'mySQL',
						'h': []
					},
					{
						'n': 'postgreSQL',
						'h': []
					},
					{
						'n': 'mongoDB',
						'h': []
					},
					{
						'n': 'firebase',
						'h': []
					},
					{
						'n': 'neo4j',
						'h': []
					}
				]
			},
			{
				'n': 'formatos',
				'h': [
					{
						'n': 'csv',
						'h': []
					},
					{
						'n': 'xml',
						'h': []
					},
					{
						'n': 'json',
						'h': []
					},
					{
						'n': 'txt',
						'h': []
					}
				]
			}
		]
	},
	{
		'n': 'manipulación',
		'h': [
			{
				'n': 'pandas',
				'h': []
			},
			{
				'n': 'numpy',
				'h': []
			},
			{
				'n': 'matplotlib',
				'h': []
			}
		]
	},
	{
		'n': 'modelos',
		'h': [
			{
				'n': 'predicción',
				'h': [
					{
						'n': 'regresiones lineales',
						'h': []
					},
					{
						'n': 'SVR',
						'h': []
					},
					{
						'n': 'Arbol de Decisión',
						'h': []
					},
					{
						'n': 'Random Forest',
						'h': []
					}
				]
			},
			{
				'n': 'clasificación',
				'h': [
					{
						'n': 'regresiones log',
						'h': []
					},
					{
						'n': 'Vecinos cercanos',
						'h': []
					},
					{
						'n': 'SVM',
						'h': []
					},
					{
						'n': 'PLN (lenguaje natural)',
						'h': []
					}
				]
			},
			{
				'n': 'clusterización',
				'h': [
					{
						'n': 'K-Means',
						'h': []
					},
					{
						'n': 'Cluster jerárquico',
						'h': []
					}
				]
			},
			{
				'n': 'reducción',
				'h': [
					{
						'n': 'ACP',
						'h': []
					}
				]
			},
			{
				'n': 'redes neuronales',
				'h': [
					{
						'n': 'ANN',
						'h': []
					},
					{
						'n': 'redes convolucionales',
						'h': []
					},
					{
						'n': 'keras - tensorflow',
						'h': []
					}
				]
			}
		]
	},
	{
		'n': 'reportería',
		'h': [
			{
				'n': 'd3js',
				'h': []
			},
			{
				'n': 'tableau',
				'h': []
			},
			{
				'n': 'google charts',
				'h': []
			},
			{
				'n': 'librerias js',
				'h': []
			}
		]
	},
	{
		'n': 'cloud',
		'h': [
			{
				'n': 'amazon AWS',
				'h': [
					{
						'n': 'EC2',
						'h': []
					},
					{
						'n': 'S3',
						'h': []
					},
					{
						'n': 'Route53',
						'h': []
					},
					{
						'n': 'RDS',
						'h': []
					}
				]
			}
		]
	},
	{
		'n': 'desarrollo',
		'h': [
			{
				'n': 'PHP',
				'h': []
			},
			{
				'n': 'nodeJS',
				'h': []
			},
			{
				'n': 'CSS',
				'h': []
			},
			{
				'n': 'HTML5',
				'h': []
			}
		]
	}
];

var nodos = [];
var links = [];


function crearNodos(hijos, padre = '', nivel = 0) {
	for (var i=0; i < hijos.length; i++) {
		nodos.push({
			'id': hijos[i].n.replace(' ', '_'),
			'n': hijos[i].n,
			'nivel': nivel
		});
		
		if (padre != '') {
			links.push({
				"source": padre, 
				"target": hijos[i].n.replace(' ', '_'), 
				"value": 10,
				"nivel": nivel
			});
		}
		
		if (hijos[i].h.length > 0) {
			crearNodos(hijos[i].h, hijos[i].n.replace(' ', '_'), (nivel + 1));
		}
	}
}

crearNodos(cv);

var graph_container = $('#graph-container');
var width = graph_container.width(), height = graph_container.height();
var radius = 25;
var svg = d3.select("svg")
			.attr("width", width)
			.attr("height", height);

var simulation = d3.forceSimulation()
					.force("link", d3.forceLink().id(function(d) { return d.id; }))
					.force("charge", d3.forceManyBody())
					.force("collide", d3.forceCollide(function(d) { return radius; }))
					.force("force_bottom", d3.forceY(height).strength(0.2))
					.force("force_top", d3.forceY().strength(0.2))
					.force("force_left", d3.forceX().strength(0.15))
					.force("force_right", d3.forceX(width).strength(0.15))
					.force("center", d3.forceCenter(width / 2, height / 2));
					

var link = svg.append("g")
	.attr("class", "links")
	.selectAll("line")
	.data(links)
	.enter().append("line")
	.attr("stroke-width", function(d) { return 1; });


var node = svg.append("g")
	.attr("class", "nodes")
	.selectAll("text")
	.data(nodos)
	.enter().append("text")
	.text(function(d, i) { return d.n; })
	.style("fill", "#555")
	.style("font-family", "Arial")
	.style("font-size", function(d) { return 18 - 4*d.nivel;})
	.style("font-weight", function(d) { return (d.nivel < 1 ? 'bold' : '100')})
	.attr("r", function(d) { return radius; })
	.call(d3.drag()
	.on("start", dragstarted)
	.on("drag", dragged)
	.on("end", dragended));
	

simulation
	.nodes(nodos)
	.on("tick", ticked);


simulation.force("link")
	.links(links)
	.distance(function(link) { return 50/(2*link.nivel+1); })
	.strength(function(link) { return 3; });


function ticked() {
	link
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

	node
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; });
}

function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
}

function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}

function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
}