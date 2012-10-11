(function () {
    "use strict";

    var appData = Windows.Storage.ApplicationData.current

    var todos = [];
   
    if (!appData.localSettings.values.todos) {
        appData.localSettings.values.todos = JSON.stringify(todos);
    }
    
    todos = JSON.parse(appData.localSettings.values.todos);
 
    function insertAtTop(item) {

        item.id = id();

        if (item.title != null) {
            todos = JSON.parse(appData.localSettings.values.todos);
            todos.splice(0, 0, item);

            appData.localSettings.values.todos = JSON.stringify(todos);

            data.items.splice(0, 0, item);
        }
    }

    function id() {
        return Math.floor(Math.random() * 100000000);
    }

    function remove(items) {
        todos = JSON.parse(appData.localSettings.values.todos);

        var removeIndex = 0;
        for (var index = 0; index < items.length; index++) {
            removeNotificaiton(todos[item.index]);
            todos.splice(item.index, 1);

            data.items.splice(index, 1);

            removeIndex++;
        }
        appData.localSettings.values.todos = JSON.stringify(todos);
    }

    function markAsCompleted(index) {
        todos = JSON.parse(appData.localSettings.values.todos);
        todos[index].completed = true;
        appData.localSettings.values.todos = JSON.stringify(todos);
        data.items.getAt(index).completed = true;
    }


    function removeNotificaiton(item)
    {
        var notifier = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
        var scheduled = notifier.getScheduledTileNotifications();

        for (var i = 0, len = scheduled.length; i < len; i++) {

            if (scheduled[i].id === item.id) {
                notifier.removeFromSchedule(scheduled[i]);
            }
        }
    }

    WinJS.Namespace.define("data", { 
        items: new WinJS.Binding.List(todos)
        , insertAtTop: insertAtTop
        , remove: remove
        , newId: id
        , markAsCompleted: markAsCompleted
    });

})();