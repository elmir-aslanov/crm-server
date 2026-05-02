const openapi = {
    openapi: '3.0.3',
    info: {
        title: 'Mini CRM API',
        version: '1.0.0',
        description: 'OpenAPI specification for the mini CRM backend',
    },
    servers: [{ url: '/api' }],
    paths: {
        '/auth/login': { post: { summary: 'Login user' } },
        '/auth/refresh': { post: { summary: 'Refresh access token' } },
        '/leads': { get: { summary: 'List leads' }, post: { summary: 'Create lead' } },
        '/leads/{id}/status': { put: { summary: 'Update lead status' } },
        '/leads/{id}/notes': { post: { summary: 'Add lead note' }, get: { summary: 'List lead notes' } },
        '/payments/overdue': { get: { summary: 'List overdue payments' } },
        '/attendance/bulk': { post: { summary: 'Bulk attendance' } },
        '/dashboard/stats': { get: { summary: 'Dashboard stats' } },
    },
};

export default openapi;