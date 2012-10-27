BackgroundTaskHandler = {
    taskName: "reminderTask",

    attachCompleteHandler: function (task) {
        task.addEventListener("completed", new BackgroundTaskHandler.completeHandler(task).onCompleted);
    },

    completeHandler: function (task) {
        _this = this;
        this.onCompleted = function (arg) {
            var settings = Windows.Storage.ApplicationData.current.localSettings;
            var reminders  = JSON.parse(settings.values[task.taskId]);
            for (var index = 0 ; index < reminders.length; index++) {
                _this.scheduleTile(reminders[index]);
            }
        }
        ,this.scheduleTile = function (data) {

            // get a XML DOM version of a specific template by using getTemplateContent
            var tileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(Windows.UI.Notifications.TileTemplateType.tileWideText09);

            var text = tileXml.getElementsByTagName("text");

            text[0].appendChild(tileXml.createTextNode(data.title));

            text[1].appendChild(tileXml.createTextNode(new Date(data.dueDate.toString("r")).toLocaleString()));

            var currentDate = new Date();
            var seconds = 60;
        
            if (currentDate.getMilliseconds() >= new Date(data.dueDate.toString("r")).getMilliseconds()) {
                data.dueDate = new Date(currentDate.getTime() + 60 * 1000);
                // create the notification from the XML
                var tileNotification = new Windows.UI.Notifications.ScheduledTileNotification(tileXml, data.dueDate);
                tileNotification.id = data.id;

                // Add to schedule
                // You can update a secondary tile in the same manner using CreateTileUpdaterForSecondaryTile(tileId)
                // See "Tiles" sample for more details
                Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().addToSchedule(tileNotification);
            }
        }
    }

}