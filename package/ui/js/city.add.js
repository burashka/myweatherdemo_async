require([
    "aps/ResourceStore",
    "dijit/registry",
    "dojox/mvc/at",
    "dojo/when",
    "aps/load",
    "dojo/text!./js/city.json",
    "aps/ready!"
], function (ResourceStore, registry, at, when, load, newCity) {

    // creating a connector to APS controller, target is collection 'cities' defined in subscription_service 
    // that holds all of the cities associated with a specific subscription_serivce
    var store = new ResourceStore({
        target: "/aps/2/resources/" + aps.context.vars.subscription_service.aps.id + "/cities"
    });

    // loading skeleton for a city to be created from city.json
    var city = JSON.parse(newCity);

    var widgets =
        ["aps/PageContainer", {id: "top_container"}, [
            ["aps/Output", {
                id: "description",
                value: "Here you can create a subscription to track weather in a city."
            }],
            ["aps/FieldSet", {title: true}, [
                ["aps/TextBox", {id: "city", label: "City", value: at(city, "city"), required: true}],
                ["aps/TextBox", {id: "country", label: "Country", value: at(city, "country"), required: true}],
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

    // if the user clicks "Cancel" button he should be redirected to listing of the cities
    aps.app.onCancel = function() {
        aps.apsc.gotoView("cities");
    };

    aps.app.onSubmit = function() {
        var page = registry.byId("top_container");
            if (!page.validate()) {
                aps.apsc.cancelProcessing();
                return;
            }
        // creating city from information collected from widgets
        when(store.put(city), function() {
            // if city was created successfully the user should be redirected to listing of cities
            aps.apsc.gotoView("cities");
        });
    };
});