import cors from 'cors';
import express from 'express';
import { request, GraphQLClient, gql } from 'graphql-request';
import webpush from 'web-push';

const client = new GraphQLClient('http://host.docker.internal:8080/v1/graphql', {
  headers: { 'content-type': 'application/json', 'x-hasura-admin-secret': 'admin_secret', 'x-hasura-role': 'admin' },
});
const app = express();

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const vapidKeys = {
  publicKey: 'BKG8GSJRi8ffkM-pzAptAXtCfrFIFikdLdgWPSrITDftPYJmvTXunyTd66e6LXwtj5SfP_aEPnb8IATFiFotEKE',
  privateKey: 'C17qro5eEScvZeGAxbdX10JqPad5G59HQ0_XI7HCNAY',
};
app.get('/', (request, response) => response.json({ message: 'Hello World' }));

webpush.setVapidDetails('mailto:test@code', vapidKeys.publicKey, vapidKeys.privateKey);

// function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
  webpush.sendNotification(subscription, dataToSend).catch((err) => console.log(err));
};
const query = gql`
  query getNotificationsSubscriptions($date: date, $repeatType: bill_reapet_type_enum) {
    bills(where: { dueDate: { _eq: $date }, repeatType: { _eq: $repeatType } }) {
      notificationSubscription
    }
  }
`;
// route to test send notification
app.post('/send-monthly-notifications', async (req, res) => {
  try {
    const { bills } = await client.request(query, { date: '2021-10-19', repeatType: 'MONTHLY' });
    bills.map((bill) =>
      sendNotification(JSON.parse(bill.notificationSubscription), 'Sua conta está próxima de vencer')
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
const updateQuery = gql`
  mutation MyMutation($userId: String, $notificationSubscription: String) {
    update_Bills(
      where: { User: { auth0Id: { _eq: $userId } } }
      _set: { notificationSubscription: $notificationSubscription }
    ) {
      affected_rows
    }
  }
`;
app.post('/update-subscription', async (req, res) => {
  const { id, endpoint } = req.body;
  try {
    const response = await client.request(updateQuery, { userId: id, notificationSubscription: endpoint });
    console.log('Endpoint updated');
  } catch (error) {
    console.error(error);
  }
});

// const sub = {};
// webpush.sendNotification(sub, 'test');

app.listen(4000);
