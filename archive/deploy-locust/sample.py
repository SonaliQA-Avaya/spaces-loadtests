from locust import HttpLocust, TaskSet, task


class MyTasks(TaskSet):

    @task()
    def heath(self):
        self.client.get("/health")


class MetricsLocust(HttpLocust):
    # instance of gke-spaces-default-pool-84da82bf-t22d
    host = 'http://10.240.0.10:30080'
    task_set = MyTasks
    max_wait = 50
    min_wait = 0
