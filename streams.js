// streams
function Stream(head, tail) {
    if ( typeof head !== 'undefined' ) {
        this.headValue = head;
    }
    if ( typeof tail === 'undefined' ) {
        tail = function () {
            return new Stream();
        };
    }
    this.tailValue = this.delay(tail);
  }

Stream.prototype = {
  empty: function() {
    return typeof this.head() === 'undefined';
  },

  head: function(){
    return this.headValue;
  },

  tail: function(){
    return this.force(this.tailValue);
  },

  delay: function(tail) {
    return this._memoTail(tail);
  },

  _memoTail: function(tail){
    var hasRun = false;
    var result;
    return function(){
      if(!hasRun) {
        result = tail();
        hasRun = true;
        return result;
      } else {
        return result;
      }
    };
  },

  force: function(delayedTail){
    return delayedTail();
  },

  item: function(element) {
    if (element === 0){
      return this.head();
    } else {
      return this.tail().item(element - 1);
    }
  },

  map: function(proc){
    if (this.empty()){
      return new Stream();
    } else {
      var self = this;
      return new Stream(proc(this.head()), function() {
        return self.tail().map(proc);
      });
    }
  },

  each: function(proc){
    if (this.empty()){
      return 'done';
    } else {
      proc(this.head());
      this.tail().each(proc);
    }
  }

};

Stream.range = function(low, high) {
  if (low > high) {
    return new Stream();
  } else {
    return new Stream(low, function() {
      return Stream.range(low + 1, high);
    });
  }
};

Stream.filter = function(predicate, stream){
  if (stream.empty()){
    return new Stream();
  } else if (predicate(stream.head())) {
    return new Stream(stream.head(), function() {
      return Stream.filter(predicate, stream.tail());
    });
  } else {
    return Stream.filter(predicate, stream.tail());
  }
};

Stream.sieve = function(stream){
  return new Stream(stream.head(), function() {
    return Stream.sieve(Stream.filter(function(num) {
      return !willDivide(stream.head(), num);
      }, stream.tail()));
  });
};

var smallestDivisor = function(num) {
  var findDivisor = function(num, testDivisor){
    if (testDivisor*testDivisor > num){
      return num;
    } else if (willDivide(testDivisor, num)) {
      return testDivisor;
    } else {
      return findDivisor(num, testDivisor + 1);
    }
  };
  return findDivisor(num, 2);
};

var isPrime = function(num){
  return num === smallestDivisor(num);
};

var willDivide = function(a, b){
  return b % a === 0;
};

var integersStartingFrom = function(num) {
  return new Stream(num, function(){
    return integersStartingFrom(num += 1);
  });
};

var integers = integersStartingFrom(1);

var notDivisibleBySeven = function() {
  return Stream.filter(function(num){
    return !willDivide(7, num);
  }, integers);
};

var primes = Stream.sieve(integersStartingFrom(2));
console.log(primes.item(50));
console.log(primes.head());

console.log(notDivisibleBySeven().item(100));
// console.log(integers.head());
// console.log(integers.tail().head());
// console.log(Stream.filter(isPrime, Stream.range(10000, 1000000)).tail().head());