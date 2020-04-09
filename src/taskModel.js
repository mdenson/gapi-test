let base_url = 'https://www.googleapis.com/tasks/v1/lists/'; //<tasklist>/tasks

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

const rejectedHandler = (result) => {
    console.log('Error: ' + result.status + ': ' + result.result.error.message);
};

const Tasks = {
    tasks: [],
    clear: () => {},
    currentTask: { tasklist: '', title: '', notes: '' },
    delete: () => {},
    get: () => {},
    insert: ({ tasklist, ...params }) => {
        gapi.client.tasks.tasks
            .insert({
                tasklist: tasklist ? tasklist : '@default',
                ...params,
            })
            .then(function(response) {
                appendPre(
                    response.statusText +
                        ': ' +
                        response.result.title +
                        ' added to tasklist',
                );
            }, rejectedHandler(result));
    },
    list: (taskList) => {
        gapi.client.tasks.tasks
            .list({
                tasklist: taskList ? taskList : '@default',
                maxResults: 10,
            })
            .then(function(response) {
                appendPre('Tasks:');
                Tasks.tasks = response.result.items;
                if (Tasks.tasks && Tasks.tasks.length > 0) {
                    for (var i = 0; i < Tasks.tasks.length; i++) {
                        var task = Tasks.tasks[i];
                        appendPre(task.title + ' (' + task.notes + ')');
                    }
                } else {
                    appendPre('No tasks found.');
                }
            }, rejectedHandler(result));
    },
    move: () => {},
    patch: () => {},
    update: () => {},
};

export default Tasks;
