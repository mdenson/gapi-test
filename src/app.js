import m from 'mithril';
import Tasks from './taskModel';

//import {google} from 'googleapis';

//import { MDCRipple } from '@material/ripple/index';
//import '@material/mwc-button';

// Client ID and API key from the Developer Console
var CLIENT_ID = '';
var API_KEY = '';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest',
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
//var SCOPES = 'https://www.googleapis.com/auth/tasks.readonly';
var SCOPES = 'https://www.googleapis.com/auth/tasks';

//var authorizeButton = document.getElementById('authorize_button');
//var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
window.handleClientLoad = () => {
    gapi.load('client:auth2', initClient);
};

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client
        .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
        })
        .then(
            function() {
                // Listen for sign-in state changes.
                gapi.auth2
                    .getAuthInstance()
                    .isSignedIn.listen(updateSigninStatus);

                // Handle the initial sign-in state.
                updateSigninStatus(
                    gapi.auth2.getAuthInstance().isSignedIn.get(),
                );
                let authorizeButton = document.getElementById(
                    'authorize_button',
                );
                let signoutButton = document.getElementById('signout_button');
                authorizeButton.onclick = handleAuthClick;
                signoutButton.onclick = handleSignoutClick;
            },
            function(error) {
                appendPre(JSON.stringify(error, null, 2));
            },
        );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    let authorizeButton = document.getElementById('authorize_button');
    let signoutButton = document.getElementById('signout_button');

    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listTaskLists();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print task lists.
 */
function listTaskLists() {
    gapi.client.tasks.tasklists
        .list({
            maxResults: 10,
        })
        .then(function(response) {
            appendPre('Task Lists:');
            var taskLists = response.result.items;
            if (taskLists && taskLists.length > 0) {
                for (var i = 0; i < taskLists.length; i++) {
                    var taskList = taskLists[i];
                    appendPre(taskList.title + ' (' + taskList.id + ')');
                }
            } else {
                appendPre('No task lists found.');
            }
        });
}

let root = document.getElementById('app');

function addTaskHandler(e) {
    e.preventDefault();
    Tasks.insert(Tasks.currentTask); //relies on default behavior
}

function listTasksHandler(e) {
    Tasks.list();
}

// create rfc3339 date as needed by googleapis
//const date = new Date();
//RFC 3339 format
//const formatted = date.toISOString();

const Hello = {
    view: () => {
        return m('main', [
            m('p', 'Google Tasks API Quickstart'),
            m(
                'button#authorize_button',
                {
                    style: 'display: none;',
                    onclick: handleAuthClick,
                },
                'Authorize',
            ),
            m(
                'button#signout_button',
                {
                    style: 'display: none;',
                    onclick: handleSignoutClick,
                },
                'Sign Out',
            ),
            m('pre#content'),
            m('div', [
                m(
                    'form',
                    {
                        onsubmit: addTaskHandler,
                    },
                    [
                        m('label.label', 'Title'),
                        m('input.input[type=text]', {
                            oninput: (e) => {
                                Tasks.currentTask.title = e.target.value;
                            },
                            value: Tasks.currentTask.title,
                        }),
                        m('label.label', 'Description'),
                        m('input.input[type=text]', {
                            oninput: (e) => {
                                Tasks.currentTask.notes = e.target.value;
                            },
                            value: Tasks.currentTask.notes,
                        }),
                        m('button[type=submit]', 'Add Task'),
                    ],
                ),
            ]),
            m('div', [
                m(
                    'button',
                    {
                        onclick: listTasksHandler,
                    },
                    'List Tasks',
                ),
            ]),
        ]);
    },
};

m.mount(root, Hello);
// insert you application code here

//const ripple = new MDCRipple(document.querySelector('.foo-button'));
