const services = [
    'Consultation',
    'Site Updation',
    'Proof Reading',
    'Legal Documents',
    'Form 1',
    'Form 2',
    'Form 2A',
    'Form 3',
    'Form 5',
    'Format D',
    'Disclosure of Sold',
    'Other Services', 
]

export default {
    all: {
        texts: [
            {label:'Consultation', id:"consultation", options: ['Y', 'N']},
            {label:'Site Updation', id:"siteUpdation", options: ['Y', 'N']},
            {label:'Proof Reading', id:"proofReading", options: ['Y', 'N']},
            {label:'Form 1', id:"form1", options: ['Y', 'N']},
            {label:'Form 2', id:"form2", options: ['Y', 'N']},
            {label:'Form 2A', id:"form2a", options: ['Y', 'N']},
            {label:'Form 3', id:"form3", options: ['Y', 'N']},
            {label:'Form 5', id:"form5", options: ['Y', 'N']},
            {label:'Format D', id:"formatD", options: ['Y', 'N']},
            {label:'Disclosure of Sold', id:"disclosure", options: ['Y', 'N']},
            {label:'Other Services', id:"other", options: ['Y', 'N']},
        ],
        checkboxes: []
    }
}
