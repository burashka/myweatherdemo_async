require([
    "aps/ResourceStore",
    "dijit/registry",
    "dojo/when",
    "dojox/mvc/at",
    "aps/load",
    "aps/ready!"
], function (ResourceStore, registry, when, at, load) {
    
    var store = new ResourceStore({
            target: "/aps/2/resources"
        });

    // city variable is defined in APP-META.xml
    // the only way we get to this view is by clicking on a city in 'cities' view, aps.id will be passed along to this view
    // so APS controller knows which resource should be sent to the client's browser
    var city = aps.context.vars.city;

    var widgets =
        ["aps/PageContainer", {id: "top_container"}, [
            ["aps/Output", {
                id: "description",
                content: "Here you can edit your subscription to track weather in a city.<br><br>Note: you cannot change city and country. If you want to stop tracking a city click 'Cancel', check the city you want to remove from tracking and click 'Delete' button."
            }],
            // the same widgets we have for city.add view, but city and country cannot be changed since they are considered primary properties for city resource
            ["aps/FieldSet", {title: true}, [
                ["aps/Output", {id: "city", label: "City", value: at(city, "city")}],
                ["aps/Output", {id: "country", label: "Country", value: at(city, "country")}],
                ["aps/TextBox", {id: "desc_city", label: "Why do you want to track this city?", value: at(city, "description")}],
                ["aps/Select", {
                    id: "units",
                    title: "System of measurement",
                    value: at(city, "units"),
                    options: [
                        { label: "Fahrenheit", value: "fahrenheit"},
                        { label: "Celsius", value: "celsius", selected: true}
                    ]
                }],
                ["aps/CheckBox", {id: "show_humidity", label: "Do you want to see humidity?", checked: at(city, "include_humidity")}]
            ]]
        ]];
    load(widgets);

    aps.app.onCancel = function() {
        aps.apsc.gotoView("cities");
    };

    aps.app.onSubmit = function() {
        var page = registry.byId("top_container");
        if (!page.validate()) {
            aps.apsc.cancelProcessing();
            return;
        }
        // put() method for a store object creates an object (POST) if aps.id is missing or modifies it (PUT) when aps.id is present in passed object
        when(store.put(city), function() {
            aps.apsc.gotoView("cities");
        });
   };
});