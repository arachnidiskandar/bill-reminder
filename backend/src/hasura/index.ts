import { Router } from 'express';

import createPaymentsAction from './actions/calculatePayments';
import delayedPaymentsTrigger from './triggers/delayedBills';

const actionsRoutes = Router();

actionsRoutes.post('/create-payments', createPaymentsAction);
actionsRoutes.post('/set-delayed-payments', delayedPaymentsTrigger);

export default actionsRoutes;
