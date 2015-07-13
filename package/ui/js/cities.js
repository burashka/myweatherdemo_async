require([
    "aps/ResourceStore",
    "dijit/registry",
    "dojo/when",
    "aps/load",
    "dojox/mvc/at",
    "aps/xhr",
    "aps/Button",
    "./js/displayError.js",
    "aps/ready!"
], function (ResourceStore, registry, when, load, at, xhr, Button, displayError) {

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
                    // user can select several rows
                    selectionMode: "multiple",
                    // when this aps/Grid is loaded store.query() will be automatically executed fetching list of all the cities from APS controller
                    store: store,
                    columns: [
                        // resourceName attribute on a column specifies which column value should be displayed as a link
                        { field: "city", name: "City"},
                        { field: "country", name: "Country" },
                        { field: "description", name: "Description" },
                        { field: "units", name: "Units of measurement" },
                        { field: "include_humidity", name: "showHumidity" },
                        { field: "status", name: "status", renderCell: function(row, status){

                            if (row.aps.status == "aps:provisioning") {

                                var TWO_MINUTES = 120000,
                                    last_updated = Date.parse(row.aps.modified),
                                    current = Date.now();

                                if (last_updated + TWO_MINUTES < current) {
                                        return "provisioning_failed";
                                } else {
                                    return status;
                                }
                            } else {
                                return status;
                            }
                        }},
                        { field: "status_message", name: "status_message"},
                        { field: "edit", name: "edit", renderCell: function(row){
                            if (row.status == "provisioned") {
                                return new Button({ iconClass: "sb-edit", label: "Edit",
                                    onClick: function() {
                                        aps.apsc.gotoView("city.edit", row.aps.id);
                                    }
                                });
                            } else {
                                return "";
                            }
                        }}
                    ]
                },
                [["aps/Toolbar", [
                    ["aps/ToolbarButton", {
                        // button will not be disabled after click
                        autoBusy: false,
                        // using predefined button icon
                        iconClass: "sb-add-new",
                        label: "Add",
                        onClick: function() {
                            // gotoView() allows us to conditionally redirect the user to a specific view
                            aps.apsc.gotoView("city.add");
                        }
                    }],
                    ["aps/ToolbarButton", {
                        autoBusy: false,
                        requireItems: true,
                        iconClass: "sb-delete",
                        label: "Delete",
                        onClick: function() {
                            // getting access to user selection in aps/Grid
                            var grid = registry.byId("grid");
                            var sel = grid.get("selectionArray");
                            for (var i=0; i<sel.length; i++){
                                // deleting each selected city
                                when(store.remove(sel[i]), function() {
                                    // if city was successfully removed from MyWeatherDemo: removing selection from selectionArray
                                    sel.splice(sel.indexOf(i),1);
                                    // refreshing data in a grid to not show cities which were already removed from the store
                                    grid.refresh();
                                }, function(err) {
                                    // if there was a problem removing a city from MyWeatherDemo: showing the error message to the user
                                    displayError(err);
                                });
                            };
                        }
                    }]
                ]]]
            ]
        ]]);
    load(widgets);
});