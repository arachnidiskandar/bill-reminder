import { Router } from 'express';

import createPaymentsAction from './calculatePayments';

const actionsRoutes = Router();

actionsRoutes.post('/createPayments', createPaymentsAction);

export default actionsRoutes;
