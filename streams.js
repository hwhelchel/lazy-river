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
      return this.item.call(this.tail(), element - 1);
    }
  },

  map: function(proc){
    if (this.empty()){
      return new Stream();
    } else {
      return new Stream(proc(this.head()),this.map.call(this.tail(),proc));
    }
  },

  each: function(proc){
    if (this.empty()){
      return 'done';
    } else {
      proc(this.head());
      this.each.call(this.tail(), proc);
    }
  },

};

Stream.enumerateInterval = function(low, high) {
  if (low > high) {
    return new Stream();
  } else {
    return new Stream(low, Stream.enumerateInterval(low + 1, high));
  }
};

Stream.filter = function(predicate, stream){
  if (stream.empty()){
    return new Stream();
  } else if (predicate(stream.head())) {
    return new Stream(stream.head(),Stream.filter(predicate, stream.tail()));
  } else {
    return Stream.filter(predicate, stream.tail());
  }
};

var isPrime = function(num){
  return num === smallestDivisor(num);
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
  var willDivide = function(a, b){
    return b % a === 0;
  };
  return findDivisor(num, 2);
};

console.log(Stream.filter(isPrime, Stream.enumerateInterval(10000, 1000000)).tail().head());