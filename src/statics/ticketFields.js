const ticketFields = {
    // all: {
        texts:[
            // {label:"Ticket ID", id:"ticketID", isHidden:true},
            {label:"Status", id:"status", options:['', 'Open', 'Closed']},
            {label:"Files", id:"files", type:"file"},
        ],
        checkboxes:[
        ]
    // },
}

const messengerFields = {
    // all: {
        texts:[
            {label:"Files", id:"files", type:"file", isHidden:true},
        ],
        checkboxes:[
        ]
    // },
}

export {messengerFields} 
export default ticketFields

