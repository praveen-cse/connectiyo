var json = {
    questions: [
        {
            name: "name",
            type: "text",
            title: "Please enter your name:",
            placeHolder: "Jon Snow",
            isRequired: true
        }, {
            name: "birthdate",
            type: "text",
            inputType: "date",
            title: "Your birthdate:",
            isRequired: true
        }, {
            name: "color",
            type: "text",
            inputType: "color",
            title: "Your favorite color:"
        }, {
            name: "email",
            type: "text",
            inputType: "email",
            title: "Your e-mail:",
            placeHolder: "jon.snow@nightwatch.org",
            isRequired: true,
            validators: [
                {
                    type: "email"
                }
            ]
        }, {
            type: "radiogroup",
            name: "car",
            title: "What car are you driving?",
            isRequired: true,
            colCount: 4,
            choices: [
                "None",
                "Ford",
                "Vauxhall",
                "Volkswagen",
                "Nissan",
                "Audi",
                "Mercedes-Benz",
                "BMW",
                "Peugeot",
                "Toyota",
                "Citroen"
            ]
        },
        {
            type: "checkbox",
            name: "car",
            title: "What car are you driving?",
            isRequired: true,
            hasNone: true,
            colCount: 4,
            choices: [
                "Ford",
                "Vauxhall",
                "Volkswagen",
                "Nissan",
                "Audi",
                "Mercedes-Benz",
                "BMW",
                "Peugeot",
                "Toyota",
                "Citroen"
            ]
        },
        {
            "type": "boolean",
            "name": "bool",
            "title": "Please answer the question",
            "label": "Are you 21 or older?",
            "isRequired": true
        },{
            type: "rating",
            name: "satisfaction",
            title: "How satisfied are you with the Product?",
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied"
        }
    ]
};

window.survey = new Survey.Model(json);

survey
    .onComplete
    .add(function (result) {
        document
            .querySelector('#surveyResult')
            .textContent = "result: " + JSON.stringify(result.data);
    });

$("#surveyElement").Survey({model: survey});
