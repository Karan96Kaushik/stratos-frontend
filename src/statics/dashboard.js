const personalDashboards = {
    departments: {
        'Business Development': {
            dashboards: [
                'Business Development',
            ]
        },
        'Compliance': {
            dashboards: [
                'Extension',
            ]
        },
        'Operations': {
            dashboards: [
                'Extension',
            ]
        },
        'Administration': {
            dashboards: [
                'Extension',
            ]
        },
    },
    dashboards: {
        'Business Development': {
            components: {
                'Calls': {
                    type: 'multicard',
                    dateUsed: true,
                    fields: [
                        {title:'Total Scheduled'},
                        {title:'Pending'},
                        {title:'Calls Made'},
                        {title:'Calls Connected'},
                        {title:'Calls Made Today'},
                        // {title:'Future'},
                    ],
                    api: '/api/dashboard/sales',
                    linkpre: '/app/sales/edit/',
                    linkfield: '_id',
                },
                'Follow Ups Scheduled': {
                    type: 'multicard',
                    dateUsed: true,
                    fields: [
                        {title:'Total'},
                        {title:'Pending'},
                        {title:'Today'},
                        {title:'Future'},
                    ],
                    api: '/api/dashboard/followups',
                },
                'Meetings Scheduled': {
                    type: 'multicard',
                    dateUsed: true,
                    fields: [
                        {title:'Total'},
                        {title:'Pending'},
                        {title:'Today'},
                        {title:'Future'},
                    ],
                    api: '/api/dashboard/meetings',
                },
                'Upcoming Follow Ups': {
                    type: 'list',
                    fields: [
                        {label:'Date', id:'followUpDate'},
                        {label:'Sales ID', id:'salesID'},
                        {label:'Promoter', id:'promoterName'},
                    ],
                    api: '/api/dashboard/calendar/followups',
                    linkpre: '/app/sales/edit/',
                    linkfield: '_id',
                },
                'Upcoming Meetings': {
                    type: 'list',
                    fields: [
                        {label:'Date', id:'meetingDate'},
                        {label:'Sales ID', id:'salesID'},
                        {label:'Promoter', id:'promoterName'},
                    ],
                    api: '/api/dashboard/calendar/meetings',
                    linkpre: '/app/sales/edit/',
                    linkfield: '_id',
                }
            }
        },
        'Extension': {
            components: {
                'Ready for Submission': {
                    type: 'list',
                    fields: [
                        {label:'Task ID', id:'taskID'},
                        {label:'Client', id:'clientName'},
                        {label:'Members Allocated', id:'membersAllocated'},
                        {label:'Type', id:'serviceType'},
                        {label:'Promoter', id:'promoter'},
                    ],
                    api: '/api/dashboard/ready-for-submission',
                    linkpre: '/app/tasks?text=',
                    linkfield: 'taskID',
                },
                'Ready for Submission (Promoter Sign Pending)': {
                    type: 'list',
                    fields: [
                        {label:'Task ID', id:'taskID'},
                        {label:'Client', id:'clientName'},
                        {label:'Members Allocated', id:'membersAllocated'},
                        {label:'Type', id:'serviceType'},
                        {label:'Promoter', id:'promoter'},
                    ],
                    api: '/api/dashboard/ready-for-submission?pending=true',
                    linkpre: '/app/tasks?text=',
                    linkfield: 'taskID',
                },
            }
        },

    }
}

const adminDashboards = {
    dashboards: {
        'Business Development': {
            components: {
                'Calls': {
                    type: 'multicard',
                    dateUsed: true,
                    fields: [
                        {title:'Total Scheduled'},
                        {title:'Pending'},
                        {title:'Calls Made'},
                        {title:'Calls Connected'},
                        {title:'Calls Made Today'},
                        // {title:'Future'},
                    ],
                    api: '/api/dashboard/sales'
                },
                'Follow Ups Scheduled': {
                    type: 'multicard',
                    dateUsed: true,
                    fields: [
                        {title:'Total'},
                        {title:'Pending'},
                        {title:'Today'},
                        {title:'Future'},
                    ],
                    api: '/api/dashboard/followups'
                },
                'Meetings Scheduled': {
                    type: 'multicard',
                    dateUsed: true,
                    fields: [
                        {title:'Total'},
                        {title:'Pending'},
                        {title:'Today'},
                        {title:'Future'},
                    ],
                    api: '/api/dashboard/meetings'
                },
            }
        },
    }
}


export {
    personalDashboards,
    adminDashboards
}