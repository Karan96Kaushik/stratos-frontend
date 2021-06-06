export default {
    agentRegistration: {
        name:"Agent Registration",
        texts:[
            {label:"Remarks", id:"remarks"},
            {label:"Priority", id:"priority"},
        ],
        checkboxes:[
            {label:"Letterhead", id:"letterHead"},
            {label:"Receipt Format", id:"receiptFormat"},
            {label:"ITR", id:"itr"},
        ]
    },
    projectRegistration: {
        name:"Project Registration",
        texts:[
            {label:"Remarks", id:"remarks"},
            {label:"Priority", id:"priority", type:"number"},
        ],
        checkboxes:[
            {label:"Form 3", id:"form3"},
            {label:"Form 2", id:"form2"},
            {label:"Title Certificate", id:"titleCertificate"},
            {label:"Agreement Draft", id:"agreementDraft"},
        ]
    }
}