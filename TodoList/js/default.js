// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));

            registerBackgroundTask();
        }
    };

    function registerBackgroundTask() {
        var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();

        if (isTaskRegistered(BackgroundTaskHandler.taskName)) {
            unregisterFeedSyncTask(BackgroundTaskHandler.taskName);
        }

        builder.name = BackgroundTaskHandler.taskName;
        builder.taskEntryPoint = "js\\background.js";
        builder.setTrigger(new Windows.ApplicationModel.Background.SystemTrigger(Windows.ApplicationModel.Background.SystemTriggerType.timeZoneChange, false));

        var task = builder.register();

        BackgroundTaskHandler.attachCompleteHandler(task);
    }

    function isTaskRegistered(taskName) {
        var taskRegistered = false;

        var background = Windows.ApplicationModel.Background;
        var iter = background.BackgroundTaskRegistration.allTasks.first();

        while (iter.hasCurrent) {

            var task = iter.current.value;

            if (task.name === taskName) {

                taskRegistered = true;
                break;
            }

            iter.moveNext();
        }
        return taskRegistered;
    }

    function unregisterFeedSyncTask(taskName) {
        var iter = Windows.ApplicationModel.Background.BackgroundTaskRegistration.allTasks.first();
        var hascur = iter.hasCurrent;
        while (hascur) {
            var cur = iter.current.value;
            if (cur.name === taskName) {
                cur.unregister(true);
            }
            hascur = iter.moveNext();
        }
    }

    app.oncheckpoint = function (args) {
        app.sessionState.history = nav.history;
    };

    app.start();
})();
