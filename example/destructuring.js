var oldCandyMachine = {
  status: {
    count: 5,
  },
  getCandy: function () {
    console.log("this1", this);
    this.oldCandyMachine.status.count--;
    return this.oldCandyMachine.status.count;
  },
};
var oldGetCandy = oldCandyMachine.getCandy;
var oldCount = oldCandyMachine.status.count;

oldGetCandy();
console.log("oldCount", oldCount);

const newCandyMachine = {
  status: {
    count: 5,
  },
  newGetCandy() {
    console.log("this2", this);
    newCandyMachine.status.count--;
    return newCandyMachine.status.count;
  },
};

const {
  status: { count: newCount },
  newGetCandy,
} = newCandyMachine;

newGetCandy();
console.log("newCount", newCount);

//window에서는 되고 nodejs에서는 안됨
