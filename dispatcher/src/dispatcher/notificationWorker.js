const { parentPort, workerData } = require('worker_threads')
const { producer } = require ('../mq/rabbitmq')

let pNpA = []; // Array to store promises

// Function to execute code at each interval
const executeCode = async () => {
  try {
    // Execute the code with promises
    const result = await Promise.allSettled(pNpA);
    console.log('Promises settled:', result);
    
    // Clear the array after handling promises
    pNpA = [];
  } catch (error) {
    console.error('Error:', error);
  }
};

async function processTodo(notification) {

  const currentTime = Date.now();
  const deadlineTime = new Date(notification.deadline).getTime();
  const delay = deadlineTime - currentTime

  // Schedule the interval
  const intervalTime = 30 * 1000; // Interval of 30 seconds (in milliseconds)
  
  if(delay >= 0) {
    const pNp = new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await producer(notification));
      }, delay);
    });
    pNpA.push(pNp)
  }

  // Function to start the interval and execute the code
  const startInterval = () => {
    // Start the interval execution
    const intervalId = setInterval(executeCode, intervalTime);
  };

  // Start the interval and execute the code
  startInterval();
  
  // Rest of the code...
  console.log(`Sending notification: ${notification} with a foo sendNotification(notification)`)
}


processTodo(workerData)
  .then(() => {
    parentPort?.postMessage('success')
  })
  .catch((error) => {
    console.error('Error processing Todo:', error)
    parentPort?.postMessage('failure');
  });

