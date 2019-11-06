(function() {
  var cv = [
    {
      n: "BACKEND",
      h: [
        {
          n: "PHP",
          h: []
        },
        {
          n: "nodeJS",
          h: [
            {
              n: "express",
              h: []
            }
          ]
        },
        {
          n: "python",
          h: [
            {
              n: "flask",
              h: []
            },
            {
              n: "selenium",
              h: []
            }
          ]
        }
      ]
    },

    {
      n: "FRONTEND",
      h: [
        {
          n: "javascript",
          h: [
            {
              n: "angular4-6",
              h: []
            },
            {
              n: "reactJS",
              h: []
            },
            {
              n: "JQuery",
              h: []
            }
          ]
        },
        {
          n: "CSS",
          h: [
            {
              n: "SASS",
              h: []
            }
          ]
        },
        {
          n: "HTML",
          h: [
            {
              n: "Bootstrap4",
              h: []
            }
          ]
        },
        {
          n: "SVG",
          h: [
            {
              n: "D3.js",
              h: []
            }
          ]
        },
        {
          n: "deploy",
          h: [
            {
              n: "webpack",
              h: []
            },
            {
              n: "babel",
              h: []
            }
          ]
        }
      ]
    },

    {
      n: "DATABASE",
      h: [
        {
          n: "SQL",
          h: [
            {
              n: "postgreSQL",
              h: []
            },
            {
              n: "mySQL",
              h: []
            }
          ]
        },
        {
          n: "noSQL",
          h: [
            {
              n: "MongoDB",
              h: []
            },
            {
              n: "DynamoDB",
              h: []
            },
            {
              n: "Firestore",
              h: []
            }
          ]
        }
      ]
    },

    {
      n: "CLOUD",
      h: [
        {
          n: "AWS",
          h: []
        },
        {
          n: "gCloud",
          h: []
        }
      ]
    }
  ];

  var nodos = [];
  var links = [];

  (function crearNodos(hijos, padre = "", nivel = 0) {
    for (var i = 0; i < hijos.length; i++) {
      nodos.push({
        id: hijos[i].n.replace(" ", "_"),
        n: hijos[i].n,
        nivel: nivel
      });

      if (padre != "") {
        links.push({
          source: padre,
          target: hijos[i].n.replace(" ", "_"),
          value: 10,
          nivel: nivel
        });
      }

      if (hijos[i].h.length > 0) {
        crearNodos(hijos[i].h, hijos[i].n.replace(" ", "_"), nivel + 1);
      }
    }
  })(cv);

  var graph_container = document.getElementById("graph-container");
  var width = graph_container.offsetWidth,
    height = graph_container.offsetHeight;
  var radius = 25;
  var svg = d3
    .select("svg")
    .attr("width", width)
    .attr("height", height);

  var outter_force = 0.08;
  var simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3.forceLink().id(function(d) {
        return d.id;
      })
    )
    .force("charge", d3.forceManyBody())
    .force(
      "collide",
      d3.forceCollide(function(d) {
        return radius;
      })
    )
    .force("force_bottom", d3.forceY(height).strength(outter_force))
    .force("force_top", d3.forceY().strength(outter_force))
    .force("force_left", d3.forceX().strength(outter_force))
    .force("force_right", d3.forceX(width).strength(outter_force))
    .force("center", d3.forceCenter(width / 2, height / 2));

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", function(d) {
      return 1;
    });

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("text")
    .data(nodos)
    .enter()
    .append("text")
    .text(function(d, i) {
      return d.n;
    })
    .style("fill", "#555")
    .style("font-family", "Arial")
    .style("font-size", function(d) {
      return 18 - 4 * d.nivel;
    })
    .style("font-weight", function(d) {
      return d.nivel < 1 ? "bold" : "100";
    })
    .attr("r", function(d) {
      return radius;
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  simulation.nodes(nodos).on("tick", ticked);

  simulation
    .force("link")
    .links(links)
    .distance(function(link) {
      return 50 / (2 * link.nivel + 1);
    })
    .strength(function(link) {
      return 2.5;
    });

  function ticked() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      });
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
})();
