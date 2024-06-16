from cassandra.cluster import Cluster


def connect(host = "127.0.0.1",port=9042,nodes=3,keyspace=None):

    print("Connecting to cluster...")
    cluster = Cluster([(host,p) for p in range(port,port+nodes)])
    session = cluster.connect(keyspace)
    return session