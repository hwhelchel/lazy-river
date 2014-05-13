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
  },

  range: function(low, high) {
    if (low > high) {
      return new Stream();
    } else {
      var self = this;
      return new Stream(low, function() {
        return self.range(low + 1, high);
      });
    }
  },

  filter: function(predicate){
    var self = this;
    if (self.empty()){
      return new Stream();
    } else if (predicate(self.head())) {
      return new Stream(self.head(), function() {
        return self.tail().filter(predicate);
      });
    } else {
      return self.tail().filter(predicate);
    }
  },

  sieve: function() {
    var self = this;
    return new Stream(self.head(), function() {
      return self.tail().filter(function(num) {
        return !willDivide(self.head(), num);
        }).sieve();
    });
  },

  zip: function(proc, stream) {
    if (this.empty()) {
      return stream;
    } else if (stream.empty()) {
      return this;
    }
    var self = this;
    return new Stream(proc(self.head(),stream.head(), function() {
      return self.tail().zip(proc, stream.tail());
    }));
  },

  add: function(stream) {
    return this.zip(function(value1, value2) {
      return value1 + value2;
    }, stream);
  }
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

Stream.integersStartingFrom = function(num) {
  return new Stream(num, function(){
    return integersStartingFrom(num += 1);
  });
};

Stream.fibGen = function(a, b) {
  return new Stream(a, function(){
    return fibGen(b, a + b);
  });
};

var fibonacci = Stream.fibGen(0, 1);

var primes = Stream.integersStartingFrom(2).sieve();
console.log(primes.item(50));
console.log(new Stream().range(10000,1000000).filter(isPrime).tail().head());