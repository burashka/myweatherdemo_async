define(["dijit/registry", "aps/Message"],
    function (registry, Message) {
        return function(err) {
            // getting access to messages list in PageContainer widget
            var messages = registry.byId("top_container").get("messageList");
            // removing all messages (if any) from the screen
            messages.removeAll();
            // adding a new message with the error returned from the endpoint
            messages.addChild(new Message({description: JSON.parse(err.response.text).message, type: "error"}));
            // releasing the "Submit" button
            aps.apsc.cancelProcessing();
        };
    }
);