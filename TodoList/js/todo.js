(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var gestureRecognizer = new Windows.UI.Input.GestureRecognizer();
    var notification = Windows.UI.Notifications;
    var settings = Windows.Storage.ApplicationData.current.localSettings;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var lastElement;
    var currentIndex = 0;
    var listView;

    ui.Pages.define("/todo.html", {

        ready: function (element, options) {

            element.querySelector(".todo-text").addEventListener("keypress", function (e) {
                if (e.keyCode == 13) {
                    var newId = data.newId();
                    data.insertAtTop({
                        title: this.value, id: newId, completed: false
                    });
                    this.value = "";
                }
            });

            listView = todoList.winControl;

            ui.setOptions(listView, {
                itemTemplate: element.querySelector(".item-template"),
                itemDataSource: data.items.dataSource
            });
          
            btnClose.addEventListener("click", closeFlyout);
            btnDone.addEventListener("click", setReminderHandler);

            document.getElementById("cmdRemove").addEventListener("click", removeTodoHandler);
            document.getElementById("cmdRemind").addEventListener("click", showFlyoutHandler);
            document.getElementById("cmdDone").addEventListener("click", markAsCompleteHandler);
        }
    });

    function showFlyoutHandler(e) {
        remiderFlyout.winControl.show(this, "auto");
    }

    function closeFlyout(e) {
        remiderFlyout.winControl.hide();
    }

    function removeTodoHandler() {
        var items = [];

        forEachSelection(function (item) {
            items.push(item);
        });

        data.remove(items);
    }

    function markAsCompleteHandler() {
        forEachSelection(function (item) {
            data.markAsCompleted(item.index);
        });
    }

    function setReminderHandler() {
        forEachSelection(function (item) {

            var jSon = [];

            if (settings.values.reminders) {
                jSon = JSON.parse(settings.values.reminders);
            }

            var matched = false;

            for (var index = 0; index < jSon.length; index++) {
                if (jSon[index].id == data.id && jSon[index].dueDate < datePicker.winControl.current) {
                    matched = true;
                }
            }

            if (!matched) {
                jSon.push({ id: item.data.id, title: item.data.title, dueDate: datePicker.winControl.current });
                settings.values.reminders = JSON.stringify(jSon);
            }

        });
        remiderFlyout.winControl.hide();
    }

    function forEachSelection(callback) {
        var selection = listView.selection;
        var items = selection.getItems();

        selection.getItems().then(function (items) {
            for (var index = 0; index < items.length ; index++) {
                callback(items[index]);
            }
        });
        selection.clear();
    }


})();