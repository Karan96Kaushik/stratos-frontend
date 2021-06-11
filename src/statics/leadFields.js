import taskFields from "./taskFields"

let services = Object.keys(taskFields).map(a => ([a, taskFields[a].name]))
services.unshift(["", ""])

export default {
    developer: {
        name:"Developer",
        texts:[
            {label:"Name", id:"name"},
            {label:"Project Name", id:"projectName"},
            {label:"Location", id:"location"},
            {label:"Plot No", id:"plotNum"},
            {label:"Plot Area", id:"plotArea"},
            {label:"RERA Cert No", id:"certNum"},
            {label:"Service Type", id:"serviceType", options:services},
            {label:"Mobile", id:"mobile"},
            {label:"Office", id:"office"},
            {label:"Email", id:"email"},
            {label:"Quote Amount", id:"quoteAmount", type:"number"},
        ],
        checkboxes:[
        ]
    },
    litigation: {
        name:"Litigation",
        texts:[
            {label:"Name", id:"name"},
            {label:"Type", id:"type"},
            {label:"Category", id:"category"},
            {label:"Service", id:"service"},
            {label:"Related Project Name", id:"projectName"},
            {label:"Related RERA No", id:"reraNum"},
        ],
        checkboxes:[
        ]
    },
    agent: {
        name:"Agent",
        texts:[
            {label:"Name", id:"name"},
            {label:"Mobile", id:"mobile"},
            {label:"Email", id:"email"},
        ],
        checkboxes:[
        ]
    }
}