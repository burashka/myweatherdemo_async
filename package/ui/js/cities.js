require([
    "aps/ResourceStore",
    "dijit/registry",
    "dojo/when",
    "aps/load",
    "dojox/mvc/at",
    "aps/Button",
    "aps/Container",
    "aps/ready!"
], function (ResourceStore, registry, when, load, at, Button, Container) {

    // creating a connector to APS controller
    // by specifying apsType we will get only resources of this type from APS controller
    var store = new ResourceStore({
        apsType: "http://myweatherdemo.com/async/city/1.0",
        target: "/aps/2/resources/"
    });

    var company = aps.context.vars.subscription_service;

    var widgets = (
        ["aps/PageContainer", {id: "top_container"}, [
            ["aps/Output", {
                content: "Here you can create subscriptions to track weather in other cities as well. <br><br>After you subscribe to weather in other cities go to <a href='http://www.myweatherdemo.com/login' target='_blank'>http://www.myweatherdemo.com/login</a> to login using username <b>${username}</b> and password <b>${password}</b>.<br><br>To see current weather for your cities click on 'Weather Information' tab once logged in.",
                username: at(company, "username"),
                password: at(company, "password")
            }],
            ["aps/Grid",
                {
                    id: "grid",
                    // when this aps/Grid is loaded store.query() will be automatically executed fetching list of all the cities from APS controller
                    store: store,
                    columns: [
                        { field: "city", name: "City"},
                        { field: "country", name: "Country" },
                        { field: "description", name: "Description" },
                        { field: "units", name: "Units of measurement" },
                        { field: "include_humidity", name: "Show Humidity?", renderCell: function(row, data) { return data ? "Yes" : "No"; } },
                        { field: "status", name: "Status", renderCell: function(row, status){

                            if (row.aps.status == "aps:provisioning") {

                                // if a resource in aps:provisioning status hasn't been updated for a long time
                                // this usually means that the task has failed
                                var THREE_MINUTES = 180000,
                                    last_updated = Date.parse(row.aps.modified),
                                    current = Date.now();

                                if (last_updated + THREE_MINUTES < current) {
                                        return "provisioning_failed";
                                } else {
                                    return status;
                                }
                            } else {
                                return status;
                            }
                        }},
                        // the resource displayed in this row can be accessed through 'row'
                        { field: "buttons", name: "Operations", renderCell: function(row){

                            var con = new Container({});

                            var editButton = new Button({
                                autoBusy: false,
                                iconClass: "sb-edit",
                                label: "Edit",
                                onClick: function() {
                                    aps.apsc.gotoView("city.edit", row.aps.id);
                                }
                            });

                            var deleteButton = new Button({
                                iconClass: "sb-delete",
                                label: "Delete",
                                onClick: function() {
                                    when(store.remove(row.aps.id), function() {
                                        var grid = registry.byId("grid");
                                        grid.refresh();
                                    });
                                }
                            });

                            // if city was sucessfully created in MyWeatherDemo we can allow modification and removal
                            if (row.status == "provisioned") {

                                con.addChild(editButton);
                                con.addChild(deleteButton);
                                return con;

                            // if there was a typo in country name the city object should be recreated, we cannot allow to modify it
                            } else if (row.status == "country_not_found") {

                                con.addChild(deleteButton);
                                return con;

                            // if city is in status 'provisioning' or provisioning failed we do not allow modification
                            // provisioning: company admin has to wait until provisioning either succeeds or fails
                            // provisioning_failed: it's up to the provider to fix the failed task
                            } else {
                                return "";
                            }
                        }}
                    ]
                },
                [["aps/Toolbar", [
                    ["aps/ToolbarButton", {
                        autoBusy: false,
                        iconClass: "sb-add-new",
                        label: "Add",
                        onClick: function() {
                            aps.apsc.gotoView("city.add");
                        }
                    }]
                ]]]
            ]
        ]]);
    load(widgets);
});
