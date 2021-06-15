export default {
    project: {
        name:"Project",
        texts:[
            {label:"Name", id:"name", isRequired:true},
            {label:"Promoter", id:"promoter"},
            {label:"Loaction", id:"location"},
            {label:"Plot No", id:"plotNum"},
            {label:"Plot Area", id:"plotArea"},
            {label:"Total Units", id:"totalUnits", type:"number"},
            {label:"Booked Units", id:"bookedUnits", type:"number"},
            {label:"Work Status", id:"workStatus"},
            {label:"UserID", id:"userID"},
            {label:"password", id:"password"},
            {label:"RERA Cert No", id:"certNum"},
            {label:"Cert Date", id:"certDate"},
            {label:"Mobile", id:"mobile"},
            {label:"Office", id:"office"},
            {label:"Email", id:"email"},
            {label:"CA", id:"ca"},
            {label:"Engineer", id:"engineer"},
            {label:"Architect", id:"architect"},
            {label:"Reference", id:"reference"},
            {label:"Remarks", id:"remarks"},
            {label:"Completion Date", id:"completionDate"},
        ],
        checkboxes:[
            {label:"Extension", id:"extension"},
        ]
    },
    agent: {
        name:"Agent",
        texts:[
            {label:"Agent Name", id:"name"},
            {label:"Type", id:"type"},
            {label:"Loaction", id:"location"},
            {label:"UserID", id:"userID"},
            {label:"password", id:"password"},
            {label:"Due Date", id:"dueDate"},
            {label:"RERA Cert No", id:"certNum"},
            {label:"Cert Date", id:"certDate"},
            {label:"Mobile", id:"mobile"},
            {label:"Email", id:"email"},
            {label:"Remarks", id:"remarks"},
            {label:"Completion Date", id:"completionDate"},
        ],
        checkboxes:[
        ]
    },
    litigation: {
        name:"Litigation",
        texts:[
            {label:"Buyer Name", id:"name"},
            {label:"Type", id:"type"},
            {label:"Loaction", id:"location"},
            {label:"UserID", id:"userID"},
            {label:"password", id:"password"},
            {label:"Related Project Name", id:"relatedProject"},
            {label:"Related RERA No", id:"reraNum"},
            {label:"Mobile", id:"mobile"},
            {label:"Email", id:"email"},
            {label:"Remarks", id:"remarks"},
            {label:"Completion Date", id:"completionDate"},
        ],
        checkboxes:[
            {label:"Pro Bono", id:"proBono"},
        ]
    }
}