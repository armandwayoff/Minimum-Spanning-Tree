import matplotlib.pyplot as plt
import networkx as nx
from math import sqrt
from random import randint


class Vertex:
    def __init__(self, x, y):
        self.x = x
        self.y = y


def dist(x1, y1, x2, y2):
    return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)


NUMBER_VERTICES = 100
WIDTH = HEIGHT = 100  # dimension of the canvas
VERTEX_SIZE = 150

vertices = []
reached_vertices = []
unreached_vertices = []

adjacency_matrix = [[0 for col in range(NUMBER_VERTICES)] for row in range(NUMBER_VERTICES)]

G = nx.Graph()

print("* Minimum Spanning Tree *")
print("Number of vertices :", NUMBER_VERTICES, "| Dimensions of the canvas : (" + str(WIDTH), ";", str(HEIGHT) + ")\n")
print("Vertices coordinates :")
for i in range(NUMBER_VERTICES):
    new_vertex = Vertex(randint(0, WIDTH), randint(0, HEIGHT))
    vertices.append(new_vertex)
    unreached_vertices.append(new_vertex)
    G.add_node(i, pos=(new_vertex.x, new_vertex.y))
    print(i, ": (" + str(new_vertex.x), ";", str(new_vertex.y) + ")")

reached_vertices.append(vertices[0])
del unreached_vertices[0]

while len(unreached_vertices) > 0:
    record_distance = dist(0, 0, WIDTH, HEIGHT)
    global reached_index, unreached_index

    for i in range(len(reached_vertices)):
        for j in range(len(unreached_vertices)):
            v1 = reached_vertices[i]
            v2 = unreached_vertices[j]
            d = dist(v1.x, v1.y, v2.x, v2.y)
            if d < record_distance:
                record_distance = d
                reached_index = i
                unreached_index = j
    a = vertices.index(reached_vertices[reached_index])
    b = vertices.index(unreached_vertices[unreached_index])
    adjacency_matrix[a][b] = 1
    adjacency_matrix[b][a] = 1
    G.add_edge(a, b)
    reached_vertices.append(unreached_vertices[unreached_index])
    del unreached_vertices[unreached_index]

print("Adjacency matrix :")
for row in adjacency_matrix:
    print(*row)

pos = nx.get_node_attributes(G, 'pos')
nx.draw(G, pos, node_size=VERTEX_SIZE, node_color='orange')
plt.show()
