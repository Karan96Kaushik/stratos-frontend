const isMasked = str => /\*{3,}/.test(str);

const validateMobile = (val="") => {
    if (isMasked) return false
    if(val.length < 10)
        return true
    return false
}

const allClients = {
    texts: [
        // {label:"Date", id:"createdTime"},
        {label:"Name", id:"name"},
        {label:"Client Type", id:"clientType", isRequired:true},
        {label:"Promoter", id:"promoter"},
        // {label:"UserID", id:"userID"},
        // {label:"Password", id:"password"},
        {label:"Completion Date", id:"completionDate", type:"date"},
        // {label:"Mobile", id:"mobile"},
        // {label:"Email", id:"email"},
        // {label:"Remarks", id:"remarks"},
    ],
    checkboxes: []
}

export {allClients}
export default {
    all: {
        texts: [
            {label:"Completion Date", id:"completionDate", type:"date"},
        ]
    },
    Developers: {
        name:"Developers",
        texts:[
            {label:"Name", id:"name", isRequired:true},
            {label:"Promoter", id:"promoter"},
            {label:"Location", id:"location"},
            {label:"Plot No", id:"plotNum"},
            {label:"Plot Area", id:"plotArea"},
            {label:"Total Units", id:"totalUnits", type:"number"},
            {label:"Booked Units", id:"bookedUnits", type:"number"},
            {label:"Work Status", id:"workStatus"},
            {label:"UserID", id:"userID"},
            {label:"Password", id:"password"},
            {label:"RERA Cert No", id:"certNum"},
            {label:"Cert Date", id:"certDate", type:"date"},
            {label:"Mobile", id:"mobile", isRequired:true, validation:[validateMobile]},
            {label:"Office", id:"office"},
            {label:"Email", id:"email"},
            {label:"CA", id:"ca"},
            {label:"Engineer", id:"engineer"},
            {label:"Architect", id:"architect"},
            {label:"Reference", id:"reference"},
            {label:"Completion Date", id:"completionDate", type:"date"},
            {label:"Files", id:"files", type:"file"},
            {label:"Remarks", id:"remarks"},
        ],
        checkboxes:[
            {label:"Extension", id:"extension"},
        ]
    },
    Agents: {
        name:"Agent",
        texts:[
            {label:"Agent Name", id:"name"},
            {label:"Type", id:"type", isRequired:true},
            {label:"Location", id:"location"},
            {label:"UserID", id:"userID"},
            {label:"Password", id:"password"},
            {label:"Due Date", id:"dueDate"},
            {label:"RERA Cert No", id:"certNum"},
            {label:"Cert Date", id:"certDate", type:"date"},
            {label:"Mobile", id:"mobile", isRequired:true, validation:[validateMobile]},
            {label:"Email", id:"email"},
            {label:"Completion Date", id:"completionDate", type:"date"},
            {label:"Files", id:"files", type:"file"},
            {label:"Remarks", id:"remarks"},
        ],
        checkboxes:[
        ]
    },
    Litigation: {
        name:"Litigation",
        texts:[
            {label:"Buyer Name", id:"name"},
            {label:"Type", id:"type", isRequired:true},
            {label:"Location", id:"location"},
            {label:"UserID", id:"userID"},
            {label:"Password", id:"password"},
            {label:"Related Project Name", id:"relatedProject"},
            {label:"Related RERA No", id:"reraNum"},
            {label:"Mobile", id:"mobile", isRequired:true, validation:[validateMobile]},
            {label:"Email", id:"email"},
            {label:"Hearing Date", id:"completionDate", type:"date"},
            {label:"Files", id:"files", type:"file"},
            {label:"Remarks", id:"remarks"},
        ],
        checkboxes:[
            {label:"Pro Bono", id:"proBono"},
        ]
    }
}