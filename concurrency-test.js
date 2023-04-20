/* eslint-disable @typescript-eslint/no-unused-vars */
import autocannon from 'autocannon';
let instanceNr = 1;

const instance = autocannon({
  url: 'http://localhost:8085/fav-fruit',
  setupClient,
  connections: 10,
  pipelining: 1,
  duration: 1
});
// results passed to the callback are the same as those emitted from the done events
instance.on('done', handleResults);
function setupClient(client) {
  client.setHeaders({ Cookie: 'sessionId=' + instanceNr });
  instanceNr++;
  client.on('body', (response) => {
    // const enc = new TextDecoder('utf-8');
    // const result = enc.decode(response);

  });
}
function handleResults(result) {
  console.log('done');
}
