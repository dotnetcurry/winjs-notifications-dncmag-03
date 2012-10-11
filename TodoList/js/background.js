(function () {
    "use strict";
    //
    // This var is used to get information about the current instance of the background task.
    //
    var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
    //
    // This function will do the work of your background task.
    //
    function doWork() {
        var key = null,
            settings = Windows.Storage.ApplicationData.current.localSettings;

        if (settings.values.reminders) {
            var jSon = JSON.parse(settings.values.reminders);

            var currentDate = new Date();

            var remindersToSet = [];

            for (var index = 0; index < jSon.length; index++) {

                var dataTime = new Date(jSon[index].dueDate.toString("r")).getMilliseconds();

                if (currentDate.getMilliseconds() >= dataTime) {
                    remindersToSet.push(jSon[index]);
                }
            }
        }

        key = backgroundTaskInstance.task.taskId.toString();
        settings.values[key] = JSON.stringify(remindersToSet);

        close();
    }

    doWork();

})()
