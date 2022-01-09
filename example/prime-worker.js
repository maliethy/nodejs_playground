const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

const min = 2;
let primes = [];

function findPrimes(start, range) {
  //   console.log("findPrimes", start, range);
  let isPrime = true;
  const end = start + range;

  for (let i = start; i < end; i++) {
    for (let j = min; j < Math.sqrt(end); j++) {
      if (i !== j && i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
    isPrime = true;
  }
}

if (isMainThread) {
  const max = 10000000;
  const threadCount = 8;
  const threads = new Set();
  const range = Math.ceil((max - min) / threadCount);

  let start = min;
  console.time("prime");
  for (let i = 0; i < threadCount - 1; i++) {
    threads.add(
      new Worker(__filename, {
        workerData: {
          start,
          range,
        },
      })
    );
    start += range;
  }

  threads.add(
    new Worker(__filename, {
      workerData: {
        start,
        range: range + ((max - min + 1) % threadCount), //range + 8이서 똑같이 나눈 값(1250000) + 8이서나누고 난 나머지(7)=  1250007
      },
    })
  );
  //1

  for (let worker of threads) {
    worker.on("error", (err) => {
      throw err;
    });
    worker.on("exit", () => {
      //   console.log("delete");
      threads.delete(worker); //5, 8, 11, 14, 17, 20, 23, 26
      if (threads.size === 0) {
        //27
        console.timeEnd("prime"); //28
        console.log(primes.length); //29
      }
    });
    worker.on("message", (msg) => {
      //   console.log("msg");
      primes = primes.concat(msg); //4, 7, 10, 13, 16, 19, 22, 25
    });
  }
} else {
  findPrimes(workerData.start, workerData.range); //2
  parentPort.postMessage(primes); //3, 6, 9, 12, 15, 18, 21, 24
}
